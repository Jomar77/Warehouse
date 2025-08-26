import React from "react";
import ReactDOM from "react-dom/client";
import {
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  Navigate,
} from "react-router-dom";
import "./index.css";

import Root from "./Routes/Root.jsx";
import Login from "./Routes/Login.jsx";
import Orders from "./Routes/Orders.jsx";
import Products from "./Routes/Products.jsx";
import Purchases from "./Routes/Purchases.jsx";
import Suppliers from "./Routes/Suppliers.jsx";
import Register from "./Routes/Register.jsx";
import NotFound from "./routes-shared/NotFound.jsx";
import ErrorPage from "./routes-shared/ErrorPage.jsx";
import ProtectedRoute from "./Components/ProtectedRoute.jsx";
import {DataProvider} from "./Context/DataContext.jsx";
import { AuthProvider } from "./Context/AuthContext.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Root />
          </ProtectedRoute>
        }
        errorElement={<ErrorPage />}
      >
        <Route index element={<Navigate to="/Orders" replace />} />
        <Route path="Orders" element={<Orders />} />
        <Route path="Products" element={<Products />} />
        <Route path="Purchases" element={<Purchases />} />
        <Route path="Suppliers" element={<Suppliers />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <DataProvider>
        <RouterProvider router={router} />
      </DataProvider>
    </AuthProvider>
  </React.StrictMode>
);
