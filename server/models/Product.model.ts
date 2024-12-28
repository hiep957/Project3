import mongoose, { Schema, Types } from "mongoose";
import { IProduct } from "../interfaces/Product";

const ProductSchema: Schema<IProduct> = new Schema(
  {
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
    },
    slug: {
      type: String,
      unique: true,
    },
    selled_quantity: {
      type: Number,
      default: 0,
    },
    stock_quantity: {
      type: Number,
    },
    sizes: [
      {
        size: {
          type: String,
        },
        quantity: {
          type: Number,
        },
      },
    ],
    brand: {
      type: String,
      required: true,
    },
    product_Image: {
      type: String,
    },
    product_Images: [
      {
        type: String,
      },
    ],
    category: {
      type: String,
    },
    subcategory: {
      type: String,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
    textEditor: {
      type: String,
    },
  },
  { timestamps: true }
);

ProductSchema.index({ name: "text" });
ProductSchema.index({ description: "text" });
ProductSchema.index({ category: "text" });
ProductSchema.index({ subcategory: "text" });
ProductSchema.index({ brand: "text" });

export default mongoose.model<IProduct>("Product", ProductSchema);
