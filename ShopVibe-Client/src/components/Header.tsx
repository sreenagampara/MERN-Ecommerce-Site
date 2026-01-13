import { useCallback, useContext, useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContextInstance";
import axios from "axios";
import myLog from "../asset/Logo.png"

interface SearchProduct {
  _id: string;
  productName: string;
  imageUrl: string;
  price: number;
}


export default function Header() {
  const navigate = useNavigate();
  const appContext = useContext(AppContext);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchProduct[]>([]);
  const [loading, setLoading] = useState(false);

  const BackendUrl = appContext?.BackendUrl;
  const userData = appContext?.userData;
  const logout = appContext?.logout;
  const sendVerificationOtp = appContext?.sendVerificationOtp;

  /* 🔍 SEARCH FUNCTION */
  const searchProducts = useCallback( async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setLoading(true);
      const res = await axios.get(BackendUrl + "/api/product/search-product", {
        params: { q: query, limit: 5 },
      });
      setSearchResults(res.data.products || []);
    } catch (error) {
      console.error("Search error", error);
    } finally {
      setLoading(false);
    }
  },[setSearchResults,setLoading,BackendUrl]);

 
  useEffect(() => {
    const delay = setTimeout(() => {
      searchProducts(searchQuery);
    }, 400);

    return () => clearTimeout(delay);
  }, [searchQuery,searchProducts]);

    if (!appContext) {
    return null;
  }

  return (
    <header className=" text-blue-700 shadow z-50 w-full sm:p-1 md:p-3 lg:px-4 bg-white ">
      <div className="flex flex-wrap justify-between items-center gap-3 p-2 sm:p-2 md:p-6 lg:p-8">
        {/* Left Logo */}
        <div>
          <Link
            to="/"
          >
            <img src={myLog} className="h-18 w-auto"/>
          </Link>
        </div>

        {/* 🔍 SEARCH BAR */}
        <div className="relative flex-1 min-w-[180px] sm:min-w-[220px]  max-w-full sm:max-w-sm md:max-w-md">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && searchQuery.trim()) {
                navigate(`/search?q=${searchQuery}`);
                setSearchResults([]);
              }
            }}
           
            className="w-full border border-gray-300 p-2 rounded text-black focus:outline-none"
          />

          {/* 🔽 SEARCH DROPDOWN */}
          {searchQuery && searchResults.length > 0 && (
            <div className="absolute top-full left-0 w-full bg-white shadow-md border z-50">
              {loading && (
                <p className="p-2 text-sm text-gray-500">Searching...</p>
              )}

              {searchResults.map((item) => (
                <div
                  key={item._id}
                  onClick={() => {
                    navigate(`/search?q=${encodeURIComponent(item.productName)}`);
                    setSearchQuery("");
                    setSearchResults([]);
                  }}
                  className="p-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                >
                  <img
                    src={item.imageUrl}
                    alt={item.productName}
                    className="w-10 h-10 object-cover"
                  />
                  <div>
                    <p className="text-sm font-medium text-black">
                      {item.productName}
                    </p>
                    <p className="text-xs text-gray-600">₹{item.price}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        {/* Left Buttons */}
        <div className=" cursor-pointer px-3 flex items-center gap-4">
          {userData ? (
            <div className="w-8 h-8 flex justify-center items-center rounded-full bg-black text-white relative group">
              {userData.name[0].toUpperCase()}
              <div className="absolute hidden group-hover:block top-0 right-0 z-10 text-black rounded pt-10 w-max">
                <ul className="list-none m-0 p-2 bg-gray-100 text-sm">
                  {!userData.isAccountVerified && (
                    <li
                      onClick={async () => {
                        if(!sendVerificationOtp) return;
                        await sendVerificationOtp();
                        navigate("/email-verify");
                      }}
                      className="py-1 px-1 hover:bg-gray-200 cursor-pointer"
                    >
                      Verify email
                    </li>
                  )}
                  <li
                    onClick={async () => {
                      if(!logout)return;
                      await logout();
                      navigate("/");
                    }}
                    className="py-1 px-1 hover:bg-gray-200 cursor-pointer"
                  >
                    Logout
                  </li>
                </ul>
              </div>
            </div>
          ) : (
            <NavLink
              to="/login"
              className="text-base sm:text-lg md:text-xl p-1 hover:bg-blue-700 hover:text-white hover:rounded-lg sm:px-0 md:px-1 lg:px-3"
            >
              Login
            </NavLink>
          )}

          <NavLink
            to="/my-order"
            className="text-base sm:text-lg md:text-xl p-1 cursor-pointer active:border hover:bg-blue-700 hover:text-white hover:rounded-lg sm:px-0 md:px-1  lg:px-3"
          >
            My Order
          </NavLink>
          <NavLink
            to="/cart-page"
            className="text-base sm:text-lg md:text-xl p-1 cursor-pointer active:border hover:bg-blue-700 hover:text-white hover:rounded-lg sm:px-0 md:px-1  lg:px-3"
          >
            Cart
          </NavLink>
        </div>
      </div>
    </header>
  );
}
