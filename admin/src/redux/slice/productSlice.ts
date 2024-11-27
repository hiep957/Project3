import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ProductType } from "../../../types";
import { getProducts } from "../api";

interface ProductState {
  products: ProductType[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  products: [],
  loading: false,
  error: null,
};

export const getProductsRTK = createAsyncThunk<ProductType[]>(
  "product/getProducts",
  async () => {
    const response = await getProducts();
    return response.data.products;
  }
);

const productSlice = createSlice({
  name: "product",
  initialState: initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getProductsRTK.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      getProductsRTK.fulfilled,
      (state, action: PayloadAction<ProductType[]>) => {
        state.loading = false;
        state.products = action.payload;
      }
    );
    builder.addCase(getProductsRTK.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to fetch products";
    });
  },
});

export const { clearError } = productSlice.actions;
export default productSlice.reducer;