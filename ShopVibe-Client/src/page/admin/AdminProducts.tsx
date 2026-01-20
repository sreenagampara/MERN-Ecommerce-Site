import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { FiEdit, FiTrash2, FiPlus, FiImage } from "react-icons/fi";

const BackendUrl = import.meta.env.VITE_BACKEND_URL as string;

export default function AdminProducts() {
    const [products, setProducts] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentProduct, setCurrentProduct] = useState<any>({
        productName: "", price: "", category: "", subCategory: "", division: "gadgets", stock: 0
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);

    const fetchProducts = async () => {
        try {
            const { data } = await axios.get(BackendUrl + "/api/admin/products", { withCredentials: true });
            if (data.success) setProducts(data.products);
        } catch (error) { toast.error("Failed to fetch products"); }
    };

    useEffect(() => { fetchProducts(); }, []);

    const handleUpload = async () => {
        if (!imageFile) return null;
        try {
            // Get Signature
            const { data: signData } = await axios.get(BackendUrl + "/api/admin/upload-signature", { withCredentials: true });
            if (!signData.success) throw new Error("Failed to get signature");

            const formData = new FormData();
            formData.append("file", imageFile);
            formData.append("api_key", signData.apiKey);
            formData.append("timestamp", signData.timestamp.toString());
            formData.append("signature", signData.signature);
            formData.append("folder", "shopvibe_products");

            const uploadRes = await axios.post(
                `https://api.cloudinary.com/v1_1/${signData.cloudName}/image/upload`,
                formData,
                { withCredentials: false }
            );
            return {
                imageKey: uploadRes.data.public_id,
                bucket: signData.cloudName,
                mime: uploadRes.data.format
            };
        } catch (error) {
            toast.error("Image upload failed");
            return null;
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setUploading(true);

        let uploadData = {};
        if (imageFile) {
            const uploaded = await handleUpload();
            if (!uploaded) {
                setUploading(false);
                return;
            }
            uploadData = { ...uploaded };
        }

        const payload = { ...currentProduct, ...uploadData };

        try {
            if (editMode) {
                await axios.put(`${BackendUrl}/api/admin/products/${currentProduct._id}`, payload, { withCredentials: true });
                toast.success("Product Updated");
            } else {
                await axios.post(`${BackendUrl}/api/admin/products`, payload, { withCredentials: true });
                toast.success("Product Created");
            }
            setIsModalOpen(false);
            fetchProducts();
        } catch (error) {
            toast.error("Operation failed");
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure?")) return;
        try {
            await axios.delete(`${BackendUrl}/api/admin/products/${id}`, { withCredentials: true });
            toast.success("Product Deleted");
            fetchProducts();
        } catch (error) { toast.error("Delete failed"); }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Products</h1>
                <button
                    onClick={() => { setEditMode(false); setCurrentProduct({ productName: "", price: "", category: "", subCategory: "", division: "gadgets", stock: 0 }); setIsModalOpen(true); }}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >
                    <FiPlus /> Add Product
                </button>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-200">
                        <tr>
                            <th className="p-4">Image</th>
                            <th className="p-4">Name</th>
                            <th className="p-4">Price</th>
                            <th className="p-4">Stock</th>
                            <th className="p-4">Category</th>
                            <th className="p-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {products.map((p) => (
                            <tr key={p._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                <td className="p-4">
                                    <img src={p.imageUrl} alt={p.productName} className="w-12 h-12 rounded object-cover" />
                                </td>
                                <td className="p-4 font-medium text-gray-900 dark:text-white">{p.productName}</td>
                                <td className="p-4 text-green-600 font-bold">₹{p.price}</td>
                                <td className="p-4 text-gray-600 dark:text-gray-300">{p.stock}</td>
                                <td className="p-4 text-gray-500">{p.category}</td>
                                <td className="p-4 flex gap-3">
                                    <button onClick={() => { setEditMode(true); setCurrentProduct(p); setIsModalOpen(true); }} className="text-blue-500 hover:text-blue-400">
                                        <FiEdit />
                                    </button>
                                    <button onClick={() => handleDelete(p._id)} className="text-red-500 hover:text-red-400">
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
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">{editMode ? "Edit Product" : "New Product"}</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <input placeholder="Product Name" className="p-2 border rounded dark:bg-gray-700 dark:text-white" value={currentProduct.productName} onChange={e => setCurrentProduct({ ...currentProduct, productName: e.target.value })} required />
                                <input placeholder="Price" type="number" className="p-2 border rounded dark:bg-gray-700 dark:text-white" value={currentProduct.price} onChange={e => setCurrentProduct({ ...currentProduct, price: e.target.value })} required />
                                <input placeholder="Category" className="p-2 border rounded dark:bg-gray-700 dark:text-white" value={currentProduct.category} onChange={e => setCurrentProduct({ ...currentProduct, category: e.target.value })} />
                                <input placeholder="Sub Category" className="p-2 border rounded dark:bg-gray-700 dark:text-white" value={currentProduct.subCategory} onChange={e => setCurrentProduct({ ...currentProduct, subCategory: e.target.value })} />
                                <select className="p-2 border rounded dark:bg-gray-700 dark:text-white" value={currentProduct.division} onChange={e => setCurrentProduct({ ...currentProduct, division: e.target.value })}>
                                    <option value="gadgets">Gadgets</option>
                                    <option value="Fashion">Fashion</option>
                                    <option value="Books">Books</option>
                                    <option value="TV and Appliances">TV and Appliances</option>
                                    <option value="Home and Kitchen">Home and Kitchen</option>
                                    <option value="Beauty and Toy">Beauty and Toy</option>
                                    <option value="Furniture">Furniture</option>
                                </select>
                                <input placeholder="Stock" type="number" className="p-2 border rounded dark:bg-gray-700 dark:text-white" value={currentProduct.stock} onChange={e => setCurrentProduct({ ...currentProduct, stock: e.target.value })} />
                            </div>

                            <div className="border-2 border-dashed p-4 rounded text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700" onClick={() => document.getElementById('fileInput')?.click()}>
                                <input id="fileInput" type="file" className="hidden" onChange={e => setImageFile(e.target.files?.[0] || null)} accept="image/*" />
                                {imageFile ? <span className="text-green-500">{imageFile.name}</span> : <div className="text-gray-500"><FiImage className="mx-auto text-2xl mb-1" /> Click to upload image</div>}
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 hover:text-gray-800">Cancel</button>
                                <button type="submit" disabled={uploading} className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-500 disabled:opacity-50">
                                    {uploading ? "Saving..." : "Save Product"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
