import express from "express";
import multer from "multer";
import { vitonService } from "../services/viton.service";

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 },
});
const router = express.Router();

router.post("/generate-image", upload.single("file"), vitonService);

export default router;
