import mongoose, { Schema, Types } from "mongoose";
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
  },
  slug: {
    type: String,
    unique: true,
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
    type: String
  },
  product_Images:[
    {
      type: String
    }
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
    type: Types.ObjectId,
    ref: "Category",
  },

  subcategory_id: {
    type: Types.ObjectId,
    ref: "Category.subcategories",
  },
});

ProductSchema.index({ name: "text", description: "text" });

export default mongoose.model<IProduct>("Product", ProductSchema);
