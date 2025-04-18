const express = require("express");
const router = express.Router();
const {
  signup,
  signin,
  getProfile,
  updateProfile,
  toggleFavorite,
  getFavorites,
  removeFavorite,
} = require("../controllers/authController");
const auth = require("../middleware/authMiddleware");

router.post("/signup", signup);
router.post("/signin", signin);
router.get("/me", auth, getProfile);
router.put("/update-profile", auth, updateProfile);

router.put("/favorites/:foodId", auth, toggleFavorite);
router.get("/favorites", auth, getFavorites);
router.delete("/favorites/:foodId", auth, removeFavorite);

module.exports = router;
