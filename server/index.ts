import express, { Express, Request, Response, Application } from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import asyncHandler from "./utils/asyncHandler";
import { BadRequestError } from "./utils/ApiError";
import { errorHandlingMiddleware } from "./middlewares/errorHandlingMiddleware";
import mongoose, { ConnectOptions } from "mongoose";
import api from "./api/index";
import cors from "cors";
import { v2 as cloudinary } from "cloudinary";
//For env File
dotenv.config();

const app: Application = express();
const port = process.env.PORT || 3000;
const mongoURI = process.env.DB_URL;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Connect to MongoDB
if (!mongoURI) {
  throw new Error("Please define the MONGO_URI environment variable");
}
mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as ConnectOptions)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error);
  });
app.get("/", (req: Request, res: Response) => {
  res.send("Server NodeJS");
});

app.get("/api", (req: Request, res: Response) => {
  res.send("Welcome to Express & TypeScript Servedsadasdsr");
});

const corsOptions = {
  origin: "*", // Cho phép tất cả các nguồn
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE", // Các phương thức HTTP được phép
  allowedHeaders: ["Content-Type", "Authorization"], // Các header được phép
  credentials: true, // Nếu cần gửi cookies
};

app.use(cors(corsOptions));
//
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/v1", api);
app.use(errorHandlingMiddleware);

app.listen(port, () => {
  console.log(`Server is Fire at http://localhost:${port}`);
});
