import express from "express";
import { searchProducts } from "../controllers/productControllers.js";

const producRouter = express.Router();

producRouter.get("/search-product", searchProducts);


export default producRouter;
