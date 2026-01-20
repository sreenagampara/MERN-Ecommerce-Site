import Admin from '../models/adminModel.js';
import Order from '../models/orderModel.js';
import User from '../models/userModel.js';
import Product from '../models/productModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v2 as cloudinary } from 'cloudinary';
import Ad from '../models/adModel.js';


// Admin Login
export const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        console.log("Admin Login Attempt:", email);
        const admin = await Admin.findOne({ email });
        if (!admin) {
            console.log("Admin not found in DB");
            return res.status(401).json({ success: false, message: "Invalid email or password" });
        }

        console.log("Admin Found:", admin.email);
        console.log("Stored Hash:", admin.password);

        const isMatch = await bcrypt.compare(password, admin.password);
        console.log("Password Match Result:", isMatch);

        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid email or password" });
        }

        const token = jwt.sign(
            { id: admin._id, role: admin.role },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        // Cookie Options (Secure in Prod)
        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        };

        res.cookie("admin_token", token, cookieOptions);

        res.status(200).json({
            success: true,
            message: "Admin Login Successful",
            admin: {
                id: admin._id,
                email: admin.email,
                role: admin.role
            }
        });

    } catch (error) {
        console.error("Admin Login Error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// Admin Logout
export const adminLogout = (req, res) => {
    try {
        res.clearCookie("admin_token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
        });
        res.status(200).json({ success: true, message: "Logged out successfully" });
    } catch (error) {
        console.error("Logout Error:", error);
        res.status(500).json({ success: false, message: "Logout Failed" });
    }
};

// Check Auth Status (for frontend init)
export const checkAdminAuth = async (req, res) => {
    res.json({ success: true, admin: req.admin });
};

// Dashboard Stats
export const getDashboardStats = async (req, res) => {
    try {
        const totalOrders = await Order.countDocuments();
        const totalUsers = await User.countDocuments();
        const totalProducts = await Product.countDocuments();

        // Calculate Total Revenue (Simple aggregation)
        // Assuming Order has 'price' and 'paymentStatus'='PAID'
        const revenueAgg = await Order.aggregate([
            { $match: { paymentStatus: 'PAID' } },
            { $group: { _id: null, total: { $sum: "$price" } } }
        ]);
        const totalRevenue = revenueAgg.length > 0 ? revenueAgg[0].total : 0;

        res.status(200).json({
            success: true,
            stats: {
                totalOrders,
                totalUsers,
                totalProducts,
                totalRevenue
            }
        });
    } catch (error) {
        console.error("Stats Error:", error);
        res.status(500).json({ success: false, message: "Failed to fetch stats" });
    }
};

// Cloudinary Signature
export const getCloudinarySignature = (req, res) => {
    try {
        const folder = req.query.folder || 'shopvibe_products';
        const timestamp = Math.round((new Date).getTime() / 1000);
        const signature = cloudinary.utils.api_sign_request({
            timestamp: timestamp,
            folder: folder
        }, process.env.CLOUDINARY_API_SECRET);


        res.status(200).json({
            success: true,
            signature,
            timestamp,
            cloudName: process.env.CLOUDINARY_CLOUD_NAME,
            apiKey: process.env.CLOUDINARY_API_KEY
        });
    } catch (error) {
        console.error("Cloudinary Sign Error:", error);
        res.status(500).json({ success: false, message: "Signature generation failed" });
    }
};

// ---------------------- PRODUCTS ----------------------
export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find({}).sort({ createdAt: -1 });
        res.json({ success: true, products });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const createProduct = async (req, res) => {
    try {
        const { productName, price, category, subCategory, division, stock, imageKey, bucket, mime } = req.body;

        const newProduct = new Product({
            productName,
            price,
            category,
            subCategory,
            division,
            stock,
            imageKey,
            bucket,
            mime
        });

        await newProduct.save();
        res.status(201).json({ success: true, message: "Product created successfully", product: newProduct });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true });
        res.json({ success: true, message: "Product updated", product: updatedProduct });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: "Product deleted" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ---------------------- ORDERS ----------------------
export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({})
            .sort({ createdAt: -1 });
        // .populate('userId', 'name email'); // Populate if needed, keeping simple matching existing model usage
        res.json({ success: true, orders });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const createOrder = async (req, res) => {
    try {
        const newOrder = new Order(req.body);
        await newOrder.save();
        res.status(201).json({ success: true, message: "Order created", order: newOrder });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateOrder = async (req, res) => {
    try {
        const { id } = req.params;
        // Allow updating any field passed in body
        const updatedOrder = await Order.findByIdAndUpdate(id, req.body, { new: true });
        res.json({ success: true, message: "Order updated", order: updatedOrder });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteOrder = async (req, res) => {
    try {
        await Order.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: "Order deleted" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ---------------------- USERS ----------------------
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).sort({ createdAt: -1 });
        res.json({ success: true, users });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const createUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        // Hash password if provided
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({ ...req.body, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ success: true, message: "User created", user: newUser });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = { ...req.body };

        // If password is being updated, hash it
        if (updateData.password) {
            const salt = await bcrypt.genSalt(10);
            updateData.password = await bcrypt.hash(updateData.password, salt);
        }

        const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true });
        res.json({ success: true, message: "User updated", user: updatedUser });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: "User deleted" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ---------------------- ADS ----------------------
export const getAllAds = async (req, res) => {
    try {
        const ads = await Ad.find({});
        res.json({ success: true, ads });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const createAd = async (req, res) => {
    try {
        const newAd = new Ad(req.body);
        await newAd.save();
        res.status(201).json({ success: true, message: "Ad created", ad: newAd });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateAd = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedAd = await Ad.findByIdAndUpdate(id, req.body, { new: true });
        res.json({ success: true, message: "Ad updated", ad: updatedAd });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteAd = async (req, res) => {
    try {
        await Ad.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: "Ad deleted" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
export const getAllAdmins = async (req, res) => {
    try {
        const admins = await Admin.find({}).select("-password");
        res.json({ success: true, admins });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const createAdmin = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        const exists = await Admin.findOne({ email });
        if (exists) return res.status(400).json({ success: false, message: "Admin already exists" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newAdmin = new Admin({ name, email, password: hashedPassword, role });
        await newAdmin.save();

        res.status(201).json({ success: true, message: "Admin created", admin: { name, email, role, _id: newAdmin._id } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = { ...req.body };

        // If password provided, hash it. If empty, remove from update so we don't overwrite with ""
        if (updateData.password) {
            const salt = await bcrypt.genSalt(10);
            updateData.password = await bcrypt.hash(updateData.password, salt);
        } else {
            delete updateData.password;
        }

        const updatedAdmin = await Admin.findByIdAndUpdate(id, updateData, { new: true }).select("-password");
        res.json({ success: true, message: "Admin updated", admin: updatedAdmin });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteAdmin = async (req, res) => {
    try {
        // Prevent deleting self? Or ensure at least one super admin? 
        // For simplicity: just delete.
        await Admin.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: "Admin deleted" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
