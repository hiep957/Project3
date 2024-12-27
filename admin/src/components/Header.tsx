import { useEffect } from "react";
import { User } from "../../types";
import { useAppSelector } from "../redux/hooks";

import AccountMenu from "./MUI/accountmenu";
export const Header = () => {
  const {user} = useAppSelector((state) => state.auth);
  console.log("data header: ", user);

 
  return (
    <div className="flex flex-row bg-gray-200 justify-between ">
      <div className="font-bold text-lg p-4">
        Trang quản lý Shop bán đồ thể thao
      </div>
      <AccountMenu />
    </div>
  );
};
