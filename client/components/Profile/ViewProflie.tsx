import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { getUser } from "@/redux/slice/userSlice";
import { useEffect } from "react";

const ViewProfile = () => {
  const dispatch = useAppDispatch();
  const { user, loading, error } = useAppSelector((state) => state.user);
  
  console.log("user: ", user);
  if(loading) return <div>Loading...</div>
  if(error) return <div>Error: {error}</div>
  return (
    <>
      <div className="flex flex-row space-x-2">
        <div className="p-2 w-[140px]">Họ và tên: </div>
        <div className="bg-white p-2 rounded-lg w-[300px]">{user.user?.name}</div>
      </div>
      <div className="flex flex-row space-x-2">
        <div className=" p-2 w-[140px]">Email: </div>
        <div className="bg-white p-2 rounded-lg w-[300px]">{user.user?.email}</div>
      </div>
      <div className="flex flex-row space-x-2">
        <div className=" w-[140px] p-2">Address </div>
        <div className="bg-white  rounded-lg p-2 w-[300px]">{user.user.address==""?"Chưa có thông tin":user.user.address}</div>
      </div>
      <div className="flex flex-row space-x-2">
        <div className=" w-[140px] p-2">Phone number </div>
        <div className="bg-white  rounded-lg p-2 w-[300px]">{user.user.phoneNumber==""?"Chưa có thông tin":user.user.phoneNumber}</div>
      </div>
    </>
  );
};

export default ViewProfile;
