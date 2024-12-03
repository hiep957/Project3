import express, { Express, Request, Response, Application } from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import asyncHandler from "./utils/asyncHandler";
import { BadRequestError } from "./utils/ApiError";
import { errorHandlingMiddleware } from "./middlewares/errorHandlingMiddleware";
import mongoose, { ConnectOptions, set } from "mongoose";
import api from "./api/index";
import cors from "cors";
import { v2 as cloudinary } from "cloudinary";
import path from "path";
import PayOS from "@payos/node";

//For env File
dotenv.config();

const app: Application = express();
const port = process.env.PORT || 3000;
const mongoURI = process.env.DB_URL;


export const payosClient = new PayOS(
  "1eec74cf-6125-4e5b-8361-f8c6d146e60f",
  "295dfffe-a427-477e-8aff-143ff71aa02d",
  "573584da2ef0ff97d90ce31d874d2faa4ccd4a7aadee4386025585278e799da0"
);

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

// app.use(
//   cors({
//     origin: (origin, callback) => {
//       const allowedOrigins = [ "http://localhost:5173", "http://localhost:5174", "http://localhost:3000", ""];
//       if (!origin || allowedOrigins.includes(origin)) {
//         callback(null, true);
//       } else {
//         callback(new Error('Not allowed by CORS'));
//       }
//     },
//     credentials: true,
//   })
// );

app.use(
  cors({
    origin: (origin, callback) => {
      callback(null, true);  // Cho phép tất cả các nguồn
    },
    credentials: true,
  })
);

//
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/images', express.static(path.join(__dirname, '/public/uploads')));
app.use("/api/v1", api);
app.use(errorHandlingMiddleware);




// app.post("/webhook/payment", handlePaymentWebhook)

app.listen(port, () => {
  console.log(`Server is Fire at http://localhost:${port}`);
});
