import express from "express";
import { createReviewService, deleteReviewService, getReviewsService, updateReviewService } from "../services/review.service";
import { isAuth } from "../middlewares/auth/checkIsAuth";

const route = express.Router();

// route.post("/create/reviewApp", createReviewAppService);
route.post("/create/:productId",isAuth, createReviewService);
route.post("/getProductReviews/:productId", getReviewsService);
route.put("/update/:reviewId",isAuth, updateReviewService);
route.delete("/remove/:reviewId",isAuth, deleteReviewService);  
export default route;

