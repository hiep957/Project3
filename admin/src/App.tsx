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
import Users from "./pages/Users";
import MyOrder from "./pages/Orders";
import UserList from "./pages/Users";
const API_URL = import.meta.env.VITE_API_URL;
function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route>

            <Route
              path="/order"
              element={
                <Layout>
                  <MyOrder></MyOrder>
                </Layout>
              }
            />
            <Route
              path="/users"
              element={
                <Layout>
                  <UserList></UserList>
                </Layout>
              }
            />
          </Route>

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
          ></Route>

          <Route></Route>

          <Route path="/login" element={<Login></Login>} />
        </Routes>
        <ToastContainer />
      </Router>
    </>
  );
}

export default App;
