import { useContext, useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { AppContext } from "../context/AppContextInstance";
import axios from "axios";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading,setLoading]=useState(false)

  const appContext = useContext(AppContext);

 const BackendUrl = appContext?.BackendUrl;
  const setIsLoggedIn = appContext?.setIsLoggedIn;
  const getUserData = appContext?.getUserData;

  const navigate = useNavigate();

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    setLoading(true)
    e.preventDefault();
    axios.defaults.withCredentials = true;

    if (!BackendUrl) {
      toast.error("Backend Url not found");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Password do not match!");
      return;
    } else {
      try {
        if(!setIsLoggedIn || !getUserData) return;
        const { data } = await axios.post(BackendUrl + "/api/auth/register", {
          name,
          email,
          password,
        });
        console.log("registration success");
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
       }else{
        toast.error("somthing went wrong")
       }
      }
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="mt-4 text-gray-600 font-medium">Authenticating, please wait...</p>
      </div>
    );
  }
   if (!appContext) {
    return null; // context not loaded yet
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
            <h1 className="text-3xl font-bold mt-2">Create Your Account</h1>
            <p className="text-gray-500 text-center">
              Join ShopeVibe and start shopping today!
            </p>
          </div>

          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="text-sm font-semibold">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

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
                placeholder="Create a password"
                className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="text-sm font-semibold">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your password"
                className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-xl p-3 text-lg font-semibold bg-green-600 text-white hover:bg-green-700 transition"
            >
              Create Account
            </button>
          </form>

          <p className="text-center text-sm mt-4 text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 cursor-pointer">
              Login
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
