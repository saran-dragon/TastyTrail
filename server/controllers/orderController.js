const Order = require("../models/Order");
const User = require("../models/User");

// 🟢 Place an order (user only)
exports.placeOrder = async (req, res) => {
  try {
    const userId = req.user.id; // 🔥 use `id` from decoded token

    const user = await User.findById(userId).populate("cart.item");
    if (!user || user.cart.length === 0) {
      return res.status(400).json({ message: "Cart is empty or user not found." });
    }

    const orderItems = user.cart.map(({ item, quantity }) => ({
      itemId: item._id,
      quantity,
    }));

    const newOrder = new Order({
      userId,
      items: orderItems,
      status: "pending",
    });

    await newOrder.save();

    user.cart = []; // clear cart after order
    await user.save();

    res.status(201).json({ message: "Order placed successfully.", order: newOrder });
  } catch (err) {
    console.error("Order placement error:", err.message);
    res.status(500).json({ message: "Failed to place order. Please try again later." });
  }
};

// 🔒 Get logged-in user's orders
exports.getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    const orders = await Order.find({ userId }).populate("items.item");
    res.status(200).json(orders);
  } catch (err) {
    console.error("Fetch user orders error:", err.message);
    res.status(500).json({ message: "Failed to fetch orders." });
  }
};

// 🔐 Admin-only: Get all orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("items.item")
      .populate("userId", "username");

    res.status(200).json(orders);
  } catch (err) {
    console.error("Fetch all orders error:", err.message);
    res.status(500).json({ message: "Failed to fetch all orders." });
  }
};

// 🔐 Admin-only: Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    order.status = status;
    await order.save();

    res.status(200).json({ message: "Order status updated.", order });
  } catch (err) {
    console.error("Update order status error:", err.message);
    res.status(500).json({ message: "Failed to update order status." });
  }
};
