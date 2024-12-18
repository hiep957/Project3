import CartItem from "@/components/Cart/CartItem";
import { Layout } from "@/components/Layout";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { getCartRTK } from "@/redux/slice/cartSlice";
import { Container, Divider } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { toast } from "react-toastify";
const Cart = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  console.log("selectedItems: ", selectedItems);
  useEffect(() => {
    dispatch(getCartRTK());
  }, []);

  useEffect(() => {
    if (selectedItems.length > 0) {
      const total = selectedItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );
      setTotalPrice(total);
    } else {
      setTotalPrice(0);
    }
  }, [selectedItems]);

  const handleNavigationToCheckout = () => {
    if (selectedItems.length > 0) {
      const serializedItems = encodeURIComponent(JSON.stringify(selectedItems));
      router.push(`/checkout?items=${serializedItems}&total=${totalPrice}`);
    } else {
      toast.warning("Vui lòng chọn sản phẩm trước khi thanh toán");
    }
  };

  const { cart, loading, error } = useAppSelector((state) => state.cart);
  if (!cart) return <Layout>Cart Null</Layout>;
  return (
    <Layout>
      <Container maxWidth={false} sx={{ maxWidth: "1280px" }}>
        <Grid container columnSpacing={2}>
          <Grid size={{ xs: 12, md: 7 }}>
            <CartItem
              data={cart.items}
              onSelectionChange={(selectedData: any[]) => {
                setSelectedItems(selectedData);
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 5 }}>
            <div className="p-8 border rounded-lg ">
              <div className="font-medium text-xl ">Chi tiết đơn hàng</div>
              <div className="flex flex-row justify-between mt-4">
                <div className="font-thin">Tổng giá trị sản phẩm</div>
                <div className="">{totalPrice} VNĐ</div>
              </div>
              <div className="flex flex-row justify-between mt-2 mb-4">
                <div className="font-thin">Giảm giá</div>
                <div>-0 VNĐ</div>
              </div>
              <Divider />
              <div className="flex flex-row justify-between mt-4">
                <div className="font-medium text-xl">Tổng thanh toán</div>
                <div className="font-medium">{totalPrice} Vnđ</div>
              </div>

              <div className="flex w-full justify-center mt-4">
                <button
                  className="bg-yellow-500 p-2 rounded w-full font-medium text-xl"
                  onClick={handleNavigationToCheckout}
                >
                  Thanh toán
                </button>
              </div>
            </div>
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
};

export default Cart;
