
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import { IoIosSearch } from "react-icons/io";
const SerachBar = () => {
  return (
    <form>
      <div className=" border-gray-300 ">
        <TextField
          id="search-bar"
          className="text"
          label="Enter a city name"
          variant="outlined"
          placeholder="Search..."
          size="small"
        />
        <IconButton>
          <IoIosSearch style={{fill:'black'}} />
        </IconButton>
      </div>
    </form>
  );
};

export default SerachBar;
