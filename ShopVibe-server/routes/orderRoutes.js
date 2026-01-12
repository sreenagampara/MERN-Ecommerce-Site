import express from "express";
import { createOrder, verifyPayment } from "../controllers/paymentControllers.js";
import { getMyOrders, placeOrder } from "../controllers/orderControllers.js";
import userAuth from "../middleware/userAuth.js";

const ordertRouter = express.Router();

ordertRouter.post('/place-order',userAuth, placeOrder)
ordertRouter.get('/get-from-order',userAuth,getMyOrders)

export default ordertRouter;
