import mongoose, { model } from "mongoose";


const adSchema = new mongoose.Schema(
    {
        adsName: String,
        imageUrl: String,
        imageKey: String,
        bucket: String,
        mime: String,
        division: { type: String },
        section: { type: String, enum: ["1", "2"] }
    },
    { timestamps: true }
);

adSchema.pre('save', function (next) {
    if (this.imageKey) {
        const bucket = this.bucket || process.env.CLOUDINARY_CLOUD_NAME;
        if (bucket) {
            this.imageUrl = `https://res.cloudinary.com/${bucket}/image/upload/${this.imageKey}`;
        }
    }
    next();
});

adSchema.pre('findOneAndUpdate', async function (next) {
    const update = this.getUpdate();
    const imageKey = update.imageKey || (update.$set && update.$set.imageKey);
    const bucket = update.bucket || (update.$set && update.$set.bucket) || process.env.CLOUDINARY_CLOUD_NAME;

    if (imageKey) {
        const imageUrl = `https://res.cloudinary.com/${bucket}/image/upload/${imageKey}`;
        if (update.$set) {
            update.$set.imageUrl = imageUrl;
        } else {
            update.imageUrl = imageUrl;
        }
    }
    next();
});

export default mongoose.model("Ad", adSchema);