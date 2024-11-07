
const API_URL = import.meta.env.VITE_API_URL;

export const getCategory = async()=> {
    const response = await fetch(`${API_URL}/api/v1/category`, {
      method: "GET",
      credentials: "include",
      headers: {"Content-Type": "application/json"},
    })
    if(response.ok) {
      const data = await response.json();
      return data;
    }
    else {
      const error = await response.json();
      throw new Error(error.message);
    }
}