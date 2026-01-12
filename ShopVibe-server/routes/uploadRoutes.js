import express from "express";
import {
  uploadAdImage,
  uploadProductImage,
} from "../controllers/uploadController.js";
import { upload } from "../middleware/multer.js";

const uploadRouter = express.Router();

uploadRouter.post(
  "/upload-product-image",
  upload.single("image"),
  uploadProductImage
);
uploadRouter.post(
  "/upload-ad-image",
  upload.single("image"),
  uploadAdImage
);

export default uploadRouter;
