import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../redux/hooks";
import { useEffect } from "react";
import { toast } from "react-toastify";

export const Product = () => {
  const { user } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  console.log("user: ", user);

  useEffect(() => {
    if (!user) {
      toast.error("Please login first");
      navigate("/login");
    }
  }, [user, navigate]);
  return <div>Product</div>;
};
