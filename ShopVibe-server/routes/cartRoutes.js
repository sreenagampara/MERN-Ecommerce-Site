import express from "express";
import {
  addToCart,
  getCart,
  removeFromCart,
} from "../controllers/cartControllers.js";
import userAuth from "../middleware/userAuth.js";

const cartRouter = express.Router();

cartRouter.post("/add-to-cart", userAuth, addToCart);
cartRouter.get("/get-from-cart", userAuth, getCart);
cartRouter.delete("/remove-from-cart", userAuth, removeFromCart);

export default cartRouter;
