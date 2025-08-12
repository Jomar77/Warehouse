import React from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
  Navigate,
} from "react-router-dom";
import "./index.css";

import Root from "./Routes/Root.jsx";
import Orders from "./Routes/Orders.jsx";
import Products from "./Routes/Products.jsx";
import Purchases from "./Routes/Purchases.jsx";
import Register from "./Routes/Register.jsx";
import NotFound from "./routes-shared/NotFound.jsx";
import ErrorPage from "./routes-shared/ErrorPage.jsx";
import Login from "./Routes/Login.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Root />} errorElement={<ErrorPage />}>
        <Route index element={<Navigate to="/Orders" replace />} />
        <Route path="Orders" element={<Orders />} />
        <Route path="Products" element={<Products />} />
        <Route path="Purchases" element={<Purchases />} />
        <Route path="Register" element={<Register />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </>
  )
);

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
