import React, { useState } from "react";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import { IoIosSearch } from "react-icons/io";
const API_URL = process.env.SV_HOST || "http://localhost:5000";
const SearchBar = () => {
  const [searchValue, setSearchValue] = useState("");
  const [resultsVisible, setResultsVisible] = useState(false);

  
  const fetchDataSearch = async (searchValue: string) => {
    try {
      const response = await fetch(
        `${API_URL}/api/v1/products/search?search=${searchValue}`
      );
      if (response.ok) {
        const data = await response.json();
        console.log("Data search:", data);
      } else {
        const error = await response.json();
        throw new Error(error.message);
      }
    } catch (error) {
      console.log("Error fetching search data:", error);
    }
  }


  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchValue(value);
    setResultsVisible(value.trim().length > 0); // Hiển thị kết quả nếu có nội dung
  };

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log("Search for:", searchValue);

    // Thêm logic xử lý tìm kiếm ở đây
  };

  return (
    <form onSubmit={handleSearchSubmit}>
      <div className="relative flex items-center rounded-md p-1">
        <TextField
          id="search-bar"
          className="flex-grow"
          label="Tìm kiếm sản phẩm"
          variant="outlined"
          placeholder="Search..."
          size="small"
          value={searchValue}
          onChange={handleSearchChange}
        />
        <IconButton type="submit">
          <IoIosSearch style={{ fill: "black" }} />
        </IconButton>
        {resultsVisible && (
          <div className="absolute top-full left-0 w-full border bg-white shadow-lg z-20 max-h-60 overflow-auto">
            <ul>
              {/* Hiển thị danh sách kết quả giả lập */}
              {["Hanoi", "Ho Chi Minh", "Da Nang"].map((city, index) => (
                <li
                  key={index}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  {city}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </form>
  );
};

export default SearchBar;
