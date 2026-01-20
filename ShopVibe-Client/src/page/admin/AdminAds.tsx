import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { FiTrash2, FiPlus, FiEdit, FiImage } from "react-icons/fi";

const BackendUrl = import.meta.env.VITE_BACKEND_URL as string;

export default function AdminAds() {
    const [ads, setAds] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editMode, setEditMode] = useState(false); // Creating mode by default
    const [currentAd, setCurrentAd] = useState<any>({
        adsName: "", division: "", section: "1"
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);

    const fetchAds = async () => {
        try {
            const { data } = await axios.get(BackendUrl + "/api/admin/ads", { withCredentials: true });
            if (data.success) setAds(data.ads);
        } catch (error) { toast.error("Failed to fetch ads"); }
    };

    useEffect(() => { fetchAds(); }, []);

    const handleUpload = async () => {
        if (!imageFile) return null;
        try {
            // Get Signature
            const { data: signData } = await axios.get(BackendUrl + "/api/admin/upload-signature?folder=shopvibe_ads", { withCredentials: true });
            if (!signData.success) throw new Error("Failed to get signature");

            const formData = new FormData();
            formData.append("file", imageFile);
            formData.append("api_key", signData.apiKey);
            formData.append("timestamp", signData.timestamp.toString());
            formData.append("signature", signData.signature);
            formData.append("folder", "shopvibe_ads");

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
            console.error("Upload Error:", error);
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
        } else if (!editMode) {
            // If creating new ad, image is required
            toast.error("Image is required");
            setUploading(false);
            return;
        }

        const payload = { ...currentAd, ...uploadData };

        try {
            // Since backend updateAd is not implemented in original scope, let's stick to Create and Delete for now as per requirements, 
            // BUT user asked for Edit. To allow Edit, I need to make sure backend handles it.
            // Wait, I saw createAd and deleteAd in controller, but not updateAd. 
            // I will implement "Create New" fully. For Edit, I'll allow updating properties, but if backend lacks PUT /ads/:id, it won't work.
            // Let's check backend capabilities. The prompt said "createAd" and "deleteAd" were implemented. 
            // I'll stick to mostly Create/Delete, but if I need Edit, I'll need to add it to backend quickly.
            // Requirement said "creating new ads and editing existing ad option not found". So I MUST implement Edit.
            // I'll add the UI for Edit, and if it fails, I'll fix backend.

            if (editMode && currentAd._id) {
                // Assuming I will add this route OR it exists and I missed it. 
                // Actually, looking at previous file view of adminController.js, ONLY getAllAds, createAd, deleteAd were there.
                // So I need to add updateAd to backend too.
                await axios.put(`${BackendUrl}/api/admin/ads/${currentAd._id}`, payload, { withCredentials: true });
                toast.success("Ad Updated");
            } else {
                await axios.post(`${BackendUrl}/api/admin/ads`, payload, { withCredentials: true });
                toast.success("Ad Created");
            }

            setIsModalOpen(false);
            fetchAds();
            setImageFile(null);
            setCurrentAd({ adsName: "", division: "", section: "1" });
        } catch (error) {
            console.error(error);
            toast.error("Operation failed");
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure?")) return;
        try {
            await axios.delete(`${BackendUrl}/api/admin/ads/${id}`, { withCredentials: true });
            toast.success("Ad Deleted");
            fetchAds();
        } catch (error) { toast.error("Delete failed"); }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Ads Management</h1>
                <button
                    onClick={() => { setEditMode(false); setCurrentAd({ adsName: "", division: "", section: "1" }); setIsModalOpen(true); }}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded flex items-center gap-2">
                    <FiPlus /> Create Ad
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {ads.map((ad) => (
                    <div key={ad._id} className="bg-white dark:bg-gray-800 rounded shadow overflow-hidden relative group">
                        <img src={ad.imageUrl} alt="Ad" className="w-full h-48 object-cover" />
                        <div className="p-4">
                            <h3 className="font-bold mb-1 text-gray-800 dark:text-gray-100">{ad.division || "No Division"}</h3>
                            <p className="text-sm text-gray-500">Section: {ad.section}</p>
                            <p className="text-sm text-gray-500">{ad.adsName}</p>
                        </div>
                        <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            {/* Edit Button - Will add backend support next */}
                            <button
                                onClick={() => { setEditMode(true); setCurrentAd(ad); setIsModalOpen(true); }}
                                className="bg-blue-500 text-white p-2 rounded-full"
                            >
                                <FiEdit />
                            </button>
                            <button
                                onClick={() => handleDelete(ad._id)}
                                className="bg-red-500 text-white p-2 rounded-full"
                            >
                                <FiTrash2 />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            {ads.length === 0 && <p className="text-gray-500 text-center py-10">No ads found.</p>}

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">{editMode ? "Edit Ad" : "Create New Ad"}</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input
                                placeholder="Ad Name"
                                className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                                value={currentAd.adsName || ""}
                                onChange={e => setCurrentAd({ ...currentAd, adsName: e.target.value })}
                            />

                            <input
                                placeholder="Division (Title)"
                                className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                                value={currentAd.division || ""}
                                onChange={e => setCurrentAd({ ...currentAd, division: e.target.value })}
                            />

                            <select
                                className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                                value={currentAd.section || "1"}
                                onChange={e => setCurrentAd({ ...currentAd, section: e.target.value })}
                            >
                                <option value="1">Section 1</option>
                                <option value="2">Section 2</option>
                            </select>

                            <div className="border-2 border-dashed p-4 rounded text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700" onClick={() => document.getElementById('adFileInput')?.click()}>
                                <input id="adFileInput" type="file" className="hidden" onChange={e => setImageFile(e.target.files?.[0] || null)} accept="image/*" />
                                {imageFile ? <span className="text-green-500">{imageFile.name}</span> : <div className="text-gray-500"><FiImage className="mx-auto text-2xl mb-1" /> Click to upload image</div>}
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 hover:text-gray-800">Cancel</button>
                                <button type="submit" disabled={uploading} className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-500 disabled:opacity-50">
                                    {uploading ? "Saving..." : "Save Ad"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
