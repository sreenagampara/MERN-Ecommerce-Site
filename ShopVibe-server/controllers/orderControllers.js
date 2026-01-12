import Order from "../models/orderModel.js";
import userModel from "../models/userModel.js";


export const placeOrder = async (req, res) => {
  try {
    const userId = req.userId;

    const {
      productId,
      productName,
      image,
      price,
      address,
      paymentMethod,
      paymentStatus,
      razorpayOrderId,
      razorpayPaymentId,
    } = req.body;

    if (!address || !paymentMethod || !price) {
      return res.status(400).json({
        success: false,
        message: "Missing order details",
      });
    }

    // Create order in Order collection
    const order = await Order.create({
      userId,
      productId,
      productName,
      image,
      price,
      address,
      paymentMethod,
      paymentStatus,
      razorpayOrderId: razorpayOrderId || null,
      razorpayPaymentId: razorpayPaymentId || null,
    });

    // Save order reference in user
    await userModel.findByIdAndUpdate(userId, {
      $push: { orders: order._id },
    });

    res.status(200).json({
      success: true,
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    console.error("Place Order Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to place order",
    });
  }
};


export const getMyOrders = async (req, res) => {
  try {
    const userId = req.userId;

    // Fetch orders directly
    const orders = await Order.find({ userId })
      .sort({ createdAt: -1 }); // latest first

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Get Orders Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
    });
  }
};