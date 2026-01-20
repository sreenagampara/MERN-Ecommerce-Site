import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    productName: { type: String, required: true },
    price: { type: Number, required: true },
    imageUrl: {
      type: String,
      required: false,
    },
    imageKey: { type: String },
    bucket: { type: String },
    mime: { type: String },
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

productSchema.pre('save', function (next) {
  console.log('Product pre-save hook triggered');
  console.log('this.imageKey:', this.imageKey);
  console.log('this.bucket:', this.bucket);
  console.log('process.env.CLOUDINARY_CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME);

  if (this.imageKey) {
    const bucket = this.bucket || process.env.CLOUDINARY_CLOUD_NAME;
    if (bucket) {
      this.imageUrl = `https://res.cloudinary.com/${bucket}/image/upload/${this.imageKey}`;
      console.log('Generated imageUrl:', this.imageUrl);
    } else {
      console.log('Bucket not found, imageUrl not generated');
    }
  }
  next();
});

// Also handle updates which AdminJS might use after upload
productSchema.pre('findOneAndUpdate', async function (next) {
  const update = this.getUpdate();
  console.log('Product pre-findOneAndUpdate hook triggered');
  console.log('Update payload:', update);

  // Check if imageKey is being updated (it might be in $set or top level)
  const imageKey = update.imageKey || (update.$set && update.$set.imageKey);
  const bucket = update.bucket || (update.$set && update.$set.bucket) || process.env.CLOUDINARY_CLOUD_NAME;

  if (imageKey) {
    const imageUrl = `https://res.cloudinary.com/${bucket}/image/upload/${imageKey}`;
    if (update.$set) {
      update.$set.imageUrl = imageUrl;
    } else {
      update.imageUrl = imageUrl;
    }
    console.log('Generated imageUrl in update:', imageUrl);
  }
  next();
});

export default mongoose.model("Product", productSchema);
