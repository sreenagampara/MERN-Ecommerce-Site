import userModel from "../models/userModel.js";

export const addToCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.userId;

    if (!productId) {
      return res.json({ success: false, message: "Product ID required" });
    }

    const result = await userModel.updateOne(
    {_id:userId},
    {$addToSet:{cart:productId}},
    {new:true}
  );

  if (result.modifiedCount === 0) {
  return res.json({
    success: false,
    message: "Product already in cart"
  });
}


    return res.json({ success: true, message: "Product added to cart" });

  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};


export const getCart = async (req, res) => {
  try {
    const user = await userModel
      .findById(req.userId)
      .populate("cart");

    return res.json({
      success: true,
      cart: user.cart
    });

  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const removeFromCart = async (req, res) => {
  const { productId } = req.body;

  await userModel.findByIdAndUpdate(req.userId, {
    $pull: { cart: productId }
  });

  return res.json({ success: true, message: "Removed from cart" });
};
 