import asyncHandler from "../utils/asyncHandler";
import { NextFunction, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import fs from "fs";
import axios from "axios";
const httpsServer = "https://4bb0-118-71-223-251.ngrok-free.app";
const UPLOAD_DIR = path.join(__dirname, "../public/uploads");

export const vitonService = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    console.log("req.file:", req.file); // Kiểm tra log
    console.log("req.body:", req.body); // Kiểm tra log
    console.log("req.body", req.body.body); // Kiểm tra log
    // Kiểm tra nếu không có file nào được gửi
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Tạo tên file và đường dẫn lưu file
    const mainFile = req.file;
    const filename = `${uuidv4()}${path.extname(mainFile.originalname)}`;
    const filepath = path.join(UPLOAD_DIR, filename);

    // Đảm bảo thư mục lưu file tồn tại
    if (!fs.existsSync(UPLOAD_DIR)) {
      fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    }
    // Lưu file vào thư mục
    await fs.promises.writeFile(filepath, mainFile.buffer);
    const imageUrl = `${httpsServer}/images/${filename}`;
    console.log("imageUrl: ", imageUrl);
//API Key dự phòng SG_809ad0631bf15059
    const apiKey = "SG_86506afec8838b5c";
    const url = "https://api.segmind.com/v1/idm-vton";
    console.log("req.body", req.body);
    const data = {
      crop: 1,
      seed: 30,
      steps: 15,
      category: req.body.body,
      force_dc: 0,
      human_img: imageUrl,
      garm_img: req.body.model,
     
      mask_only: false,
      garment_des: "Green colour semi Formal Blazer",
    };

    const response = await axios.post(url, data, {
      headers: { "x-api-key": apiKey },
      responseType: "arraybuffer",
    });

    // Chuyển ảnh sang Base64
    const base64Image = Buffer.from(response.data).toString("base64");
    // const imgTag = `<img src="data:image/jpeg;base64,${base64Image}" alt="Generated Image" />`;

    // Chỉ trả về message
    res.status(200).json({
      message: "File uploaded successfully",
      data: base64Image,
    });
  }
);
