import Ad from "../models/adModel.js"

export const fetchAd = async (req,res)=>{
     try {
        const ads = await Ad.find();
        res.status(200).json(ads);
      } catch (err) {
        console.error("error fetching this ads", err);
        res.status(500).json({ message: "error fetching ads" });
      }
}