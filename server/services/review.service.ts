import asyncHandler from "../utils/asyncHandler";
import { IReviewRequest } from "../interfaces/Review";
import { Response, NextFunction, Request } from "express";
import { AuthenticatedRequestBody } from "../interfaces/CustomType";
import { BadRequestError } from "../utils/ApiError";
import ReviewModel from "../models/Review.model";

export const createReviewService = asyncHandler(
  async (
    req: AuthenticatedRequestBody<IReviewRequest>,
    res: Response,
    next: NextFunction
  ) => {
    const { productId } = req.params;

    const userId = req.user?._id;
    const existingReview = await ReviewModel.findOne({ userId });

    if (!productId) throw new BadRequestError("Product ID is required");
    const { rating, comment } = req.body;
    if (!rating || !comment) {
      throw new BadRequestError("Rating and comment are required");
    }

    if (existingReview) {
      throw new BadRequestError("You have already reviewed this product");
    }

    const newReview = {
      userId: req.user?._id,
      productId: productId,
      rating,
      comment,
    };
    const savedReview = await ReviewModel.create(newReview);
    if (!savedReview) {
      throw new BadRequestError("Error while creating review");
    }
    console.log("savedReview", savedReview);
    res.status(201).json({
      status: "success",
      data: savedReview,
    });
  }
);

export const getReviewsService = asyncHandler(
  async (
    req: AuthenticatedRequestBody<IReviewRequest>,
    res: Response,
    next: NextFunction
  ) => {
    const { productId } = req.params;
    const { page, limit, sort } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    if (!productId) throw new BadRequestError("Product ID is required");
    const reviews = await ReviewModel.find({ productId })
      .skip(skip)
      .limit(Number(limit))
      .sort({ rating: sort === 'asc' ? 1 : -1 });
    const total = await ReviewModel.countDocuments({ productId });
    res.status(200).json({
      status: "success",
      data: {
        reviews,
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


// export const updateReviewService = asyncHandler(
//   async (
//     req: AuthenticatedRequestBody<IReviewRequest>,
//     res: Response,
//     next: NextFunction
//   ) => {
//     const { reviewId } = req.params;
//     const userId = req.user?._id;
//     const review = await ReviewModel.findOne({ _id: reviewId, userId });
//   }
// );


export const deleteReviewService = asyncHandler(
  async (
    req: AuthenticatedRequestBody<IReviewRequest>,
    res: Response,
    next: NextFunction
  ) => {
    const { reviewId } = req.params;
    const userId = req.user?._id;
    const review = await ReviewModel.findOne({ _id: reviewId, userId });
    if (!review) {
      throw new BadRequestError("Review not found");
    }
    await ReviewModel.deleteOne({ _id: reviewId });
    res.status(200).json({
      status: "success",
      data: review,
    });
  }
);
