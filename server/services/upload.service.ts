import { BadRequestError } from "../utils/ApiError";
import asyncHandler from "../utils/asyncHandler";
import { Request, Response, NextFunction } from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";

import { UploadApiResponse } from "cloudinary";
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 },
});

export const uploadService = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
        const file = req.file;
        if (!file) {
            throw new BadRequestError("Please upload a file");
        }
        res.status(200).json({
            status: "Upload successful",
            data: file,
        });
  }
);

async function uploadImages(imageFiles: Express.Multer.File[]) {
  const uploadPromises = imageFiles.map(async (image) => {
    const b64 = Buffer.from(image.buffer).toString("base64");
    let dataURI = "data:" + image.mimetype + ";base64," + b64;
    const res = await cloudinary.uploader.upload(dataURI);
    return res.url;
  });

  const imageUrls = await Promise.all(uploadPromises);
  return imageUrls;
}
export async function uploadImage(image: Express.Multer.File): Promise<UploadApiResponse> {
  const b64 = Buffer.from(image.buffer).toString("base64");
  const dataURI = `data:${image.mimetype};base64,${b64}`;
  const response = await cloudinary.uploader.upload(dataURI);
  return response;
}


