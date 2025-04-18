const User = require("../models/User");

exports.addToCart = async (req, res) => {
  try {
    const { itemId, quantity } = req.body;
    const user = await User.findById(req.user.id);

    const existingItem = user.cart.find(
      (item) => item.itemId.toString() === itemId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      user.cart.push({ itemId, quantity });
    }

    await user.save();
    res.json({ msg: "Item added to cart", cart: user.cart });
  } catch (err) {
    res.status(500).json({ msg: "Error adding to cart" });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const { itemId } = req.body;
    const user = await User.findById(req.user.id);

    user.cart = user.cart.filter(
      (item) => item.itemId.toString() !== itemId
    );

    await user.save();
    res.json({ msg: "Item removed", cart: user.cart });
  } catch (err) {
    res.status(500).json({ msg: "Error removing from cart" });
  }
};

exports.clearCart = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.cart = [];
    await user.save();
    res.json({ msg: "Cart cleared" });
  } catch (err) {
    res.status(500).json({ msg: "Error clearing cart" });
  }
};
