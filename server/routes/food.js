const express = require("express");
const router = express.Router();
const multer = require("multer");

// Memory storage for MongoDB (image buffer)
const storage = multer.memoryStorage();
const upload = multer({ storage });

const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

const {
  getAllFoods,
  addFood,
  updateFood,
  deleteFood,
} = require("../controllers/foodController");

// 🟢 Public route - anyone can view food items
router.get("/", getAllFoods);

// 🔒 Admin routes - requires login + admin role
router.post("/add", auth, admin, upload.single("image"), addFood);
router.put("/update/:id", auth, admin, upload.single("image"), updateFood);
router.delete("/delete/:id", auth, admin, deleteFood);

module.exports = router;
