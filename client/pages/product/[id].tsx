import { Layout } from "@/components/Layout";
import SizeProduct from "@/components/ProductDetail/SizeProduct";
import SwiperImage from "@/components/ProductDetail/SwiperImage";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  addToCartRTK,
  createCartRTK,
  getCartRTK,
} from "@/redux/slice/cartSlice";
import { ProductType } from "@/utils/Type";
import {
  Box,
  Breadcrumbs,
  Button,
  Container,
  Divider,
  Link,
} from "@mui/material";
import { toast } from "react-toastify";
import Grid from "@mui/material/Grid2";
import { get } from "http";
import { GetServerSideProps } from "next";
import { useState } from "react";
import VitonTest from "@/components/VitonTest";

const API_URL = process.env.SV_HOST || "http://localhost:5000";
const Product = ({ data }: { data: ProductType }) => {
  const { isAuth } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const { cart, loading, error } = useAppSelector((state) => state.cart);

  const [selectedSize, setSelectedSize] = useState("");

  const handleSizeChange = (size: string) => {
    setSelectedSize(size);
  };
  console.log("selectedSize", selectedSize);

  console.log("productData", data);
  console.log("cart trong Cart.tsx: ", cart);

  const handleCreateCart = () => {
    dispatch(createCartRTK());
  };

  const handleAddToCart = () => {
    if (!isAuth) {
      toast.warning("Vui lòng đăng nhập");
      return;
    }
    if (!selectedSize) {
      toast.warning("Vui lòng chọn size sản phẩm");
      return;
    }

    console.log("data gui di", data._id, data.price, selectedSize);

    dispatch(
      addToCartRTK({
        productId: data._id,
        quantity: 1,
        price: data.price,
        size: selectedSize,
      })
    );

    dispatch(getCartRTK());
  };

  console.log("product", data);
  return (
    <Layout>
      <Container maxWidth={false} sx={{ maxWidth: "1280px" }}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link href="/" color="inherit" underline="hover">
            Trang chủ
          </Link>
          <Link href="/product" color="inherit" underline="hover">
            Chi tiết sản phẩm
          </Link>
        </Breadcrumbs>
        <Grid container sx={{ marginTop: "16px" }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <SwiperImage product={data} />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <div className="flex flex-col space-y-4">
              <p className="text-4xl font-bold">{data.name}</p>
              <Divider />
              <div className="flex flex-row space-x-2">
                <p className="font-medium text-xl">Giá: </p>
                <p className="font-bold text-xl">
                  {data.price.toLocaleString("vi-VN")}
                  <span className="font-medium text-base">VNĐ</span>
                </p>
              </div>

              <div className="flex flex-row">
                {data.selled_quantity == 0 ? (
                  <p>Chưa có sản phẩm được bán</p>
                ) : (
                  <div>
                    <div className="text-xl font-medium">
                      Số sản phẩm đã bán được:{" "}
                    </div>
                    <p className="font-bold text-xl">{data.selled_quantity}</p>
                  </div>
                )}
              </div>

              <SizeProduct
                sizes={data.sizes} // Assuming your ProductType includes a sizes array
                selectedSize={selectedSize}
                handleSizeChange={handleSizeChange}
              />
              <Button
                variant="outlined"
                onClick={handleAddToCart}
                className="w-1/3 bg-red-500"
              >
                Thêm vào giỏ hàng
              </Button>
            </div>
          </Grid>
        </Grid>

        <VitonTest data={data} ></VitonTest>
      </Container>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params as { id: string }; // Lấy id từ URL
  console.log("id", id);
  console.log("API_URL", API_URL);
  const response = await fetch(`${API_URL}/api/v1/product/${id}`);
  const product = await response.json();
  const data = product.data;
  return {
    props: {
      data,
    },
  };
};

export default Product;
