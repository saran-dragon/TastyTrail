const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { addToCart, removeFromCart, clearCart } = require("../controllers/cartController");

router.post("/add", auth, addToCart);
router.post("/remove", auth, removeFromCart);
router.post("/clear", auth, clearCart);

module.exports = router;
