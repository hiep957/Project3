import { toast } from "react-toastify";
import { LoginType, User } from "../../types";

const API_URL = import.meta.env.VITE_API_URL;

export const signIn = async (loginData: LoginType) => {
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

export const getCategory = async () => {
  const response = await fetch(`${API_URL}/api/v1/admin/categories`, {
    method: "GET",
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

export const addCategory = async (
  name: string,
  subcategories: { name: string }[]
) => {
  const response = await fetch(`${API_URL}/api/v1/admin/categories/add`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, subcategories }),
  });
  if (response.ok) {
    const data = await response.json();
    toast.success("Category added successfully");
    return data;
  } else {
    const error = await response.json();
    toast.error(error.message);
    throw new Error(error.message);
  }
};


export const deleteCategory = async (id: string) => {
  const response = await fetch(`${API_URL}/api/v1/admin/categories/delete/${id}`, {
    method: "DELETE",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });
  if (response.ok) {
    const data = await response.json();
    toast.success("Category deleted successfully");
    return data;
  } else {
    const error = await response.json();
    toast.error(error.message);
    throw new Error(error.message);
  }
}
