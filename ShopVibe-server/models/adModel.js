import mongoose, { model } from "mongoose";
import { type } from "os";

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