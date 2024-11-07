import { useEffect } from "react";
import { useAppSelector } from "../redux/hooks";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const Dashboard = () => {
  const { user } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  console.log("user: ", user);

  useEffect(() => {
    if (!user) {
      toast.error("Please login first");
      navigate("/login");
    }
  }, [user, navigate]);
  //   const test = async () => {

  //     const res = await fetch("http://localhost:3000/api/v1/auth/test", {
  //       method: "GET",
  //       credentials: "include",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     });
  //     const data = await res.json();
  //     console.log("data header: ", data);
  //   };
  //   useEffect(() => {
  //     test();
  //   }, []);
  return <div className=" w-full">Hello</div>;
};
