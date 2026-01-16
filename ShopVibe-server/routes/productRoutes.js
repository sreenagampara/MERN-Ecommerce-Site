import express from "express";
import { fetchProduct, searchProducts } from "../controllers/productControllers.js";

const producRouter = express.Router();

producRouter.get("/search-product", searchProducts);
producRouter.get("/fetch-product", fetchProduct)


export default producRouter;
