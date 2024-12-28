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
import { v4 as uuidv4 } from "uuid";
import path from "path";
import fs from "fs";
import OrderModel from "../models/Order.model";
const UPLOAD_DIR = path.join(__dirname, "../public/uploads");
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

export const getCategoriesService = asyncHandler(
  async (
    req: AuthenticatedRequestBody<ICategory>,
    res: Response,
    next: NextFunction
  ) => {
    const categories = await CategoryModel.find();
    if (!categories) {
      throw new BadRequestError("Categories not found");
    }
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
    const categories = await newCategory.save();

    res.status(201).json({
      status: "Add category successful",
      categories,
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
    const category = await CategoryModel.findById(req.params.categoryId);
    if (!category) {
      throw new BadRequestError("Category not found");
    }
    category.name = name;
    category.subcategories = subcategories;
    const updatedCategory = await category.save();
    
    res.status(200).json({
      status: "Update successful",
      data: updatedCategory,
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
    const {
      name,
      description,
      price,
      stock_quantity,
      brand,
      sizes,
      category,
      subcategory,
      textEditor,
    } = req.body;
    console.log("req.body 21", req.body);
    console.log("req.files 213", req.files);
    const productExist = await ProductModel.findOne({ name: name });
    if (productExist) {
      throw new BadRequestError("Product already exists");
    }

    // Tạo thư mục uploads nếu chưa tồn tại
    if (!fs.existsSync(UPLOAD_DIR)) {
      fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    }

    const files = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };
    // Xử lý ảnh chính
    let mainImagePath = "";
    const mainImageFiles = files["mainImage"];
    if (mainImageFiles && mainImageFiles.length > 0) {
      const mainFile = mainImageFiles[0];
      const filename = `${uuidv4()}${path.extname(mainFile.originalname)}`;
      const filepath = path.join(UPLOAD_DIR, filename);

      await fs.promises.writeFile(filepath, mainFile.buffer);
      mainImagePath = `/images/${filename}`;
    }

    // Xử lý ảnh chi tiết
    const detailImagePaths: string[] = [];
    const imageFiles = files["images"];
    if (imageFiles) {
      for (const file of imageFiles) {
        const filename = `${uuidv4()}${path.extname(file.originalname)}`;
        const filepath = path.join(UPLOAD_DIR, filename);

        await fs.promises.writeFile(filepath, file.buffer);
        detailImagePaths.push(`/images/${filename}`);
      }
    }

    const newProduct = new ProductModel({
      name,
      description,
      price,
      stock_quantity,
      sizes,
      brand,
      product_Image: mainImagePath,
      product_Images: detailImagePaths,
      category: category,
      subcategory: subcategory,
      textEditor: textEditor,
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
    const {
      name,
      description,
      price,
      stock_quantity,
      brand,
      isUpdateImg,
      isActive,
      sizes,
      category,
      subcategory,
      textEditor,
    } = req.body;
    const { productId } = req.params;
    console.log("req.body update", req.body);
    console.log("req.files update", req.files);
    const product = await ProductModel.findById(productId);
    if (!product) {
      throw new BadRequestError("Product not found");
    }

    if (isUpdateImg) {
      console.log("có ảnh update");
      const files = req.files as {
        [fieldname: string]: Express.Multer.File[];
      };

      // Xử lý ảnh chính mới
      const mainImageFiles = files["mainImage"];
      if (mainImageFiles && mainImageFiles.length > 0) {
        // Xóa ảnh cũ nếu có
        if (product.product_Image) {
          const oldPath = path.join(
            process.cwd(),
            "public",
            product.product_Image
          );
          if (fs.existsSync(oldPath)) {
            fs.unlinkSync(oldPath);
          }
        }

        // Lưu ảnh mới
        const mainFile = mainImageFiles[0];
        const filename = `${uuidv4()}${path.extname(mainFile.originalname)}`;
        const filepath = path.join(UPLOAD_DIR, filename);
        await fs.promises.writeFile(filepath, mainFile.buffer);
        product.product_Image = `/images/${filename}`;
      }

      // Xử lý ảnh chi tiết mới
      const imageFiles = files["images"];
      if (imageFiles && imageFiles.length > 0) {
        // Xóa các ảnh chi tiết cũ
        if (product.product_Images && product.product_Images.length > 0) {
          for (const oldImage of product.product_Images) {
            const oldPath = path.join(process.cwd(), "public", oldImage);
            if (fs.existsSync(oldPath)) {
              fs.unlinkSync(oldPath);
            }
          }
        }

        // Lưu các ảnh mới
        const newDetailPaths = [];
        for (const file of imageFiles) {
          const filename = `${uuidv4()}${path.extname(file.originalname)}`;
          const filepath = path.join(UPLOAD_DIR, filename);
          await fs.promises.writeFile(filepath, file.buffer);
          newDetailPaths.push(`/images/${filename}`);
        }
        product.product_Images = newDetailPaths;
      }
    }

    // Cập nhật các trường khác
    if (name) product.name = name;
    if (description) product.description = description;
    if (price) product.price = price;
    if (stock_quantity) product.stock_quantity = stock_quantity;
    if (brand) product.brand = brand;
    if (isActive !== undefined) product.isActive = isActive;
    if (sizes) product.sizes = sizes;
    if (category) product.category = category;
    if (subcategory) product.subcategory = subcategory;
    if (textEditor) product.textEditor = textEditor;
    const productUpdated = await product.save();
    res.status(200).json({
      status: "Update successful",
      data: productUpdated,
    });
  }
);

export const getOrderThisYearService = asyncHandler(
  async (
    req: AuthenticatedRequestBody<any>,
    res: Response,
    next: NextFunction
  ) => {
    const totalOrder = await OrderModel.countDocuments();
    if (!totalOrder) {
      throw new BadRequestError("Order not found");
    }
    res.status(200).json({ totalOrder });
  }
);

export const getOrderInDecemberService = asyncHandler(
  async (
    req: AuthenticatedRequestBody<any>,
    res: Response,
    next: NextFunction
  ) => {
    const startOfDecember = new Date(new Date().getFullYear(), 11, 1); // Tháng 12, ngày 1
    const endOfDecember = new Date(new Date().getFullYear(), 12, 1); // Tháng 1, ngày 1

    const result = await OrderModel.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startOfDecember, // Lọc các đơn hàng từ ngày 1 tháng 12
            $lt: endOfDecember, // Lọc các đơn hàng đến ngày 1 tháng 1 năm sau
          },
        },
      },
      {
        $project: {
          day: { $dayOfMonth: "$createdAt" }, // Trích xuất ngày trong tháng từ createdAt
          year: { $year: "$createdAt" }, // Trích xuất năm
          month: { $month: "$createdAt" }, // Trích xuất tháng
        },
      },
      {
        $group: {
          _id: { day: "$day", month: "$month", year: "$year" }, // Nhóm theo ngày, tháng và năm
          orderCount: { $sum: 1 }, // Đếm số đơn hàng trong từng ngày
        },
      },
      {
        $sort: { "_id.day": 1 }, // Sắp xếp theo ngày
      },
    ]);

    // Nếu không có đơn hàng nào trong tháng 12
    const orderStats = Array.from({ length: 31 }, (_, i) => {
      const dayData = result.find((item) => item._id.day === i + 1);
      return {
        day: i + 1,
        orderCount: dayData ? dayData.orderCount : 0,
      };
    });

    res.status(200).json({
      month: 12,
      orderStats,
    });
  }
);

export const getAllUserServices = asyncHandler(
  async (
    req: AuthenticatedRequestBody<IUser>,
    res: Response,
    next: NextFunction
  ) => {
    const { page, limit } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    const userList = await UserModel.find().skip(skip).limit(Number(limit));
    if (!userList) {
      throw new BadRequestError("User not found");
    }
    const total = await UserModel.countDocuments();
    res.status(200).json({
      status: "success",
      data: {
        userList,
        pagination: {
          total,
          page: Number(page),
          pages: Math.ceil(total / Number(limit)),
          limit: Number(limit),
        },
      },
    });
  }
);

export const getUserOrderService = asyncHandler(
  async (
    req: AuthenticatedRequestBody<IUser>,
    res: Response,
    next: NextFunction
  ) => {
    const { limit, page } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const orders = await OrderModel.find()
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 });
    if (!orders) {
      throw new BadRequestError("Error while getting user orders");
    }
    const total = await OrderModel.countDocuments();
    res.status(200).json({
      status: "success",
      data: {
        orders,
        pagination: {
          total,
          page: Number(page),
          pages: Math.ceil(total / Number(limit)),
          limit: Number(limit),
        },
      },
    });
  }
);
