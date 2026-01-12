import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["SUPER_ADMIN", "ORDER_ADMIN", "PRODUCT_ADMIN", "SUPPORT_ADMIN"],
      default: "SUPPORT_ADMIN",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Admin", adminSchema);
