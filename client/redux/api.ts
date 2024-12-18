import { LoginType } from "@/utils/Type";

const API_URL = process.env.SV_HOST || "http://localhost:5000";
import { toast } from "react-toastify";
export const getCategory = async () => {
  const response = await fetch(`${API_URL}/api/v1/admin/categories`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  if (response.ok) {
    const data = await response.json();
    // console.log("data: ", data);s
    return data;
  } else {
    const error = await response.json();
    // console.log("error: ", error);
    throw new Error(error.message);
  }
};

// Cập nhật API call trong file api.ts
export const getProductByCategory = async (
  category: string,
  queryParams: Record<string, string | null> = {}
) => {
  // Loại bỏ các params null
  const filteredParams = Object.fromEntries(
    Object.entries(queryParams).filter(([_, v]) => v != null)
  );

  // Tạo query string
  const queryString = new URLSearchParams({
    category,
    ...filteredParams,
  }).toString();

  const response = await fetch(`${API_URL}/api/v1/product?${queryString}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (response.ok) {
    return await response.json();
  } else {
    const error = await response.json();
    throw new Error(error.message);
  }
};

export const login = async (loginData: LoginType) => {
  const response = await fetch(`${API_URL}/api/v1/auth/login`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(loginData),
  });
  if (response.ok) {
    const data = await response.json();

    return data;
  } else {
    const error = await response.json();
    throw new Error(error.message);
  }
};

export const logout = async () => {
  const response = await fetch(`${API_URL}/api/v1/auth/logout`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });
  if (response.ok) {
    const data = await response.json();
    return data;
  } else {
    const error = await response.json();
    throw new Error(error.message);
  }
};

export const createCart = async () => {
  const response = await fetch(`${API_URL}/api/v1/cart/create-cart`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  if (response.ok) {
    const data = await response.json();
    toast.success(data.message);
    return data;
  } else {
    const error = await response.json();
    toast.error(error.message);
    throw new Error(error.message);
  }
};

export const addToCart = async (
  productId: string,
  quantity: number,
  price: number,
  size: string
) => {
  console.log("productId", productId);
  console.log("quantity", quantity);
  console.log("price", price);
  console.log("size", size);
  const response = await fetch(`${API_URL}/api/v1/cart/add-cart`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ productId, quantity, price, size }),
  });
  if (response.ok) {
    const data = await response.json();
    toast.success(data.message);
    return data;
  } else {
    const error = await response.json();
    toast.error(error.message);
    throw new Error(error.message);
  }
};

export const getCart = async () => {
  const response = await fetch(`${API_URL}/api/v1/cart`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  if (response.ok) {
    const data = await response.json();
    return data;
  } else {
    const error = await response.json();
    toast.error(error.message);
    throw new Error(error.message);
  }
};
