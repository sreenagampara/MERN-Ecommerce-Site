import { useEffect, useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { AppContext } from "../context/AppContextInstance";
import toast from "react-hot-toast";

interface BackendProduct {
  _id: string;
  productName: string;
  price: number;
  imageUrl: string;
  catagory: string;
  " division"?: string;
}

interface Product {
  _id: string;
  productName: string;
  price: number;
  imageUrl: string;
  category?: string;
  subCategory?: string;
}


export default function SearchPage() {
  const { BackendUrl } = useContext(AppContext) || {};
  const navigate = useNavigate();
  const { search } = useLocation();
  const query = new URLSearchParams(search).get("q") || "";

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!query.trim() || !BackendUrl) return;

    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await axios.get(
          BackendUrl + "/api/product/search-product",
          { params: { q: query, limit: 20 } }
        );

        // Map backend fields to frontend-friendly keys
        const mappedProducts = res.data.products.map((p: BackendProduct) => ({
          ...p,
          category: p.catagory,
          division: p[" division"]?.trim(),
        }));

        setProducts(mappedProducts);
      } catch (error: unknown) {
      if(error instanceof Error){
        toast.error(error.message)
      }else{
        toast.error("something went wrong")
      }
    } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [query, BackendUrl]);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Search results for "{query}"</h1>

      {loading && <p>Loading products...</p>}

      {error && <p className="text-red-500">{error}</p>}

      {!loading && products.length === 0 && (
        <p>No products found for "{query}"</p>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {products.map((item) => (
          <div
            key={item._id}
            className="bg-white rounded cursor-pointer hover:shadow-lg"
            onClick={() =>
              navigate("/order-page", {
                state: {
                  image: item.imageUrl,
                  productName: item.productName,
                  price: item.price,
                  id: item._id,
                },
              })
            }
          >
            <img
              src={item.imageUrl}
              alt={item.productName}
              className="w-48 h-48 object-contain mx-auto mb-3 rounded-lg"
            />
            <p className="text-lg font-semibold text-gray-800 mb-1">
              {item.productName}
            </p>
            <p className="text-xl font-bold text-green-600">₹{item.price}</p>
            <p className="text-xs text-gray-500">{item.category}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
