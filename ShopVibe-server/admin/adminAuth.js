import bcrypt from "bcryptjs";
import Admin from "../models/adminModel.js";

export const authenticate = async (email, password) => {
  const admin = await Admin.findOne({ email });
  
  if (!admin) return null;

  const isMatch = bcrypt.compareSync(password, admin.password);
  
  if (!isMatch) return null;

 
  return {
    email: admin.email,
    role: admin.role,
  };
};