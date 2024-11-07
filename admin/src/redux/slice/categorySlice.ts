import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { addCategory, deleteCategory, getCategory } from "../api";

// Define the structure of category and subcategory
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

interface DataCategory {
  categories: Category[];
}

interface CategoryState {
  categories: Category[];
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: CategoryState = {
  categories: [],
  loading: false,
  error: null,
};

// Async thunk for fetching categories
export const getCategories = createAsyncThunk<Category[]>(
  "category/getCategories",
  async () => {
    const response = await getCategory();
    return response.categories;
  }
);

export const addCategories = createAsyncThunk(
  "category/addCategory",
  async ({
    name,
    subcategories,
  }: {
    name: string;
    subcategories: { name: string }[];
  }) => {
    const response = await addCategory(name, subcategories);
    return response.category;
  }
);

export const deleteCategories = createAsyncThunk(
  "category/deleteCategory",
  async (id: string) => {
    await deleteCategory(id);
    return id;
  }
);

// Category slice
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
      .addCase(getCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getCategories.fulfilled,
        (state, action: PayloadAction<Category[]>) => {
          state.loading = false;
          state.categories = action.payload;
        }
      )
      .addCase(getCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch categories";
      })

      .addCase(addCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        addCategories.fulfilled,
        (state, action: PayloadAction<Category>) => {
          state.loading = false;
          state.categories.push(action.payload);
        }
      )
      .addCase(addCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to add category";
      })
      .addCase(deleteCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        deleteCategories.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.loading = false;
          state.categories = state.categories.filter(
            (category) => category._id !== action.payload
          );
        }
      )
      .addCase(deleteCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to delete category";
      });
  },
});

export const { clearError } = categorySlice.actions;
export default categorySlice.reducer;
