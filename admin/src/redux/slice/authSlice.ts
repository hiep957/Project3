import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { LoginType, User } from "../../../types";
import { editProfile, getProfile, logout, signIn } from "../api";


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

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (loginData: LoginType, { rejectWithValue }) => {
    const response = await signIn(loginData);
    return response;
  }
);

export const logoutUser = createAsyncThunk("auth/logoutUser", async () => {
  const response = await logout();
  return response;
});

export const getProfileRTK = createAsyncThunk("auth/getProfile", async () => {
  const response = await getProfile();
  return response.user;
});

export const editProfileRTK = createAsyncThunk(
  "auth/editProfile",
  async (
    { updateData, id }: { updateData: Partial<User>; id: string },
    { rejectWithValue }
  ) => {
    try {
      const data = await editProfile(updateData, id);
      return data;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

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
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
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
        state.loading = false;
        state.user = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Logout failed";
      })
      //getProfile
      .addCase(getProfileRTK.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getProfileRTK.fulfilled,
        (state, action: PayloadAction<User>) => {
          state.loading = false;
          state.user = action.payload;
        }
      )
      .addCase(getProfileRTK.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch user";
      })

      .addCase(editProfileRTK.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editProfileRTK.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(editProfileRTK.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update user";
      })
  },
});
export const { clearError } = authSlice.actions;
export default authSlice.reducer;
