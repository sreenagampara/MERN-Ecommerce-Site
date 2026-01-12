import mongoose from "mongoose";
import { userInfo } from "node:os";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  verifyOtp: { type: String, default: "" },
  verifyOtpExpiredAt: { type: Number, default: 0 },
  isAccountVerified: { type: Boolean, default: false },
  resetOtp: { type: String, default: "" },
  resetOtpExpiredAt: { type: String, default: 0 },
  cart: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
  orders: [
    {
      
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    },
  ],
});


const userModel = mongoose.model.user || mongoose.model("user", userSchema);

export default userModel;
