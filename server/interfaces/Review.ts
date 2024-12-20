import mongoose from "mongoose";

export interface IReview {
    _id: string;
    userId: mongoose.Schema.Types.ObjectId;
    productId: mongoose.Schema.Types.ObjectId;
    rating: number;
    comment: string;
}


export interface IReviewRequest extends Request{
    productId: mongoose.Schema.Types.ObjectId;
    rating: number;
    comment: string;
    page: number;
    limit: number;
    sort: string; //1 for ascending, -1 for descending
}