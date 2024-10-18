import mongoose, { Schema } from "mongoose";
import { IProduct } from "../interfaces/Product";

const ProductSchema: Schema<IProduct> = new Schema({
  name: {
    type: String,
    required: true,
    maxLength: [128, "Name can't be greater than 128 characters"],
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
  },
  slug: {
    type: String,
    unique: true,
  },
  stock_quantity: {
    type: Number,
    required: true,
  },
  brand: {
    type: String,
    required: true,
  },
  product_Image: {
    url: {
      type: String,
    },
    cloudinary_id: {
      type: String,
    },
  },
  product_Images: [
    {
      url: {
        type: String,
      },
      cloudinary_id: {
        type: String,
      },
    },
  ],
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  category_id: {
    type: Schema.Types.ObjectId,
    ref: "Category",
  },
  subcategory_id: {
    type: Schema.Types.ObjectId,
    ref: "Category.subcategories",
  },
});

export default mongoose.model<IProduct>("Product", ProductSchema);
