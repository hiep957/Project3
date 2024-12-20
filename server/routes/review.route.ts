import express from "express";
import { createReviewService } from "../services/review.service";

const route = express.Router();

// route.post("/create/reviewApp", createReviewAppService);
route.post("/create/:productId", createReviewService);

export default route;

