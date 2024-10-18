import mongoose, { Document } from "mongoose";

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  slug: string;
  stock_quantity: number;
  _id: string;
  brand: string;
  product_Image: { url: string; cloudinary_id: string };
  product_Images: {
    url: string;
    cloudinary_id: string;
  }[];
  user: mongoose.Schema.Types.ObjectId;
  category_id: mongoose.Schema.Types.ObjectId;
  subcategory_id: mongoose.Schema.Types.ObjectId;
  isUpdateImg: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
