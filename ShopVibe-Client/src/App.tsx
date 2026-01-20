import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./layout/Layout";
import Home from "./page/Home";
import Mobiles from "./page/Mobiles_laptop";
import Fashion from "./page/Fashion";
import Books from "./page/Books";
import TVandAppliances from "./page/TVandAppliances";
import HomeAndKitchen from "./page/HomeAndKitchen";
import BeautyAndToy from "./page/BeautyAndToy";
import Furniture from "./page/Furniture";
import Login from "./page/Login";
import EmailVerify from "./page/EmailVerify";
import ResetPassword from "./page/ResetPassword";
import SignupPage from "./page/Signup.tsx";
import { Toaster } from "react-hot-toast";
import OrderPage from "./page/OrderPage.tsx";
import CartPage from "./page/CartPage.tsx";
import MyOrders from "./page/MyOrder.tsx";
import SearchPage from "./page/SearchPage.tsx";
import OfferPage from "./page/OfferPage.tsx";

import AdminLayout from "./layout/AdminLayout";
import AdminLogin from "./page/admin/AdminLogin";
import Dashboard from "./page/admin/Dashboard";
import AdminProducts from "./page/admin/AdminProducts";
import AdminOrders from "./page/admin/AdminOrders";
import AdminUsers from "./page/admin/AdminUsers";
import AdminAds from "./page/admin/AdminAds";
import AdminManagement from "./page/admin/AdminManagement"; // Added
import Unauthorized from "./page/admin/Unauthorized"; // Added
import RoleGuard from "./components/RoleGuard"; // Added

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "mobiles-laptop", element: <Mobiles /> },
      { path: "fashion", element: <Fashion /> },
      { path: "books", element: <Books /> },
      { path: "tv-and-appliances", element: <TVandAppliances /> },
      { path: "home-and-kitchen", element: <HomeAndKitchen /> },
      { path: "beauty-and-toy", element: <BeautyAndToy /> },
      { path: "furniture", element: <Furniture /> },
      { path: "/order-page", element: <OrderPage /> },
      { path: "/cart-page", element: <CartPage /> },
      { path: "/signup", element: <SignupPage /> },
      { path: "/login", element: <Login /> },
      { path: "/my-order", element: <MyOrders /> },
      { path: "/search", element: <SearchPage /> },
      { path: "/offer-page", element: <OfferPage /> }
    ],
  },

  // Pages that shouldn't have layout


  { path: "/email-verify", element: <EmailVerify /> },
  { path: "/reset-password", element: <ResetPassword /> },

  // Admin Routes
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      {
        path: "",
        element: <Dashboard />,
      },
      {
        path: "unauthorized",
        element: <Unauthorized />,
      },
      // Products Guard
      {
        element: <RoleGuard allowedRoles={['SUPER_ADMIN', 'PRODUCT_ADMIN', 'SUPPORT_ADMIN']} />,
        children: [
          { path: "products", element: <AdminProducts /> },
        ]
      },
      // Orders Guard
      {
        element: <RoleGuard allowedRoles={['SUPER_ADMIN', 'ORDER_ADMIN', 'SUPPORT_ADMIN']} />,
        children: [
          { path: "orders", element: <AdminOrders /> },
        ]
      },
      // Users Guard
      {
        element: <RoleGuard allowedRoles={['SUPER_ADMIN', 'SUPPORT_ADMIN']} />,
        children: [
          { path: "users", element: <AdminUsers /> },
        ]
      },
      // Super Admin Guard (Ads, Admins)
      {
        element: <RoleGuard allowedRoles={['SUPER_ADMIN']} />,
        children: [
          { path: "ads", element: <AdminAds /> },
          { path: "admins", element: <AdminManagement /> },
        ]
      }
    ],
  },
  { path: "/admin-login", element: <AdminLogin /> },
]);

export default function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#363636",
            color: "#fff",
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: "#4aed88",
              secondary: "#fff",
            },
          },
        }}
      />
      <RouterProvider router={router} />;
    </>
  );
}
