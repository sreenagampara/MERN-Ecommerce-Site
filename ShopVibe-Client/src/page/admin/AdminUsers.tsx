import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { FiPlus, FiEdit, FiTrash2 } from "react-icons/fi";

const BackendUrl = import.meta.env.VITE_BACKEND_URL as string;

export default function AdminUsers() {
    const [users, setUsers] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentUser, setCurrentUser] = useState<any>({
        name: "", email: "", password: "", isAccountVerified: false
    });

    const fetchUsers = async () => {
        try {
            const { data } = await axios.get(BackendUrl + "/api/admin/users", { withCredentials: true });
            if (data.success) setUsers(data.users);
        } catch (error) { toast.error("Failed to fetch users"); }
    };

    useEffect(() => { fetchUsers(); }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editMode && currentUser._id) {
                await axios.put(`${BackendUrl}/api/admin/users/${currentUser._id}`, currentUser, { withCredentials: true });
                toast.success("User Updated");
            } else {
                await axios.post(`${BackendUrl}/api/admin/users`, currentUser, { withCredentials: true });
                toast.success("User Created");
            }
            setIsModalOpen(false);
            fetchUsers();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Operation failed");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure? This will delete the user permanently.")) return;
        try {
            await axios.delete(`${BackendUrl}/api/admin/users/${id}`, { withCredentials: true });
            toast.success("User Deleted");
            fetchUsers();
        } catch (error) { toast.error("Delete failed"); }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Users</h1>
                <button
                    onClick={() => { setEditMode(false); setCurrentUser({ name: "", email: "", password: "", isAccountVerified: true }); setIsModalOpen(true); }}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded flex items-center gap-2"
                >
                    <FiPlus /> Create User
                </button>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-200">
                        <tr>
                            <th className="p-4">Name</th>
                            <th className="p-4">Email</th>
                            <th className="p-4">Verified</th>
                            <th className="p-4">Joined</th>
                            <th className="p-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {users.map((user) => (
                            <tr key={user._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                <td className="p-4 font-medium text-gray-900 dark:text-white">{user.name}</td>
                                <td className="p-4 text-gray-500">{user.email}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded text-xs ${user.isAccountVerified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {user.isAccountVerified ? "Yes" : "No"}
                                    </span>
                                </td>
                                <td className="p-4 text-gray-500">{new Date(user.createdAt || Date.now()).toLocaleDateString()}</td>
                                <td className="p-4 flex gap-3">
                                    <button onClick={() => { setEditMode(true); setCurrentUser({ ...user, password: "" }); setIsModalOpen(true); }} className="text-blue-500 hover:text-blue-400">
                                        <FiEdit />
                                    </button>
                                    <button onClick={() => handleDelete(user._id)} className="text-red-500 hover:text-red-400">
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
                        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">{editMode ? "Edit User" : "Create New User"}</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input
                                placeholder="Full Name"
                                className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                                value={currentUser.name}
                                onChange={e => setCurrentUser({ ...currentUser, name: e.target.value })}
                                required
                            />
                            <input
                                placeholder="Email"
                                type="email"
                                className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                                value={currentUser.email}
                                onChange={e => setCurrentUser({ ...currentUser, email: e.target.value })}
                                required
                            />

                            <div className="space-y-1">
                                <input
                                    placeholder={editMode ? "New Password (leave blank to keep)" : "Password"}
                                    type="password"
                                    className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                                    value={currentUser.password}
                                    onChange={e => setCurrentUser({ ...currentUser, password: e.target.value })}
                                    required={!editMode}
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                <label className="text-gray-700 dark:text-gray-200">Account Verified:</label>
                                <input
                                    type="checkbox"
                                    checked={currentUser.isAccountVerified}
                                    onChange={e => setCurrentUser({ ...currentUser, isAccountVerified: e.target.checked })}
                                    className="w-5 h-5 accent-blue-600"
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 hover:text-gray-800">Cancel</button>
                                <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-500">
                                    Save User
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
