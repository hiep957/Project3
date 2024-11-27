import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Button from "@mui/material/Button";
import { ProductType } from "../../types";
import { getProductsRTK } from "../redux/slice/productSlice";
export const Product = () => {
  const { user } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  console.log("user: ", user);
  const dispatch = useAppDispatch();
  const { products, loading, error } = useAppSelector((state) => state.product);
  console.log("products trong Product Page: ", products);
  useEffect(() => {
    if (!user) {
      toast.error("Please login first");
      navigate("/login");
    } else {
      // dispa
      dispatch(getProductsRTK());
    }
  }, [user, navigate, dispatch]);

  return (
    <div className="m-4 w-full">
      <div>Test</div>

      <Button variant="outlined">
        <Link to={"/product/add-product"}>Add Product</Link>
      </Button>
      <div>
        <table className="w-full">
          <thead>
            <tr>
              <th>STT</th>
              <th>Name</th>
              <th>Brand</th>
              <th>Price</th>
              <th>Category</th>
              <th>Subcategory</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product: ProductType, index: number) => (
              <tr key={product._id}>
                <td>{index + 1}</td>
                <td>{product.name}</td>
                <td>{product.brand}</td>
                <td>{product.price}</td>
                <td>{product.category}</td>
                <td>{product.subcategory}</td>
                <td>
                  <Link to={`/product/${product._id}`}>Edit</Link>
                  <Link to={`/product/delete-product/${product._id}`}>
                    Delete
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
