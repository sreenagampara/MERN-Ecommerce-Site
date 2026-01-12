import Razorpay from 'razorpay';
import crypto from 'crypto';
import dotenv from "dotenv";

dotenv.config();

// Initialize Razorpay
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});




// @desc    Create a new order
export const createOrder = async (req, res) => {
    try {
        
        const { amount } = req.body; // Amount coming from frontend

        if (!amount) {
      return res.status(400).json({
        success: false,
        message: "Amount missing",
      });
    }

        const options = {
            amount: Math.round(Number(amount) * 100), // Convert to paise
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
        };


        const order = await razorpay.orders.create(options);

        res.status(200).json({
            success: true,
            order,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Verify Payment Signature
export const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        const body = razorpay_order_id + "|" + razorpay_payment_id;


        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest("hex");

        const isAuthentic = expectedSignature === razorpay_signature;

        if (isAuthentic) {
            // DATABASE LOGIC HERE: Save order details to your DB
            res.status(200).json({ success: true, message: "Payment Verified" });
        } else {
            res.status(400).json({ success: false, message: "Invalid Signature" });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

