import { LoginType, SignupType } from "@/utils/Type";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { login, logout, signup } from "../api";
import { HYDRATE } from "next-redux-wrapper";

export type User = {
  _id: string;
  name: string;
  surname: string;
  password: string;
  email: string;
  bio: string;
  phoneNumber: string;
  address: string;
  confirmPassword: string;
  token?: string;
  accessToken?: string;
  refreshToken?: string;
  role?: string;
};

interface UserState {
  isAuth: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  isAuth: false,
  user: null,
  loading: false,
  error: null,
};

export const signupUser = createAsyncThunk(
  "auth/signupUser",
  async (signupData: SignupType, { rejectWithValue }) => {
    const response = await signup(signupData);
    console.log("Response", response);
    return response;
  }
)

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (loginData: LoginType, { rejectWithValue }) => {
    const response = await login(loginData);
    console.log("Response", response);
    return response;
  }
);

export const logoutUser = createAsyncThunk("auth/logoutUser", async () => {
  const response = await logout();
  return response;
});

const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      .addCase(HYDRATE, (state, action: any) => {
        if (!action.payload.auth.user) {
          return state;
        }
        return {
          ...state,
          ...action.payload.auth,
        };
      })

      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuth = true;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Signup failed";
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuth = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Login failed";
      })

      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isAuth = false;
        state.loading = false;
        state.user = null;
       
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Logout failed";
      });
  },
});
export const { clearError } = authSlice.actions;
export default authSlice.reducer;
