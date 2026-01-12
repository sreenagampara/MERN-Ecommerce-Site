import express from "express";
import { createOrder, verifyPayment } from "../controllers/paymentControllers.js";
import userAuth from "../middleware/userAuth.js";

const paymentRouter = express.Router();

paymentRouter.post("/create-order", userAuth, createOrder);
paymentRouter.post("/verify-payment", userAuth, verifyPayment);

export default paymentRouter;
