import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    productName: { type: String, required: true },
    price: { type: Number, required: true },
    imageUrl: {
      type: String,
      required: false,
    },
    category: { type: String },
    subCategory: { type: String },
    division: {
      type: String,
      required: true,
      enum: [
        "gadgets",
        "Fashion",
        "Books",
        "TV and Appliances",
        "Home and Kitchen",
        "Beauty and Toy",
        "Furniture",
      ],
    },
    stock: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
