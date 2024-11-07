import { useEffect } from "react";
import { User } from "../../types";
import { useAppSelector } from "../redux/hooks";

import AccountMenu from "./MUI/accountmenu";
export const Header = () => {
  const data: User | null = useAppSelector((state) => state.auth.user);
  console.log("data header: ", data?.name);

 
  return (
    <div className="flex flex-row justify-between  bg-blue-200">
      <div className="font-bold text-lg p-4">
        Trang quản lý Shop bán đồ thể thao
      </div>
      <AccountMenu />
    </div>
  );
};
