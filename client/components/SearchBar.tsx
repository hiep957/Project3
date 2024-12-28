import React, { useState } from "react";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import { IoIosSearch } from "react-icons/io";
import { useRouter } from "next/router";
const API_URL = process.env.SV_HOST || "http://localhost:5000";
const SearchBar = () => {
  const [searchValue, setSearchValue] = useState("");
  const [resultsVisible, setResultsVisible] = useState(false);

  const router = useRouter();
  

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchValue(value);

  };

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log("Search for:", searchValue);
    
    router.push(`/search/${searchValue}`);
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
        
      </div>
    </form>
  );
};

export default SearchBar;
