import { Layout } from "@/components/Layout";
import { useAppDispatch } from "@/redux/hooks";
import { getCartRTK } from "@/redux/slice/cartSlice";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const SuccessPage = () => {
  const router = useRouter();
  const { orderCode } = router.query;
  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const decreaseItemAfterPayment = async (orderCode: string) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/v1/product/decreaseItemAfterPayment/${orderCode}`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      console.log("Decrease Item:", data);
      if (!response.ok) {
        throw new Error(data.message || "Failed to decrease item");
      }
    } catch (error: any) {
      console.error("Decrease Item Error:", error);
      setError(error.message || "Error decreasing item");
    }
  }

  const removeCartItemAfterPayment = async (orderCode: string) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/v1/cart/deleteAfterPayment/${orderCode}`,
        {
          method: "DELETE",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      console.log("Remove Cart Items:", data);
      if (!response.ok) {
        throw new Error(data.message || "Failed to remove cart items");
      }
    } catch (error: any) {
      console.error("Remove Cart Error:", error);
      setError(error.message || "Error removing cart items");
    }
  };

  const getPaymentbyOrderId = async (orderCode: string) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/v1/payment/getPaymentInfo/${orderCode}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      console.log("Payment Info:", data);
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch payment info");
      }
    } catch (error: any) {
      console.error("Payment Info Error:", error);
      setError(error.message || "Error fetching payment info");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (orderCode) {
        try {
          setLoading(true);
          // Gọi đồng thời cả hai API
          await Promise.all([
            getPaymentbyOrderId(orderCode as string),
            removeCartItemAfterPayment(orderCode as string),
            decreaseItemAfterPayment(orderCode as string),
          ]);
          dispatch(getCartRTK());
        } catch (error) {
          console.error("Error in fetching data:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchData();
  }, [orderCode, dispatch]);

  return (
    <Layout>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>Error: {error}</div>
      ) : (
        <div>Payment success! Your order is confirmed.</div>
      )}
    </Layout>
  );
};

export default SuccessPage;
