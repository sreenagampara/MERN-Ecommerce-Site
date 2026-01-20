import axios from "axios";
import { createContext, useCallback, useEffect, useState,  useContext } from "react";
import type { ReactNode } from "react";
import { toast } from "react-hot-toast";

interface AdminType {
    id: string;
    email: string;
    role: string;
}

interface AdminContextType {
    isAdminLoggedIn: boolean;
    adminData: AdminType | null;
    isLoading: boolean;
    adminLogin: (email: string, password: string) => Promise<boolean>;
    adminLogout: () => void;
    checkAdminAuth: () => void;
}

const AdminContext = createContext<AdminContextType | null>(null);

export const useAdmin = () => {
    const context = useContext(AdminContext);
    if (!context) throw new Error("useAdmin must be used within AdminProvider");
    return context;
};

export const AdminProvider = ({ children }: { children: ReactNode }) => {
    axios.defaults.withCredentials = true;
    // Assuming same backend URL logic as AppContext
    const BackendUrl = import.meta.env.VITE_BACKEND_URL as string;

    const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
    const [adminData, setAdminData] = useState<AdminType | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const checkAdminAuth = useCallback(async () => {
        try {
            const { data } = await axios.get(BackendUrl + "/api/admin/auth/check");
            if (data.success) {
                setIsAdminLoggedIn(true);
                setAdminData(data.admin);
            } else {
                setIsAdminLoggedIn(false);
                setAdminData(null);
            }
        } catch (error) {
            setIsAdminLoggedIn(false);
            setAdminData(null);
        } finally {
            setIsLoading(false);
        }
    }, [BackendUrl]);

    const adminLogin = async (email: string, password: string) => {
        try {
            const { data } = await axios.post(BackendUrl + "/api/admin/auth/login", { email, password });
            if (data.success) {
                setIsAdminLoggedIn(true);
                setAdminData(data.admin);
                toast.success("Welcome Admin");
                return true;
            } else {
                toast.error(data.message);
                return false;
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Login Failed");
            return false;
        }
    };

    const adminLogout = async () => {
        try {
            const { data } = await axios.post(BackendUrl + "/api/admin/auth/logout");
            if (data.success) {
                setIsAdminLoggedIn(false);
                setAdminData(null);
                toast.success("Logged out");
            }
        } catch (error) {
            toast.error("Logout failed");
        }
    };

    useEffect(() => {
        checkAdminAuth();
    }, [checkAdminAuth]);

    return (
        <AdminContext.Provider value={{ isAdminLoggedIn, adminData, isLoading, adminLogin, adminLogout, checkAdminAuth }}>
            {children}
        </AdminContext.Provider>
    );
};
