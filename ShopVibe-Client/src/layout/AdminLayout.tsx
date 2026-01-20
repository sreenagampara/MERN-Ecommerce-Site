import { Outlet, Navigate, Link, useLocation, useNavigate } from "react-router-dom";
import { useAdmin } from "../context/AdminContext";
import { FiHome, FiBox, FiShoppingCart, FiUsers, FiLogOut, FiImage, FiShield, FiLayout } from "react-icons/fi";
import React from "react";

const SidebarLink = ({ to, icon, label, currentPath }: { to: string, icon: React.ReactNode, label: string, currentPath: string }) => (
    <Link
        to={to}
        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${currentPath === to || (to !== '/admin' && currentPath.startsWith(to))
            ? "bg-blue-600 text-white shadow-md"
            : "hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
    >
        <span className="text-xl">{icon}</span>
        <span className="font-medium">{label}</span>
    </Link>
);

export default function AdminLayout() {
    const { adminLogout, adminData, isLoading } = useAdmin();
    const location = useLocation();
    const userRole = adminData?.role || "";

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">Loading Admin...</div>;
    }

    if (!adminData) {
        return <Navigate to="/admin-login" state={{ from: location }} replace />;
    }

    return (
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100 font-sans">
            {/* Sidebar */}
            <aside className="w-64 bg-white dark:bg-gray-800 shadow-lg hidden md:flex flex-col">
                <div className="p-6 text-2xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                    ShopVibe Admin
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <SidebarLink to="/admin" icon={<FiHome />} label="Dashboard" currentPath={location.pathname} />

                    {(['SUPER_ADMIN', 'PRODUCT_ADMIN', 'SUPPORT_ADMIN'].includes(userRole)) && (
                        <SidebarLink to="/admin/products" icon={<FiBox />} label="Products" currentPath={location.pathname} />
                    )}

                    {(['SUPER_ADMIN', 'ORDER_ADMIN', 'SUPPORT_ADMIN'].includes(userRole)) && (
                        <SidebarLink to="/admin/orders" icon={<FiShoppingCart />} label="Orders" currentPath={location.pathname} />
                    )}

                    {(['SUPER_ADMIN', 'SUPPORT_ADMIN'].includes(userRole)) && (
                        <SidebarLink to="/admin/users" icon={<FiUsers />} label="Users" currentPath={location.pathname} />
                    )}

                    {(['SUPER_ADMIN'].includes(userRole)) && (
                        <SidebarLink to="/admin/ads" icon={<FiImage />} label="Ads Management" currentPath={location.pathname} />
                    )}

                    {(['SUPER_ADMIN'].includes(userRole)) && (
                        <SidebarLink to="/admin/admins" icon={<FiShield />} label="Admin Roles" currentPath={location.pathname} />
                    )}
                </nav>

                <div className="p-4 border-t dark:border-gray-700">
                    <button
                        onClick={adminLogout}
                        className="flex items-center gap-3 w-full px-4 py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                        <FiLogOut className="text-xl" />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="bg-white dark:bg-gray-800 shadow-sm p-4 flex justify-between items-center md:hidden">
                    <span className="font-bold">ShopVibe Admin</span>
                    {/* Mobile Menu Button could go here */}
                </header>

                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900 p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
