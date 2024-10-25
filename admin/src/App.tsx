import { useState } from "react";

import "./App.css";
// import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Layout } from "./layout/Layout";
import { Dashboard } from "./pages/Dashboard";
import { Product } from "./pages/Product";
import { Login } from "./pages/Login";


function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <Layout>
                <Dashboard></Dashboard>
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
          />

          <Route path="/login" element={<Login></Login>} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
