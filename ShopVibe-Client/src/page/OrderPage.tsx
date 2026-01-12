import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContextInstance";
import axios from "axios";
import toast from "react-hot-toast";


interface OrderProduct {
  id: string;
  productName: string;
  price: number;
  image: string;
  description: string;
  division: string;
}

interface RazorpaySuccessResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface RazorpayInstance {
  open: () => void;
}

declare global {
  interface Window {
    Razorpay: new (options: object) => RazorpayInstance;
  }
}


export default function OrderPage() {
  const RazorPayKey = import.meta.env.VITE_RAZORPAY_KEY_ID as string;
  const location = useLocation();
  const navigate = useNavigate();
  const appContext = useContext(AppContext);

  const BackendUrl = appContext?.BackendUrl;
  const isLoggedIn = appContext?.isLoggedIn;
  const isLoading = appContext?.isLoading;

  const product = location.state as OrderProduct | null;

  const [address, setAddress] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "ONLINE">(
    "ONLINE"
  );
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  useEffect(() => {
    if (!isLoggedIn && !isLoading) {
      toast.error("Please Loggin First", { id: "auth-error" });
      navigate("/login");
    }
  },[isLoggedIn, isLoading, navigate]);

  useEffect(() => {
    if (!product) {
      navigate("/");
    }
  }, [product, navigate]);

  if (!product) return null;


  const handleRazorpayPayment = async () => {
    try {
      // 1️⃣ Create order (your API)
      const { data } = await axios.post(
        BackendUrl + "/api/payment/create-order",
        { amount: product.price },
        { withCredentials: true }
      );

      if (!data.success) {
        toast.error("Failed to create payment");
        return;
      }

      const order = data.order;

      // 2️⃣ Razorpay options
      const options = {
        key: RazorPayKey, // 🔴 your Razorpay KEY_ID
        amount: order.amount,
        currency: "INR",
        name: "ShopVibe",
        description: product.productName,
        order_id: order.id,


        handler: async function (response: RazorpaySuccessResponse) {
          try {
            setIsPlacingOrder(true);
            const verifyRes = await axios.post(
              BackendUrl + "/api/payment/verify-payment",
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
              { withCredentials: true }
            );

            if (verifyRes.data.success) {
              toast.success("Payment successful ✅");
              setIsPlacingOrder(false);

              // Save order in DB for online payment

              await axios.post(
                BackendUrl + "/api/order/place-order",
                {
                  productId: product.id,
                  productName: product.productName,
                  image: product.image,
                  price: product.price,
                  address: address,
                  paymentMethod: "ONLINE",
                  paymentStatus: "PAID",
                  razorpayOrderId: response.razorpay_order_id,
                  razorpayPaymentId: response.razorpay_payment_id,
                },
                { withCredentials: true }
              );

              navigate("/my-order");
            } else {
              toast.error("Payment verification failed");
            }
          } catch (error:unknown) {
            if (error instanceof Error){
            toast.error(error.message);
            setIsPlacingOrder(false);
            }else{
              toast.error("something went wrong")
            }
          }
        },

        prefill: {
          name: "Customer",
          contact: "9999999999",
        },

        theme: {
          color: "#16a34a",
        },
      };

      // 5️⃣ Open Razorpay popup
      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error(error);
      toast.error("Payment failed");
    }
  };

  const handleOrder = (): void => {
    if (!address.trim()) {
      alert("Please enter delivery address");

      return;
    }
    if (paymentMethod === "COD") {
      try {
        setIsPlacingOrder(true);

        axios.post(
          BackendUrl + "/api/order/place-order",
          {
            productId: product.id,
            productName: product.productName,
            image: product.image,
            price: product.price,
            address: address,
            paymentMethod: "COD",
            paymentStatus: "PENDING",
            razorpayOrderId: "",
            razorpayPaymentId: "",
          },
          { withCredentials: true }
        );

        toast.success("Order placed (COD) ✅");
        navigate("/my-order", { state: { refreshTime: Date.now() } });
      } catch {
        toast.error("faied to place your order");
      } finally {
        setIsPlacingOrder(false);
      }
    } else {
      // Online payment
      handleRazorpayPayment();
    }
  };

  const handleAddToCart = async () => {
    try {
      const { data } = await axios.post(
        BackendUrl + "/api/cart/add-to-cart",
        {
          productId: product.id,
        },
        {
          withCredentials: true, // 🔥 sends cookie (JWT)
        }
      );

      if (!data.success) {
        toast(data.message);
        return;
      }

      toast.success("Product added to cart successfully");
    } catch (error: unknown) {
      if(error instanceof Error){
        toast.error(error.message)
      }else{
        toast.error("something went wrong")
      }
    }
  };

  if (!appContext) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {isLoading ? (
        <p className="text-center">Loading....</p>
      ) : (
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Product Details */}
          <div className="bg-white rounded-xl shadow-md p-5">
            <img
              src={product.image}
              alt={product.productName}
              className="w-48 h-48 object-contain mx-auto mb-3 rounded-lg"
            />

            <h2 className="text-2xl font-semibold mt-4">
              {product.productName}
            </h2>
            <p className="text-xl font-bold mt-2 text-gray-900">
              ₹{product.price}
            </p>

            <div className="flex gap-3 mt-4">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Add to Cart
              </button>
              <button className="flex-1 border border-blue-600 text-blue-600 py-2 rounded-lg hover:bg-blue-50 transition">
                Wishlist
              </button>
            </div>
          </div>

          {/* Address & Order */}
          <div className="bg-white rounded-xl shadow-md p-5">
            <h2 className="text-xl font-semibold mb-3">Delivery Address</h2>

            <input
              type="text"
              placeholder="Full Name"
              className="w-full border rounded-lg p-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="text"
              placeholder="Phone Number"
              className="w-full border rounded-lg p-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <textarea
              placeholder="Full Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full border rounded-lg p-2 mb-3 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <div className="border-t pt-3 mt-3 text-sm">
              <div className="flex justify-between mb-1">
                <span>Product Price</span>
                <span>₹{product.price}</span>
              </div>
              <div className="flex justify-between mb-1">
                <span>Shipping</span>
                <span className="text-green-600">Free</span>
              </div>
              <div className="flex justify-between font-semibold text-base">
                <span>Total</span>
                <span>₹{product.price}</span>
              </div>
            </div>
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Payment Method</h3>

              <label className="flex items-center gap-2 mb-2">
                <input
                  type="radio"
                  checked={paymentMethod === "ONLINE"}
                  onChange={() => setPaymentMethod("ONLINE")}
                />
                Online Payment
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={paymentMethod === "COD"}
                  onChange={() => setPaymentMethod("COD")}
                />
                Cash on Delivery
              </label>
            </div>

            <button
              disabled={isPlacingOrder}
              onClick={() => {
                handleOrder();
              }}
              className={`w-full mt-4 bg-green-600 text-white py-3 rounded-xl text-lg hover:bg-green-700 transition"
              ${
                isPlacingOrder
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700 text-white"
              }`}
            >
              {isPlacingOrder ? "Placing your order..." : "Place Order"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
