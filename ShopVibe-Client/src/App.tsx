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
      {path:"/my-order",element:<MyOrders/>},
      {path:"/search",element:<SearchPage/>},
      {path:"/offer-page",element:<OfferPage/>}
    ],
  },

  // Pages that shouldn't have layout

  { path: "/email-verify", element: <EmailVerify /> },
  { path: "/reset-password", element: <ResetPassword /> },
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
