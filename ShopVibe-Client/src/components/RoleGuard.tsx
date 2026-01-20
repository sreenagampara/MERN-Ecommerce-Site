import { Navigate, Outlet } from "react-router-dom";
import { useAdmin } from "../context/AdminContext";

interface RoleGuardProps {
    allowedRoles: string[];
}

export default function RoleGuard({ allowedRoles }: RoleGuardProps) {
    const { adminData, isLoading } = useAdmin();

    if (isLoading) return <div>Loading...</div>;

    if (!adminData || !allowedRoles.includes(adminData.role)) {
        return <Navigate to="/admin/unauthorized" replace />;
    }

    return <Outlet />;
}
