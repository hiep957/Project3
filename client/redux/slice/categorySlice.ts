// store/slice/categorySlice.ts
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";
import { getCategory } from "../api";

export interface Subcategory {
  _id: string;
  name: string;
}

export interface Category {
  _id: string;
  name: string;
  subcategories: Subcategory[];
  createdAt: string;
  updatedAt: string;
}

interface CategoryState {
  categories: Category[];
  loading: boolean;
  error: string | null;
}

const initialState: CategoryState = {
  categories: [],
  loading: false,
  error: null,
};

export const getCategories = createAsyncThunk<Category[]>(
  "category/getCategories",
  async () => {
    const response = await getCategory();
    return response.categories;
  }
);

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(HYDRATE, (state, action: any) => {
        // Chỉ cập nhật state nếu server state khác rỗng
        if (!action.payload.category.categories.length) {
          return state;
        }
        return {
          ...state,
          ...action.payload.category,
        };
      })
      .addCase(getCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCategories.fulfilled, (state, action: PayloadAction<Category[]>) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(getCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch categories";
      });
  },
});

export const { clearError } = categorySlice.actions;
export default categorySlice.reducer;