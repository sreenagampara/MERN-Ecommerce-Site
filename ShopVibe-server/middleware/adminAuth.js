import jwt from 'jsonwebtoken';
import Admin from '../models/adminModel.js';

export const adminAuth = async (req, res, next) => {
    try {
        const { admin_token } = req.cookies;
        if (!admin_token) {
            return res.status(401).json({ success: false, message: "Unauthorized Login Again" });
        }

        const decoded = jwt.verify(admin_token, process.env.JWT_SECRET);
        req.admin = await Admin.findById(decoded.id).select("-password");

        if (!req.admin) {
            return res.status(401).json({ success: false, message: "Admin not found" });
        }

        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: error.message });
    }
};

// RBAC Middleware
export const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.admin.role)) {
            return res.status(403).json({
                success: false,
                message: `Role (${req.admin.role}) is not allowed to access this resource.`
            });
        }
        next();
    };
};
