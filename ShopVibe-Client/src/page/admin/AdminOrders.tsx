import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { FiEdit, FiTrash2 } from "react-icons/fi";

const BackendUrl = import.meta.env.VITE_BACKEND_URL as string;

export default function AdminOrders() {
    const [orders, setOrders] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentOrder, setCurrentOrder] = useState<any>({
        productName: "", price: 0, address: "", status: "new", paymentStatus: "PENDING"
    });

    const fetchOrders = async () => {
        try {
            const { data } = await axios.get(BackendUrl + "/api/admin/orders", { withCredentials: true });
            if (data.success) setOrders(data.orders);
        } catch (error) { toast.error("Failed to fetch orders"); }
    };

    useEffect(() => { fetchOrders(); }, []);

    const updateStatus = async (id: string, field: string, value: string) => {
        try {
            await axios.put(`${BackendUrl}/api/admin/orders/${id}`, { [field]: value }, { withCredentials: true });
            toast.success("Order Updated");
            fetchOrders();
        } catch (error) { toast.error("Update failed"); }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (currentOrder._id) {
                await axios.put(`${BackendUrl}/api/admin/orders/${currentOrder._id}`, currentOrder, { withCredentials: true });
                toast.success("Order Updated");
            }
            setIsModalOpen(false);
            fetchOrders();
        } catch (error) {
            toast.error("Operation failed");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure?")) return;
        try {
            await axios.delete(`${BackendUrl}/api/admin/orders/${id}`, { withCredentials: true });
            toast.success("Order Deleted");
            fetchOrders();
        } catch (error) { toast.error("Delete failed"); }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Orders</h1>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-x-auto">
                <table className="w-full text-left whitespace-nowrap">
                    <thead className="bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-200">
                        <tr>
                            <th className="p-4">Order ID</th>
                            <th className="p-4">Customer</th>
                            <th className="p-4">Item</th>
                            <th className="p-4">Amount</th>
                            <th className="p-4">Payment</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {orders.map((order) => (
                            <tr key={order._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                <td className="p-4 text-sm font-mono text-gray-500">{order._id.substring(0, 8)}...</td>
                                <td className="p-4 font-medium text-gray-900 dark:text-white">{order.userId?.name || "User"}</td>
                                <td className="p-4 text-sm text-gray-600 dark:text-gray-300">{order.productName || "Product"}</td>
                                <td className="p-4">₹{order.price}</td>
                                <td className="p-4">
                                    <select
                                        className={`p-1 rounded text-sm font-semibold ${order.paymentStatus === 'PAID' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}
                                        value={order.paymentStatus}
                                        onChange={(e) => updateStatus(order._id, 'paymentStatus', e.target.value)}
                                    >
                                        <option value="PENDING">Pending</option>
                                        <option value="PAID">Paid</option>
                                        <option value="FAILED">Failed</option>
                                    </select>
                                </td>
                                <td className="p-4">
                                    <select
                                        className="bg-gray-100 dark:bg-gray-600 border-none rounded p-1 text-sm"
                                        value={order.status}
                                        onChange={(e) => updateStatus(order._id, 'status', e.target.value)}
                                    >
                                        <option value="new">New</option>
                                        <option value="approved">Approved</option>
                                        <option value="shipped">Shipped</option>
                                        <option value="delivered">Delivered</option>
                                    </select>
                                </td>
                                <td className="p-4 flex gap-3">
                                    <button onClick={() => { setCurrentOrder(order); setIsModalOpen(true); }} className="text-blue-500 hover:text-blue-400">
                                        <FiEdit />
                                    </button>
                                    <button onClick={() => handleDelete(order._id)} className="text-red-500 hover:text-red-400">
                                        <FiTrash2 />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Edit Order</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input
                                placeholder="Product Name"
                                className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                                value={currentOrder.productName || ""}
                                onChange={e => setCurrentOrder({ ...currentOrder, productName: e.target.value })}
                            />
                            <input
                                placeholder="Price"
                                type="number"
                                className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                                value={currentOrder.price}
                                onChange={e => setCurrentOrder({ ...currentOrder, price: e.target.value })}
                            />
                            <textarea
                                placeholder="Address"
                                className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                                value={currentOrder.address || ""}
                                onChange={e => setCurrentOrder({ ...currentOrder, address: e.target.value })}
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <select
                                    className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                                    value={currentOrder.status}
                                    onChange={e => setCurrentOrder({ ...currentOrder, status: e.target.value })}
                                >
                                    <option value="new">New</option>
                                    <option value="approved">Approved</option>
                                    <option value="shipped">Shipped</option>
                                    <option value="delivered">Delivered</option>
                                </select>
                                <select
                                    className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                                    value={currentOrder.paymentStatus}
                                    onChange={e => setCurrentOrder({ ...currentOrder, paymentStatus: e.target.value })}
                                >
                                    <option value="PENDING">Pending</option>
                                    <option value="PAID">Paid</option>
                                    <option value="FAILED">Failed</option>
                                </select>
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 hover:text-gray-800">Cancel</button>
                                <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-500">
                                    Save Order
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
