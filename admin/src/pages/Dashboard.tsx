import { useEffect, useState } from "react";
import { useAppSelector } from "../redux/hooks";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Container } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { FaRegUser } from "react-icons/fa";
import { MdNavigateNext } from "react-icons/md";
import { BsCart } from "react-icons/bs";
import OrderChart from "../components/Dashboard/OrderChart";
import Category from "./Category";
import CategoryChart from "../components/Dashboard/CategoryChart";
export const Dashboard = () => {
  const { user } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  console.log("user: ", user);
  const [data, setData] = useState<any>();
  const [dataCategory, setDataCategory] = useState<any>();
  const [dataUser, setDataUser] = useState<any>();
  const [orderThisYear, setOrderThisYear] = useState<any>();
  useEffect(() => {
    if (!user) {
      toast.error("Please login first");
      navigate("/login");
    }
    getOrderDecember();
    getDataCategory();
    getTotalUser();
    getOrderThisYear();
  }, [user, navigate]);

  const getOrderDecember = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/v1/admin/getOrderDecember",
        {
          method: "GET",
          credentials: "include",
        }
      );
      if (response.ok) {
        const data = await response.json();
        setData(data);
        console.log("data December", data);
      } else {
        const error = (await response.json()).message;
        console.log("error", error);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const getDataCategory = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/v1/admin/totalCategoryAndProduct",
        {
          method: "GET",
          credentials: "include",
        }
      );
      if (response.ok) {
        const data = await response.json();
        setDataCategory(data);
        console.log("data Category", data);
      } else {
        const error = (await response.json()).message;
        console.log("error", error);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const getTotalUser = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/v1/admin/totalUser",
        {
          method: "GET",
          credentials: "include",
        }
      );
      if (response.ok) {
        const data = await response.json();
        setDataUser(data.totalUsers);
        console.log("data User", data);
      } else {
        const error = (await response.json()).message;
        console.log("error", error);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const getOrderThisYear = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/v1/admin/getOrderThisYear",
        {
          method: "GET",
          credentials: "include",
        }
      );
      if (response.ok) {
        const data = await response.json();
        setOrderThisYear(data.totalOrder);
        console.log("data December", data);
      } else {
        const error = (await response.json()).message;
        console.log("error", error);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <Container maxWidth="lg" className="mt-4 rounded">
      <div className="flex flex-row w-full space-x-2 h-screen">
        <div className="flex flex-col w-2/3 space-y-2">
          <div className="flex flex-row space-x-2">
            <div className="flex flex-col border w-1/2 bg-blue-200 p-4 rounded-xl space-y-2">
              <div className="flex flex-row">
                <div className="w-1/5 flex ">
                  <div className="flex items-center border p-2 rounded-lg bg-slate-100">
                    <FaRegUser />
                  </div>
                </div>
                <div className="w-3/5 flex flex-col">
                  <div className="text-xl font-medium">Tổng số người dùng</div>
                  <div></div>
                </div>
                <div className="w-1/5 flex justify-end">
                  <div className="flex items-center border p-2 rounded-lg bg-slate-100" onClick={() => navigate("/users")}>
                    <MdNavigateNext />
                  </div>
                </div>
              </div>

              {dataUser ? (
                <div className="text-base">{dataUser} Người dùng</div>
              ) : (
                <div>Không có dữ liệu</div>
              )}
              <div></div>
            </div>

            <div className="flex flex-col border w-1/2 bg-green-200 p-4 rounded-xl space-y-2">
              <div className="flex flex-row">
                <div className="w-1/5 flex ">
                  <div className="flex items-center border p-2 rounded-lg bg-slate-100">
                    <BsCart />
                  </div>
                </div>
                <div className="w-3/5 flex flex-col">
                  <div className="text-xl font-medium">Tổng số đơn hàng</div>
                  <div></div>
                </div>
                <div className="w-1/5 flex justify-end">
                  <div className="flex items-center border p-2 rounded-lg bg-slate-100" onClick={() => navigate("/order")}>
                    <MdNavigateNext />
                  </div>
                </div>
              </div>

              {orderThisYear ? (
                <div className="text-base">{orderThisYear} Đơn hàng</div>
              ) : (
                <div>Không có dữ liệu</div>
              )}
              <div></div>
            </div>
          </div>
          <div className="w-full bg-red-200 rounded-lg">
            {data ? (
              <OrderChart dataFromServer={data}></OrderChart>
            ) : (
              <p>Không có dữ liệu</p>
            )}
          </div>
        </div>
        <div className="flex w-1/3 flex-col space-y-2">
          <div className="flex h-[400px] bg-white w-full justify-center">
            {dataCategory ? (
              <CategoryChart categoryData={dataCategory}></CategoryChart>
            ) : (
              <p>Không có dữ liệu</p>
            )}
          </div>
          <div className="flex flex-col border  bg-green-200 p-4 rounded-xl space-y-2">
            <div className="flex flex-row">
              <div className="w-1/5 flex ">
                <div className="flex items-center border p-2 rounded-lg bg-slate-100">
                  <BsCart />
                </div>
              </div>
              <div className="w-3/5 flex flex-col">
                <div className="text-xl font-medium">Tổng doanh thu</div>
                <div></div>
              </div>
              <div className="w-1/5 flex justify-end">
                <div className="flex items-center border p-2 rounded-lg bg-slate-100">
                  <MdNavigateNext />
                </div>
              </div>
            </div>

            <div className="text-base">20 người dùng</div>
            <div></div>
          </div>
        </div>
      </div>
    </Container>
  );
};
