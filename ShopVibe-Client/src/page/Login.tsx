import { useContext, useState } from "react";
import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContextInstance";
import { toast } from "react-hot-toast";
import axios from "axios";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading,setLoading] =useState(false)

  const appContext = useContext(AppContext)
  const navigate=useNavigate()
  
  const BackendUrl =  appContext?.BackendUrl;
  const setIsLoggedIn = appContext?.setIsLoggedIn;
  const getUserData = appContext?.getUserData;
  


  const handleLogin = async (e:React.FormEvent<HTMLFormElement>) => {
    
    setLoading(true)
    e.preventDefault();
    
    if(!BackendUrl){
      toast.error('Backend url not found')
    }else{
      try {

        if(!setIsLoggedIn || !getUserData) return;

        const {data}=await axios.post(BackendUrl+"/api/auth/login",{
          email,
          password
        })
          if (data.success) {
          setIsLoggedIn(true);
          getUserData();
          navigate("/");
        } else {
          toast.error(data.message);
        }
      } catch (error:unknown) {
        if(error instanceof Error){
          toast.error(error.message)
        }else{ toast.error("Somthing went wrong")}
      }
    }
    setLoading(false)
  };



  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="mt-4 text-gray-600 font-medium">Authenticating, please wait...</p>
      </div>
    );
  }
    if(!appContext){
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="shadow-xl rounded-2xl p-6 bg-white">
          <div className="flex flex-col items-center mb-6">
            <ShoppingBag size={50} />
            <h1 className="text-3xl font-bold mt-2">ShopeVibe</h1>
            <p className="text-gray-500">Welcome back! Login to continue.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-sm font-semibold">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="text-sm font-semibold">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
             <p className="text-center text-sm mt-4 text-gray-600">
            Forgot Password? <Link to="/reset-password" className="text-blue-600 cursor-pointer">Reset Password</Link>
          </p>

            <button
              type="submit"
              className="w-full rounded-xl p-3 text-lg font-semibold bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              Login
            </button>
          </form>

          <p className="text-center text-sm mt-4 text-gray-600">
            Don't have an account? <Link to="/signup" className="text-blue-600 cursor-pointer">Sign Up</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
