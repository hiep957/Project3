import { Request, Response } from "express";
import { IGetProductsRequest } from "../interfaces/CustomType";
import ProductModel from "../models/Product.model";
import asyncHandler from "../utils/asyncHandler";

export const getProductService = asyncHandler(async (req, res, next) => {
  if (!req.params.productId) throw new Error("Product ID is required");

  const product = await ProductModel.findById(req.params.productId);
  if (!product) throw new Error("Product not found");

  res.status(200).json({
    status: "success",
    data: product,
  });
});

export const getProductsService = asyncHandler(
  async (req: Request, res: Response, next) => {
    const {
      page = 1,
      limit = 10,
      sort,
      search,
      minPrice,
      maxPrice,
      brand,
      category,
      isActive,
    } = req.query;

    const query: any = {isActive: true};

    //search
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
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
    // active
    // if (isActive !== undefined) {
    //   query.isActive = isActive === "true";
    // }
    //sort
    let sortQuery = {};
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
      .limit(Number(limit))
      .populate("category_id")
      .populate("user", "name email");

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
