
const API_URL = process.env.SV_HOST || "http://localhost:5000";

export const getCategory = async () => {
    const response = await fetch(`${API_URL}/api/v1/admin/categories`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });
    if (response.ok) {
        const data = await response.json();
        // console.log("data: ", data);
        return data;
    } else {
        const error = await response.json();
        // console.log("error: ", error);  
        throw new Error(error.message);
    }
}



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
      ...filteredParams
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
