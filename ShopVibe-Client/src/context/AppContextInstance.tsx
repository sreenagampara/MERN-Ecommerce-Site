import { createContext } from "react";

export interface UserType {
  name: string;
  isAccountVerified: boolean;
}

interface AppContextType {
  BackendUrl: string;
  isLoggedIn: boolean;
  isLoading: boolean;
  userData: UserType | null;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  setUserData: React.Dispatch<React.SetStateAction<UserType | null>>;
  getUserData: () => Promise<void>;
  logout: () => Promise<void>;
  sendVerificationOtp: () => Promise<void>;
}

export const AppContext = createContext<AppContextType | null>(null);