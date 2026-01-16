import mongoose from "mongoose";

const adSchema = new mongoose.Schema(
    {
        adsName:String,
        imageUrl: String,
        division:{type:String},
        section:{type:String,enum:["1","2"]}
    },
     { timestamps: true }
);

export default mongoose.model("Ad",adSchema);