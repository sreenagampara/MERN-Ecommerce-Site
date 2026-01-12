import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },

    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    productName: String,
    image: String,
    price: Number,

    address: String,

    paymentMethod: {
      type: String,
      enum: ["COD", "ONLINE"],
    },
    paymentStatus: {
      type: String,
      enum: ["PENDING", "PAID", "FAILED"],
    },

    status: {
      type: String,
      enum: ["new", "approved", "shipped", "delivered"],
      default: "new",
    },

    razorpayOrderId: String,
    razorpayPaymentId: String,
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
