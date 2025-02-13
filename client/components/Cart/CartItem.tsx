import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  addToCartRTK,
  decreaseItemCartRTK,
  getCartRTK,
} from "@/redux/slice/cartSlice";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { IoFastFood } from "react-icons/io5";

const API_URL = process.env.SV_HOST || "http://localhost:5000";
export type CartProps = {
  productId: any;
  quantity: number;
  price: number;
  size: string;
  _id: string;
};

const CartItem = ({
  data,
  onSelectionChange,
}: {
  data: CartProps[];
  onSelectionChange: (selectedData: any[]) => void;
}) => {
  const { cart, loading, error } = useAppSelector((state) => state.cart);

  const dispatch = useAppDispatch();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const handleCheckboxChange = (itemId: string) => {
    const updatedSelectedItems = selectedItems.includes(itemId)
      ? selectedItems.filter((id) => id !== itemId)
      : [...selectedItems, itemId];
    setSelectedItems(updatedSelectedItems);

    const selectedData = data.filter((item) =>
      updatedSelectedItems.includes(item._id)
    );
    onSelectionChange(selectedData); // Gửi danh sách mới về component cha
    console.log("selectedData: ", selectedData);
  };

  const handleClickPlus = async (
    productId: string,
    price: number,
    size: string
  ) => {
    dispatch(addToCartRTK({ productId, quantity: 1, price, size }));
    dispatch(getCartRTK());
  };

  const handleClickMinus = async (
    productId: string,
    price: number,
    size: string
  ) => {
    await dispatch(
      decreaseItemCartRTK({ productId, quantity: 1, price, size })
    );
    await dispatch(getCartRTK());
  };

  return (
    <div className="flex flex-col space-y-8">
      {data.map((item) => (
        <div className="min-h-32 border rounded ">
          <Grid key={item._id} container sx={{ height: "100%" }}>
            {/* Product Image */}
            <Grid size={3}>
              <div className="flex items-center justify-evenly">
                <input
                  type="checkbox"
                  className="w-6 h-6"
                  checked={selectedItems.includes(item._id)}
                  onChange={() => handleCheckboxChange(item._id)}
                />
                <Image
                  height={120}
                  width={100}
                  // objectFit="contain"
                  src={`${API_URL}${item.productId.product_Image}`}
                  alt="product"
                  className="flex object-contain w-30 h-32"
                ></Image>
              </div>
            </Grid>

            {/* Product Details */}
            <Grid size={6}>
              <div className="flex flex-col justify-between h-full">
                <Link href={`/product/${item.productId._id}`}>
                  <p>Tên sản phẩm: {item.productId.name}</p>
                </Link>
                <p>Số lượng: {item.quantity}</p>
                <p>Giá: {item.productId.price} VNĐ</p>
                <p>Size bạn đã chọn: {item.size}</p>
              </div>
            </Grid>

            {/* Quantity */}
            <Grid
              size={2}
              sx={{
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "flex-end",
              }}
            >
              <Box>
                <div className="flex flex-row border rounded w-24 h-8 items-center overflow-hidden">
                  <button
                    className="w-1/3 hover:bg-red-500 text-center border-r text-lg font-semibold transition-all"
                    onClick={() =>
                      handleClickMinus(
                        item.productId._id,
                        item.productId.price,
                        item.size
                      )
                    }
                  >
                    -
                  </button>
                  <div className="w-1/3 text-center  text-sm">
                    {item.quantity}
                  </div>
                  <button
                    className="w-1/3 hover:bg-red-500 text-center text-lg border-l font-semibold transition-all"
                    onClick={() =>
                      handleClickPlus(item.productId._id, item.productId.price, item.size)
                    }
                  >
                    +
                  </button>
                </div>
              </Box>
            </Grid>
          </Grid>
        </div>
      ))}
    </div>
  );
};

export default CartItem;
