import { useEffect, useState } from "react";
import axios from "axios";
import { useAdmin } from "../../context/AdminContext";
import { FiShoppingCart, FiUsers, FiBox, FiDollarSign } from "react-icons/fi";

export default function Dashboard() {
    const { isAdminLoggedIn } = useAdmin();
    const [stats, setStats] = useState({
        totalOrders: 0,
        totalUsers: 0,
        totalProducts: 0,
        totalRevenue: 0
    });
    const BackendUrl = import.meta.env.VITE_BACKEND_URL as string;

    useEffect(() => {
        if (isAdminLoggedIn) {
            axios.get(BackendUrl + "/api/admin/stats", { withCredentials: true })
                .then(res => {
                    if (res.data.success) setStats(res.data.stats);
                })
                .catch(err => console.error(err));
        }
    }, [isAdminLoggedIn, BackendUrl]);

    const cards = [
        { label: "Total Orders", value: stats.totalOrders, icon: <FiShoppingCart />, color: "bg-blue-500" },
        { label: "Total Users", value: stats.totalUsers, icon: <FiUsers />, color: "bg-green-500" },
        { label: "Products", value: stats.totalProducts, icon: <FiBox />, color: "bg-purple-500" },
        { label: "Revenue", value: `₹${stats.totalRevenue.toLocaleString()}`, icon: <FiDollarSign />, color: "bg-yellow-500" },
    ];

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">Dashboard Overview</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card, index) => (
                    <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex items-center justify-between transform hover:scale-105 transition-transform">
                        <div>
                            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">{card.label}</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{card.value}</p>
                        </div>
                        <div className={`p-4 rounded-full text-white ${card.color} text-2xl`}>
                            {card.icon}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
