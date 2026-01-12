import { useEffect, useState, useContext, useCallback } from "react";
import axios from "axios";
import { AppContext } from "../context/AppContextInstance";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";

type CartItem = {
  _id: string;
  productName: string;
  price: string;
  imageUrl: string;
  category?: string;
  subCategory?: string;
};

export default function CartPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const appContext = useContext(AppContext);

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  const BackendUrl = appContext?.BackendUrl;
  const isLoggedIn = appContext?.isLoggedIn;
  const isLoading = appContext?.isLoading;

  useEffect(() => {
    if (!isLoggedIn && !isLoading) {
      toast.error("Please Login First", { id: "auth-error" });
      navigate("/login");
      return;
    }
  },[isLoggedIn, isLoading, navigate]);

  const getCartItem = useCallback( async () => {
    if (!BackendUrl) return;
    setLoading(true);
    try {
      const { data } = await axios.get(BackendUrl + "/api/cart/get-from-cart");
      if (data.success) {
        setCartItems(data.cart);
      } else {
        console.log("Error in loading Item");
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setLoading(false);
    }
  },[BackendUrl]);

   useEffect(() => {
    getCartItem();
  }, [location.pathname, getCartItem]);

  const removeItem = async (productId: string) => {
    try {
      const { data } = await axios.delete(
        BackendUrl + "/api/cart/remove-from-cart",
        {
          data: { productId }, // 👈 important
          withCredentials: true,
        }
      );

      if (data.success) {
        toast.success("Item removed from cart");

        // update UI instantly
        setCartItems((prev) => prev.filter((item) => item._id !== productId));
      }
    } catch (error) {
      toast.error("Failed to remove item");
      console.error(error);
    }
  };
  const handlBuyNow = (item: CartItem) => {
    navigate("/order-page", {
      state: {
        id: item._id,
        productName: item.productName,
        price: item.price,
        image: item.imageUrl,
      },
    });
  };
  if (!appContext) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6">🛒 Your Cart</h1>

        {loading && isLoading ? (
          <p className="text-center">Loading...</p>
        ) : cartItems.length === 0 ? (
          <p className="text-gray-500 text-center">Your cart is empty</p>
        ) : (
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div
                key={item._id}
                className="flex items-center justify-between border rounded-xl p-2"
              >
                <div className="flex items-center gap-3 flex-col md:flex-row">
                  <div className="w-20 h-full bg-gray-200 rounded-lg flex items-center justify-center text-gray-600 text-xs sm:text-sm md:text-lg lg:text-2xl gap-3">
                    <img src={item.imageUrl} alt={item.productName} />
                  </div>
                  <p>{item.productName}</p>
                  <div>
                    <h2 className="font-semibold">{""}</h2>
                    <p className="text-gray-600 text-xs sm:text-sm md:text-lg lg:text-2xl">
                      ₹{item.price}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => removeItem(item._id)}
                    className="cursor-pointer w-full sm:w-auto px-2 py-1 sm:px-3 sm:py-1 md:px-4 md:py-2 lg:px-5 lg:py-2 rounded-lg border border-red-500 text-sm sm:text-base md:text-lg text-red-500 hover:bg-red-50 transition-colors"
                  >
                    Remove
                  </button>
                  <button
                    onClick={() => {
                      handlBuyNow(item);
                    }}
                    className="cursor-pointer w-full sm:w-auto px-2 py-1 sm:px-3 sm:py-1 md:px-4 md:py-2 lg:px-5 lg:py-2 rounded-lg border bg-green-500 text-sm sm:text-base md:text-lg text-white hover:bg-green-600 transition-colors"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
