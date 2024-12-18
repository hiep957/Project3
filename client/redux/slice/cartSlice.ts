import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { addToCart, createCart, getCart } from "../api";
import { HYDRATE } from "next-redux-wrapper";

export type Cart = {
  _id: string;
  userId: string;
  items: {
    productId: any;
    price: number;
    quantity: number;
  }[];
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export interface CartState {
  cart: Cart | null;
  loading: boolean;
  error: string | null;
}

const initialState: CartState = {
  cart: null,
  loading: false,
  error: null,
};

export const getCartRTK = createAsyncThunk("cart/getCart", async () => {
  const response = await getCart();
  console.log("get cart", response);
  return response.cart;
})

export const createCartRTK = createAsyncThunk("cart/createCart", async () => {
  const response = await createCart();
  console.log("Response", response);
  return response.cart;
});

export const addToCartRTK = createAsyncThunk(
  "cart/addToCart",
  async ({
    productId,
    quantity,
    price,
    size
  }: {
    productId: string;
    quantity: number;
    price: number;
    size: string;
  }) => {
    const response = await addToCart(productId, quantity, price,size);
    console.log("Response", response);
    return response.cart;
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetCart: (state) => {
      state.cart = null;
      state.loading = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(HYDRATE, (state, action: any) => {
        if (!action.payload.cart.cart ||  !action.payload.auth.isAuth) {
          return state;
        }
        return {
          ...state,
          cart: null
        };
      })
      .addCase(createCartRTK.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        createCartRTK.fulfilled,
        (state, action: PayloadAction<Cart>) => {
          state.loading = false;
          state.cart = action.payload;
        }
      )
      .addCase(createCartRTK.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Something went wrong";
      })

      .addCase(addToCartRTK.pending, (state) => {
        state.loading = true;
      })
      .addCase(addToCartRTK.fulfilled, (state, action: PayloadAction<Cart>) => {
        console.log("action.payload", action.payload);
        state.loading = false;
        state.cart = action.payload;
      })
      .addCase(addToCartRTK.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Something went wrong";
      })
      
      .addCase(getCartRTK.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCartRTK.fulfilled, (state, action: PayloadAction<Cart>) => {
        state.loading = false;
        state.cart = action.payload;
      })
      .addCase(getCartRTK.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Something went wrong";
      });
  },
});

export default cartSlice.reducer;
export const { clearError } = cartSlice.actions;
export const { resetCart } = cartSlice.actions;
