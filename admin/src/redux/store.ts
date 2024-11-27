import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slice/authSlice";
import categoryReducer from "./slice/categorySlice";
import productReducer from "./slice/productSlice";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Sử dụng LocalStorage để lưu trữ

// Cấu hình `redux-persist` cho `auth`
const persistConfig = {
  key: "auth",
  storage,
};
const categoryPersistConfig = {
  key: "category",
  storage,
};
const productPersistConfig = {
  key: "product",
  storage,
}
const persistedAuthReducer = persistReducer(persistConfig, authReducer);
const persistedCategoryReducer = persistReducer(
  categoryPersistConfig,
  categoryReducer
);
const persistedProductReducer = persistReducer(productPersistConfig, productReducer);

// Cấu hình store với `persistedAuthReducer` cho `auth`
export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    category: persistedCategoryReducer,
    product: persistedProductReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

// Thiết lập `persistor` để điều khiển việc lưu trữ dữ liệu
export const persistor = persistStore(store);

// Infer the `RootState`, `AppDispatch`, and `AppStore` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;

export default store;
