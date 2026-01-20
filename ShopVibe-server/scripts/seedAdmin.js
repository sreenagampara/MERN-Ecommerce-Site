import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import Admin from "../models/adminModel.js";



export const seedAdmin = async () => {
    try {
        const email = "superadmin@shopvibe.com";
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            console.log("Super Admin already exists");
            return;
        }

        const hashedPassword = await bcrypt.hash("SuperAdmin@123", 10);
        const newAdmin = new Admin({
            name: "Super Admin",
            email: email,
            password: hashedPassword,
            role: "SUPER_ADMIN"
        });

        await newAdmin.save();
        console.log("Super Admin Created Successfully");
        console.log("Email:", email);
    } catch (error) {
        console.error("Error seeding admin:", error);
    }
};


