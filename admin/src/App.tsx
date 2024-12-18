import { useEffect, useState } from "react";

import "./App.css";
// import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Layout } from "./layout/Layout";
import { Dashboard } from "./pages/Dashboard";
import { Login } from "./pages/Login";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Category from "./pages/Category";
import Settings from "./pages/Settings";
import AddProduct from "./pages/AddProduct";
import EditProduct from "./pages/EditProduct";
import { Product } from "./pages/Product";
const API_URL = import.meta.env.VITE_API_URL;
function App() {
  // const refreshAccessToken = async () => {
  //   const response = await fetch(`${API_URL}/api/v1/auth/refresh-token`, {
  //     method: "POST",
  //     credentials: "include",
  //     headers: { "Content-Type": "application/json" },
  //   });
  //   if (response.ok) {
  //     const data = await response.json();
  //     console.log("Refresh Token Success", data);
  //     return data;
  //   } else {
  //     const error = await response.json();
  //     throw new Error(error.message);
  //   }
  // };

  // useEffect(() => {
  //   refreshAccessToken();
  //   const intervalId = setInterval(
  //     () => {
  //       refreshAccessToken();
  //     },
  //     15 * 60 * 1000
  //   );
  //   return () => clearInterval(intervalId);
  // }, []);
  const [count, setCount] = useState(0);

  return (
    <>
      <Router>
        <Routes>
          <Route
            path="/settings"
            element={
              <Layout>
                <Settings></Settings>
              </Layout>
            }
          />

          <Route
            path="/product/add-product"
            element={
              <Layout>
                <AddProduct></AddProduct>
              </Layout>
            }
          ></Route>
          <Route
            path="/category"
            element={
              <Layout>
                <Category></Category>
              </Layout>
            }
          ></Route>

          <Route
            path="/"
            element={
              <Layout>
                <Dashboard></Dashboard>
              </Layout>
            }
          />

          <Route
            path="/product/:productId"
            element={
              <Layout>
                <EditProduct></EditProduct>
              </Layout>
            }
          />

          <Route
            path="/product"
            element={
              <Layout>
                <Product></Product>
              </Layout>
            }
          >
            
          </Route>

          <Route>

          </Route>

          <Route path="/login" element={<Login></Login>} />
        </Routes>
        <ToastContainer />
      </Router>
    </>
  );
}

export default App;
