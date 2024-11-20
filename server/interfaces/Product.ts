import mongoose, { Document } from "mongoose";

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  slug: string;
  stock_quantity: number;
  _id: string;
  brand: string;
  sizes: {
    size: string;
    quantity: number;
  }[];
  product_Image: string
  product_Images: string[]
  user: mongoose.Schema.Types.ObjectId;
  category_id: mongoose.Schema.Types.ObjectId;
  subcategory_id: mongoose.Schema.Types.ObjectId;
  category: string;
  subcategory: string;
  type: string;
  isUpdateImg: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
