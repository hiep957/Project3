import { Auth } from "mongodb";
import asyncHandler from "../utils/asyncHandler";
import { AuthenticatedRequestBody } from "../interfaces/CustomType";
import { IUser } from "../interfaces/User";
import { NextFunction, Response } from "express";
import UserModel from "../models/User.model";
import { BadRequestError } from "../utils/ApiError";
import bcrypt from "bcryptjs";
import TokenModel from "../models/Token.model";
import { SignOptions } from "jsonwebtoken";
import { ICategory } from "../interfaces/Category";
import CategoryModel from "../models/Category.model";
import { IProduct } from "../interfaces/Product";
import { uploadImages } from "../routes/upload.route";
import ProductModel from "../models/Product.model";
import { uploadImage } from "./upload.service";
import { v2 as cloudinary } from "cloudinary";
export const adminAddUserService = asyncHandler(
  async (
    req: AuthenticatedRequestBody<IUser>,
    res: Response,
    next: NextFunction
  ) => {
    const { name, surname, email, password, confirmPassword, role } = req.body;
    let user = await UserModel.findOne({ email: email });

    if (user) {
      throw new BadRequestError("User already exists");
    }
    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = new UserModel({
      name,
      surname,
      email,
      password: hashedPassword,
      confirmPassword: hashedPassword,
      role,
    });
    const userSaved = await newUser.save();

    let token = await new TokenModel({ userId: userSaved._id });

    const payload = {
      userId: userSaved._id,
    };

    const accessTokenKey = process.env.ACCESS_TOKEN_SECRET as string;
    const refreshTokenKey = process.env.REFRESH_TOKEN_SECRET as string;

    const accessTokenOptions: SignOptions = {
      expiresIn: "15m",
      audience: String(userSaved._id),
    };

    const refreshTokenOptions: SignOptions = {
      expiresIn: "7d",
      audience: String(userSaved._id),
    };

    const generatedAccessToken = await token.generateToken(
      payload,
      accessTokenKey,
      accessTokenOptions
    );
    const generatedRefreshToken = await token.generateToken(
      payload,
      refreshTokenKey,
      refreshTokenOptions
    );

    token.accessToken = generatedAccessToken;
    token.refreshToken = generatedRefreshToken;

    token = await token.save();

    const data = {
      user: userSaved,
      accessToken: token.accessToken,
      refreshToken: token.refreshToken,
    };

    return res.status(201).json({
      status: "Add user successful",
      data,
    });
  }
);

export const adminUpdateUserService = asyncHandler(
  async (
    req: AuthenticatedRequestBody<IUser>,
    res: Response,
    next: NextFunction
  ) => {
    console.log("đã vào đây");
    const { name, surname, email } = req.body;
    const updateFields: any = {};

    if (name !== undefined) {
      updateFields.name = name;
    }
    if (surname !== undefined) {
      updateFields.surname = surname;
    }
    if (email !== undefined) {
      updateFields.email = email;
    }
    const updateUser = await UserModel.findByIdAndUpdate(
      req.params.userId,
      updateFields,
      { new: true }
    );

    if (!updateUser) {
      throw new BadRequestError("User not updated");
    }
    res
      .status(200)
      .json({ message: "User updated successfully", user: updateUser });
  }
);

export const adminGetCategoryService = asyncHandler(
  async (
    req: AuthenticatedRequestBody<ICategory>,
    res: Response,
    next: NextFunction
  ) => {
    const categories = await CategoryModel.find();
    res.status(200).json({ categories });
  }
);

export const adminAddCategoryService = asyncHandler(
  async (
    req: AuthenticatedRequestBody<ICategory>,
    res: Response,
    next: NextFunction
  ) => {
    const { name, subcategories } = req.body;
    let category = await CategoryModel.findOne({ name: name });

    if (category) {
      throw new BadRequestError("Category already exists");
    }

    const newCategory = new CategoryModel({
      name,
      subcategories,
    });
    const categorySaved = await newCategory.save();

    res.status(201).json({
      status: "Add category successful",
      data: categorySaved,
    });
  }
);

export const adminUpdateCategoryService = asyncHandler(
  async (
    req: AuthenticatedRequestBody<ICategory>,
    res: Response,
    next: NextFunction
  ) => {
    const { name, subcategories } = req.body;
    const updateFields: any = {};

    if (name !== undefined) {
      updateFields.name = name;
    }
    if (subcategories !== undefined) {
      updateFields.subcategories = subcategories;
    }

    const updateCategory = await CategoryModel.findByIdAndUpdate(
      req.params.categoryId,
      updateFields,
      { new: true }
    );

    if (!updateCategory) {
      throw new BadRequestError("Category not updated");
    }
    res.status(200).json({
      message: "Category updated successfully",
      category: updateCategory,
    });
  }
);

