import { useNavigate } from "react-router-dom";

export default function Unauthorized() {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <h1 className="text-4xl font-bold text-red-600 mb-4">403</h1>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Unauthorized Access</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
                You do not have permission to view this page.
            </p>
            <button
                onClick={() => navigate('/admin')}
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-500"
            >
                Back to Dashboard
            </button>
        </div>
    );
}
