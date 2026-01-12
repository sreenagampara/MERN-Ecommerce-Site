import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AppContext } from "../context/AppContextInstance";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";


interface Order {
  _id: string;
  productId: string;
  productName: string;
  image: string;
  price: number;
  address: string;
  paymentMethod: "COD" | "ONLINE";
  paymentStatus: "PAID" | "PENDING" | string;
  razorpayOrderId?: string | null;
  razorpayPaymentId?: string | null;
  createdAt: string;
}

export default function MyOrders() {
  const appContext = useContext(AppContext);
 
    const BackendUrl = appContext?.BackendUrl;
  const isLoggedIn = appContext?.isLoggedIn;
  const isLoading = appContext?.isLoading;


  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn && !isLoading){
      toast.error("please login first",{id:'auth-error'})
      navigate('/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        const { data } = await axios.get(
          BackendUrl + "/api/order/get-from-order",
          { withCredentials: true }
        );

        if (data.success) {
          setOrders(data.orders);
        } else {
          toast.error("Failed to load orders");
        }
      } catch (error) {
        console.error(error);
        toast.error("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [location.state?.refreshTime, BackendUrl, isLoggedIn, isLoading,navigate]);

  if (loading) {
    return <p className="text-center mt-10">Loading orders...</p>;
  }
 if (!appContext) return null;
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-5xl mx-auto ">
        <h1 className="text-2xl font-bold mb-6">My Orders</h1>

        {orders.length === 0 ? (
          <div className="bg-white p-6 rounded-xl text-center shadow "> 
            <p className="text-gray-500">You haven’t placed any orders yet.</p>
          </div>
        ) : (
          <div className="space-y-4 ">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-xl shadow p-4 flex flex-col md:flex-row gap-4"
              >
                {/* Product Image */}
                <img
                  src={
                    order.image ||
                    "https://via.placeholder.com/100?text=No+Image"
                  }
                  alt={order.productName}
                  className="w-48 h-48 object-contain rounded-lg border"
                />

                {/* Order Info */}
                <div className="flex-1">
                  <h2 className="font-semibold text-lg">
                    {order.productName}
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    Order ID: <span className="font-mono">{order._id}</span>
                  </p>

                  <p className="text-sm text-gray-600 mt-1">
                    Ordered on{" "}
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>

                  <p className="text-sm text-gray-600 mt-2">
                    📍 {order.address}
                  </p>

                  <div className="flex items-center gap-3 mt-3">
                    {/* Payment Status */}
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        order.paymentStatus === "PAID"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {order.paymentStatus}
                    </span>

                    {/* Payment Method */}
                    <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm">
                      {order.paymentMethod}
                    </span>
                  </div>
                </div>

                {/* Price */}
                <div className="text-right">
                  <p className="text-lg font-bold">₹{order.price}</p>

                  {order.paymentMethod === "ONLINE" &&
                    order.razorpayPaymentId && (
                      <p className="text-xs text-gray-500 mt-2">
                        Payment ID: {order.razorpayPaymentId}
                      </p>
                    )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
