import { Link, useLocation } from "react-router-dom";
import Divider from "@mui/material/Divider";
import { MdDashboard } from "react-icons/md";

import { Icon } from "@mui/material";
import { FaProductHunt } from "react-icons/fa6";
import { FaBagShopping } from "react-icons/fa6";
import { FaFirstOrder } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
const links = [
  { label: "Dashboard", path: "/", icon: <MdDashboard /> },
  { label: "Product", path: "/product", icon: <FaProductHunt /> },
  // { label: "Profile", path: "/profile" },
  { label: "Category", path: "/category", icon: <FaBagShopping /> },
  { label: "Order", path: "/order", icon: <FaFirstOrder /> },
];
export const Sidebar = () => {

  return (
    <div className="w-64  h-screen border-r-2 bg-slate-100">
      <div className="flex justify-center border-b-black ">
        <div className="mt-2 p-4 font-bold text-lg">Side bar</div>
      </div>
      <Divider />
      <div className="flex flex-col items-center rounded-sm p-2 space-y-3 ">
        {links.map((link) => (
          <Link
            to={link.path}
            key={link.path}
            className="flex flex-row items-center w-full  p-2 hover:bg-blue-200 rounded transition-all"
          >
            <div className="flex flex-row">
              <Icon className="h-6 w-6 mr-3">{link.icon}</Icon>
              <span className=" ">{link.label}</span>
            </div>
          </Link>
        ))}
      </div>
      <Divider />
      <div className="flex w-full items-center p-2 ">
        <Link
          className="p-2  hover:bg-blue-200 rounded transiton-all w-full"
          to="/settings"
        >
          <div className="flex flex-row ">
            <IoMdSettings className="h-6 w-6 mr-3" />
            <div>Settings</div>
          </div>
        </Link>
      </div>
    </div>
  );
};
