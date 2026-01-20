import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { FiPlus, FiEdit, FiTrash2 } from "react-icons/fi";

const BackendUrl = import.meta.env.VITE_BACKEND_URL as string;

export default function AdminManagement() {
    const [admins, setAdmins] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentAdmin, setCurrentAdmin] = useState<any>({
        name: "", email: "", password: "", role: "PRODUCT_ADMIN"
    });

    const fetchAdmins = async () => {
        try {
            const { data } = await axios.get(BackendUrl + "/api/admin/admins", { withCredentials: true });
            if (data.success) setAdmins(data.admins);
        } catch (error) { toast.error("Failed to fetch admins"); }
    };

    useEffect(() => { fetchAdmins(); }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editMode && currentAdmin._id) {
                await axios.put(`${BackendUrl}/api/admin/admins/${currentAdmin._id}`, currentAdmin, { withCredentials: true });
                toast.success("Admin Updated");
            } else {
                await axios.post(`${BackendUrl}/api/admin/admins`, currentAdmin, { withCredentials: true });
                toast.success("Admin Created");
            }
            setIsModalOpen(false);
            fetchAdmins();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Operation failed");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure?")) return;
        try {
            await axios.delete(`${BackendUrl}/api/admin/admins/${id}`, { withCredentials: true });
            toast.success("Admin Deleted");
            fetchAdmins();
        } catch (error) { toast.error("Delete failed"); }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Admin Management</h1>
                <button
                    onClick={() => { setEditMode(false); setCurrentAdmin({ name: "", email: "", password: "", role: "PRODUCT_ADMIN" }); setIsModalOpen(true); }}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded flex items-center gap-2"
                >
                    <FiPlus /> Create Admin
                </button>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-x-auto">
                <table className="w-full text-left whitespace-nowrap">
                    <thead className="bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-200">
                        <tr>
                            <th className="p-4">Name</th>
                            <th className="p-4">Email</th>
                            <th className="p-4">Role</th>
                            <th className="p-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {admins.map((admin) => (
                            <tr key={admin._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                <td className="p-4 font-medium text-gray-900 dark:text-white">{admin.name}</td>
                                <td className="p-4 text-gray-500">{admin.email}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded text-xs font-bold 
                                        ${admin.role === 'SUPER_ADMIN' ? 'bg-purple-100 text-purple-800' :
                                            admin.role === 'PRODUCT_ADMIN' ? 'bg-blue-100 text-blue-800' :
                                                admin.role === 'ORDER_ADMIN' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                        {admin.role}
                                    </span>
                                </td>
                                <td className="p-4 flex gap-3">
                                    <button onClick={() => { setEditMode(true); setCurrentAdmin({ ...admin, password: "" }); setIsModalOpen(true); }} className="text-blue-500 hover:text-blue-400">
                                        <FiEdit />
                                    </button>
                                    <button onClick={() => handleDelete(admin._id)} className="text-red-500 hover:text-red-400">
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
                        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">{editMode ? "Edit Admin" : "Create Admin"}</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input
                                placeholder="Name"
                                className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                                value={currentAdmin.name}
                                onChange={e => setCurrentAdmin({ ...currentAdmin, name: e.target.value })}
                                required
                            />
                            <input
                                placeholder="Email"
                                type="email"
                                className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                                value={currentAdmin.email}
                                onChange={e => setCurrentAdmin({ ...currentAdmin, email: e.target.value })}
                                required
                            />
                            <input
                                placeholder={editMode ? "New Password (leave blank to keep)" : "Password"}
                                type="password"
                                className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                                value={currentAdmin.password}
                                onChange={e => setCurrentAdmin({ ...currentAdmin, password: e.target.value })}
                                required={!editMode}
                            />

                            <select
                                className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                                value={currentAdmin.role}
                                onChange={e => setCurrentAdmin({ ...currentAdmin, role: e.target.value })}
                            >
                                <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                                <option value="PRODUCT_ADMIN">PRODUCT_ADMIN</option>
                                <option value="ORDER_ADMIN">ORDER_ADMIN</option>
                                <option value="SUPPORT_ADMIN">SUPPORT_ADMIN</option>
                            </select>

                            <div className="flex justify-end gap-3 pt-4">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 hover:text-gray-800">Cancel</button>
                                <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-500">
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
