const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

const {
  placeOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
} = require("../controllers/orderController");

// 🛒 User routes
router.post("/place", auth, placeOrder);
router.get("/my-orders", auth, getUserOrders);

// 🔐 Admin routes
router.get("/all", auth, admin, getAllOrders);
router.put("/status/:id", auth, admin, updateOrderStatus);

module.exports = router;
