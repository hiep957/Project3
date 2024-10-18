import mongoose, { Schema } from 'mongoose';
import { ICategory } from '../interfaces/Category';


const subcategorySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
});

const categorySchema = new Schema<ICategory>({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  subcategories: [subcategorySchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model<ICategory>('Category', categorySchema);
