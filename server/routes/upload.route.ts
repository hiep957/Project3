import express, { Request, Response } from "express";
import multer from "multer";
import cloudinary from "cloudinary";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 },
});

router.post(
  "/",
  upload.array("imageFiles", 10),
  async (req: Request, res: Response) => {
    try {
      const imageFiles = req.files as Express.Multer.File[];
      const imageUrls = await uploadImages(imageFiles);
      res.status(200).json({ imageUrls });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

export async function uploadImages(imageFiles: Express.Multer.File[]) {
  const uploadPromises = imageFiles.map(async (image) => {
    const b64 = Buffer.from(image.buffer).toString("base64");
    let dataURI = "data:" + image.mimetype + ";base64," + b64;
    const res = await cloudinary.v2.uploader.upload(dataURI);
    return res;
  });

  const imageUrls = await Promise.all(uploadPromises);
  return imageUrls;
}

export default router;
