import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { createWrapper, HYDRATE } from "next-redux-wrapper";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import categoryReducer from "./slice/categorySlice";
import authReducer from "./slice/authSlice";
import cartReducer from "./slice/cartSlice";
// Kết hợp các reducer
const rootReducer = combineReducers({
  category: categoryReducer,
  auth: authReducer,
  cart: cartReducer,
});

// Cấu hình redux-persist
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "cart"], // Lưu trữ state của auth
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Xử lý hành động HYDRATE
const masterReducer = (state: any, action: any) => {
  if (action.type === HYDRATE) {
    const nextState = {
      ...state, // Giữ nguyên state client
      ...action.payload, // Gộp state server vào
    };
    if (state.auth) nextState.auth = state.auth; // Bảo toàn auth state
    if (state.cart) nextState.cart = state.cart;
    return nextState;
  }
  return persistedReducer(state, action);
};

// Hàm tạo store
export const makeStore = () => {
  const store = configureStore({
    reducer: masterReducer,
    devTools: process.env.NODE_ENV !== "production",
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: ["persist/PERSIST", "persist/REHYDRATE", HYDRATE],
        },
      }),
  });

  (store as any).persistor = persistStore(store);
  return store;
};

// Kiểu dữ liệu
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

export const wrapper = createWrapper<AppStore>(makeStore);
