import cloudinary from "../config/cloudinary.js";


 //PRODUCT IMAGE UPLOAD

export const uploadProductImage = async (req, res) => {
  try {
    // Validate file
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image uploaded",
      });
    }

    // Upload buffer to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "products",
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );

      stream.end(req.file.buffer);
    });

    // Success response
    return res.status(200).json({
      success: true,
      imageUrl: result.secure_url,
      publicId: result.public_id,
    });
  } catch (error) {
    console.error("PRODUCT IMAGE UPLOAD ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Image upload failed",
    });
  }
};


 //AD IMAGE UPLOAD
 
export const uploadAdImage = async (req, res) => {
  try {
    // 1️⃣ Validate file
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image uploaded",
      });
    }

    // Upload buffer to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "ads",
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );

      stream.end(req.file.buffer);
    });

    // Success response
    return res.status(200).json({
      success: true,
      imageUrl: result.secure_url,
      publicId: result.public_id,
    });
  } catch (error) {
    console.error("AD IMAGE UPLOAD ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Image upload failed",
    });
  }
};
