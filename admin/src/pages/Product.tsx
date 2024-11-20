import { Link, useNavigate } from "react-router-dom";
import { useAppSelector } from "../redux/hooks";
import { useEffect } from "react";
import { toast } from "react-toastify";
import Button from '@mui/material/Button';
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
  return (
    <div className="m-4 w-full">
      <div>Test</div>

      <Button variant="outlined">
        <Link to={'/product/add-product'}>Add Product</Link>
      </Button>
      
    </div>
  )
 
};
