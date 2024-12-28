import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Button,
  TextField,
  Paper,
  Container,
} from "@mui/material";
import axios from "axios";
import { ProductType } from "../../types";
import { useAppSelector } from "../redux/hooks";

const API_URL = import.meta.env.VITE_API_URL;

export const Product = () => {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 0,
    rowsPerPage: 10,
    totalRows: 0,
  });
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    brand: "",
  });

  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);

  const removeProduct = async (productId: string, isActive: boolean) => {
    const response = await fetch(
      `${API_URL}/api/v1/admin/products/update/${productId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isActive }),
        credentials: "include",
      }
    );
    if (response.ok) {
      toast.success("Product deleted successfully");
      fetchProducts();
    } else {
      toast.error("Failed to delete product");
    }
  };

  useEffect(() => {
    if (!user) {
      toast.error("Please login first");
      navigate("/login");
    } else {
      fetchProducts();
    }
  }, [pagination.page, pagination.rowsPerPage, filters]);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_URL}/api/v1/product`, {
        params: {
          page: pagination.page + 1,
          limit: pagination.rowsPerPage,
          ...filters,
        },
      });
      const { products, pagination: serverPagination } = response.data.data;
      setProducts(products);
      setPagination((prev) => ({
        ...prev,
        totalRows: serverPagination.total,
      }));
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
    setPagination({ ...pagination, page: 0 }); // Reset to first page
  };

  const handleChangePage = (_: unknown, newPage: number) => {
    setPagination({ ...pagination, page: newPage });
  };

  const handleChangeRowsPerPage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPagination({
      ...pagination,
      rowsPerPage: parseInt(e.target.value, 10),
      page: 0,
    });
  };

  return (
    <Container className="m-4">
      <h2 className="text-xl font-bold mb-4">Product List</h2>
      <Paper className="p-4 mb-6">
        <Button variant="contained" color="primary">
          <Link to="/product/add-product" className="text-white">
            Add Product
          </Link>
        </Button>
      </Paper>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <Paper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>STT</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Brand</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Subcategory</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products.map((product, index) => (
                  <TableRow key={product._id}>
                    <TableCell>
                      {pagination.page * pagination.rowsPerPage + index + 1}
                    </TableCell>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.brand}</TableCell>
                    <TableCell>{product.price}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>{product.subcategory}</TableCell>
                    <TableCell>
                      <Link
                        to={`/product/${product._id}`}
                        className="text-blue-500"
                      >
                        Edit
                      </Link>
                      {" | "}
                      <button
                        onClick={() => removeProduct(product._id, false)}
                        className="text-red-500"
                      >
                        Delete
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={pagination.totalRows}
            page={pagination.page}
            onPageChange={handleChangePage}
            rowsPerPage={pagination.rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      )}
    </Container>
  );
};
