import { NextFunction, Request, Response } from "express";
import {
  AuthenticatedRequestBody,
  IGetProductsRequest,
} from "../interfaces/CustomType";
import ProductModel from "../models/Product.model";
import asyncHandler from "../utils/asyncHandler";
import { BadRequestError } from "../utils/ApiError";
import { IProduct } from "../interfaces/Product";
import OrderModel from "../models/Order.model";

export const getProductService = asyncHandler(async (req, res, next) => {
  if (!req.params.productId)
    throw new BadRequestError("Product ID is required");

  const product = await ProductModel.findById(req.params.productId);
  if (!product) throw new BadRequestError("Product not found");

  res.status(200).json({
    status: "success",
    data: product,
  });
});

export const getProductsService = asyncHandler(
  async (req: Request, res: Response, next) => {
    const {
      page,
      limit,
      sort,
      search,
      minPrice,
      maxPrice,
      brand,
      category,
      subcategory,
    } = req.query;

    const query: any = { isActive: true };
    let sortQuery = {};
    //search
    if (search) {
      query.$text = { $search: search as string };
      sortQuery = { score: { $meta: "textScore" } };
    }
    //price
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    //brand
    if (brand) {
      query.brand = { $regex: brand, $options: "i" };
    }

    if (category) {
      query.category = { $regex: category, $options: "i" };
    }
    if (subcategory) {
      query.subcategory = { $regex: subcategory, $options: "i" };
    }
    // active
    // if (isActive !== undefined) {
    //   query.isActive = isActive === "true";
    // }
    //sort

    if (sort) {
      const [field, order] = (sort as string).split(":");
      sortQuery = { [field]: order === "desc" ? -1 : 1 };
    } else {
      // Default sort by newest
      sortQuery = { createdAt: -1 };
    }
    //skip and limit
    const skip = (Number(page) - 1) * Number(limit);

    const products = await ProductModel.find(query)
      .sort(sortQuery)
      .skip(skip)
      .limit(Number(limit));
    // .populate("user", "name email");

    if (products.length === 0) throw new Error("No products found");

    const total = await ProductModel.countDocuments(query);

    res.status(200).json({
      status: "success",
      data: {
        products,
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

export const ChangeProductQuantityAfterPayment = asyncHandler(
  async (
    req: AuthenticatedRequestBody<IProduct>,
    res: Response,
    next: NextFunction
  ) => {
    const { orderCode } = req.params;
    const order = await OrderModel.findOne({ orderCode });
    if (!order) throw new BadRequestError("Order not found");
    console.log("Order", order);
    const productSave = [];
    for (let i = 0; i < order.items.length; i++) {
      const productId = order.items[i].productId;
      const quantity = order.items[i].quantity;
      const size = order.items[i].size;
      const product = await ProductModel.findById(productId);
      if (!product) throw new BadRequestError("Product not found");
      console.log("Product", product);
      if (size) {
        const sizeIndex = product.sizes.findIndex(
          (s) => s.size === size && s.quantity >= quantity
        );
        if (sizeIndex === -1) {
          throw new BadRequestError("Size not found");
        }
        product.sizes[sizeIndex].quantity -= quantity;
        product.selled_quantity += quantity;
      }
      productSave.push(await product.save());
    }

    res.status(200).json({
      status: "success",
      data: { productSave },
    });
  }
);
