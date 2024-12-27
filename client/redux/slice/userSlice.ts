import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { User } from "./authSlice";
import { updateUserService } from "../api";

// Định nghĩa kiểu dữ liệu người dùng
interface UserState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  user: null,
  loading: false,
  error: null,
};

// Hàm gọi API lấy thông tin người dùng
const fetchUserFromApi = async (): Promise<User> => {
  const response = await fetch("http://localhost:5000/api/v1/auth/me", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Lỗi không xác định");
  }

  return response.json();
};

// Thunk để lấy thông tin người dùng
export const getUser = createAsyncThunk(
  "user/getUser",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchUserFromApi();
    } catch (error: any) {
      return rejectWithValue(error.message || "Lỗi không xác định");
    }
  }
);

export const updateUser = createAsyncThunk(
  "user/updateUser",
  async (data: Partial<User>, { rejectWithValue }) => {
    try {
      return await updateUserService(data);
    } catch (error: any) {
      return rejectWithValue(error.message || "Lỗi không xác định");
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default userSlice.reducer;