export const adminDeleteCategoryService = asyncHandler(
  async (
    req: AuthenticatedRequestBody<ICategory>,
    res: Response,
    next: NextFunction
  ) => {
    const category = await CategoryModel.findByIdAndDelete(
      req.params.categoryId
    );
    if (!category) {
      throw new BadRequestError("Category not found");
    }
    res.status(200).json({ message: "Category deleted successfully" });
  }
);

export const adminAddProductService = asyncHandler(
  async (
    req: AuthenticatedRequestBody<IProduct>,
    res: Response,
    next: NextFunction
  ) => {
    const files = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };
    const mainImageFiles = files["mainImage"];
    const imageFiles = files["images"];
    let mainImageUrl: string | undefined;
    let mainImageCloudinaryId: string | undefined;

    if (mainImageFiles && mainImageFiles.length > 0) {
      const mainImageUpload = await uploadImage(mainImageFiles[0]);
      mainImageUrl = mainImageUpload.url;
      mainImageCloudinaryId = mainImageUpload.public_id; // Use public_id for cloudinary ID
    }
    // Upload detail images
    let detailImagesUrls: any[] = [];
    if (imageFiles && imageFiles.length > 0) {
      const detailImagesUpload = await Promise.all(imageFiles.map(uploadImage));
      detailImagesUrls = detailImagesUpload.map((uploadResponse) => ({
        url: uploadResponse.url,
        cloudinary_id: uploadResponse.public_id,
      }));
    }
    console.log("detailImagesUrls", detailImagesUrls);
    const { category_id } = req.params;
    const { name, description, price, stock_quantity, brand } = req.body;
    const newProduct = new ProductModel({
      name,
      description,
      price,
      stock_quantity,
      brand,
      product_Image: {
        url: mainImageUrl,
        cloudinary_id: mainImageCloudinaryId,
      },
      product_Images: detailImagesUrls,
      category_id,
    });
    const product = await newProduct.save();
    res.status(201).json({
      status: "Upload successful",
      data: product,
    });
  }
);

export const adminUpdateProductService = asyncHandler(
  async (
    req: AuthenticatedRequestBody<IProduct>,
    res: Response,
    next: NextFunction
  ) => {
    const { name, description, price, stock_quantity, brand, isUpdateImg, isActive } =
      req.body;
    const { productId } = req.params;
    const product = await ProductModel.findById(productId);

    if (!product) {
      throw new BadRequestError("Product not found");
    }

    if (isUpdateImg) {
      const files = req.files as {
        [fieldname: string]: Express.Multer.File[];
      };

      const mainImageFiles = files["mainImage"];
      const imageFiles = files["images"];

      // If new main image is provided, upload it and update the existing one
      if (mainImageFiles && mainImageFiles.length > 0) {
        // Delete old image from Cloudinary if it exists
        if (product.product_Image.cloudinary_id) {
          await cloudinary.uploader.destroy(
            product.product_Image.cloudinary_id
          );
        }

        // Upload the new main image
        const mainImageUpload = await uploadImage(mainImageFiles[0]);
        product.product_Image.url = mainImageUpload.url;
        product.product_Image.cloudinary_id = mainImageUpload.public_id;
      }

      // If new detail images are provided, handle their upload
      if (imageFiles && imageFiles.length > 0) {
        // Optionally: Remove old detail images from Cloudinary
        for (const img of product.product_Images) {
          await cloudinary.uploader.destroy(img.cloudinary_id);
        }

        // Upload new detail images
        const detailImagesUpload = await Promise.all(
          imageFiles.map(uploadImage)
        );
        product.product_Images = detailImagesUpload.map((uploadResponse) => ({
          url: uploadResponse.url,
          cloudinary_id: uploadResponse.public_id,
        }));
      }
    }

    if (name) product.name = name;
    if (description) product.description = description;
    if (price) product.price = price;
    if (stock_quantity) product.stock_quantity = stock_quantity;
    if (brand) product.brand = brand;
    if (isActive !== undefined) product.isActive = isActive;
    const productUpdated = await product.save();
    res.status(200).json({
      status: "Update successful",
      data: productUpdated,
    })
  }
);
