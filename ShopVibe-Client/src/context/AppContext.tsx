import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { toast } from "react-hot-toast";
import { AppContext } from "./AppContextInstance";

export interface UserType {
  name: string;
  isAccountVerified: boolean;
}

export const AppContextProvider = ({ children }: { children: ReactNode }) => {
  axios.defaults.withCredentials = true;
  const BackendUrl = import.meta.env.VITE_BACKEND_URL as string;
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<UserType | null>(null);
  const [isLoading, setIsloading] = useState(true);

    const getUserData = useCallback( async () => {
    try {
      const { data } = await axios.get(BackendUrl + "/api/user/data");
      if (data.success) {
        setUserData(data.userData);
      } else {
        toast.error(data.message);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong");
      }
    }
  },[setUserData,BackendUrl]);

  const getAuthState = useCallback(async () => {
    try {
      const { data } = await axios.get(BackendUrl + "/api/auth/is-auth");
      if (data.success) {
        setIsLoggedIn(true);
        await getUserData();
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setIsloading(false);
    }
  }, [BackendUrl,getUserData]);

  const logout = async () => {
    try {
      const { data } = await axios.post(BackendUrl + "/api/auth/logout");
      if(data.success){
        setIsLoggedIn(false);
        setUserData(null)
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong");
      }
    }
  };


  const sendVerificationOtp = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(
        BackendUrl + "/api/auth/send-verify-otp"
      );
      if (data.success) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong");
      }
    }
  };
  useEffect(() => {
    getAuthState();
  }, [getAuthState]);
  return (
    <AppContext.Provider
      value={{
        BackendUrl,
        isLoggedIn,
        setIsLoggedIn,
        setUserData,
        getUserData,
        userData,
        logout,
        sendVerificationOtp,
        isLoading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
