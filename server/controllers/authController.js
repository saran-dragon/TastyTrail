const User = require("../models/User");
const FoodItem = require("../models/FoodItem");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Helper to format favorites with base64 images
const formatFavoritesWithBase64 = (favorites) =>
  favorites.map((food) => ({
    ...food.toObject(),
    image: food.image?.data
      ? {
          contentType: food.image.contentType,
          data: food.image.data.toString("base64"),
        }
      : null,
  }));

// ✅ Signup
const signup = async (req, res) => {
  const { username, email, password, address } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ msg: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      address,
    });

    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.status(201).json({
      token,
      user: {
        id: newUser._id,
        username,
        email,
        address,
        role: newUser.role,
      },
    });
  } catch (err) {
    res.status(500).json({ msg: "Signup failed", error: err.message });
  }
};

// ✅ Signin (User & Admin)
const signin = async (req, res) => {
  const { email, password } = req.body;

  if (
    email === process.env.ADMIN_EMAIL &&
    password === process.env.ADMIN_PASSWORD
  ) {
    const token = jwt.sign(
      { id: "admin_id", role: "admin", email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.json({
      msg: "Admin login successful",
      token,
      user: {
        id: "admin_id",
        email,
        username: "Admin",
        role: "admin",
      },
    });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      msg: "Login successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

// ✅ Get Profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("favorites");
    if (!user) return res.status(404).json({ msg: "User not found" });

    res.json({
      id: user._id,
      username: user.username,
      email: user.email,
      address: user.address,
      role: user.role,
      favorites: formatFavoritesWithBase64(user.favorites),
    });
  } catch (err) {
    res
      .status(500)
      .json({ msg: "Failed to fetch profile", error: err.message });
  }
};

// ✅ Update Profile
const updateProfile = async (req, res) => {
  try {
    const { username, address } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { username, address },
      { new: true }
    );

    if (!user) return res.status(404).json({ msg: "User not found" });

    res.json({
      msg: "Profile updated",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        address: user.address,
      },
    });
  } catch (err) {
    res
      .status(500)
      .json({ msg: "Failed to update profile", error: err.message });
  }
};

// ✅ Toggle Favorite (Add/Remove)
const toggleFavorite = async (req, res) => {
  const foodId = req.params.foodId;

  if (!foodId) return res.status(400).json({ msg: "Food ID is required" });

  try {
    const foodItem = await FoodItem.findById(foodId);
    if (!foodItem) return res.status(404).json({ msg: "Food item not found" });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    const isFav = user.favorites.some((favId) => favId.toString() === foodId);

    if (isFav) {
      user.favorites = user.favorites.filter(
        (favId) => favId.toString() !== foodId
      );
    } else {
      user.favorites.push(foodId);
    }

    await user.save();

    const updatedUser = await User.findById(req.user.id).populate("favorites");

    res.json({
      msg: "Favorites updated",
      favorites: formatFavoritesWithBase64(updatedUser.favorites),
    });
  } catch (err) {
    res
      .status(500)
      .json({ msg: "Failed to toggle favorite", error: err.message });
  }
};

// ✅ Get All Favorites
const getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("favorites");
    if (!user) return res.status(404).json({ msg: "User not found" });

    res.json(formatFavoritesWithBase64(user.favorites));
  } catch (err) {
    res
      .status(500)
      .json({ msg: "Failed to fetch favorites", error: err.message });
  }
};

// ✅ Remove from Favorites
const removeFavorite = async (req, res) => {
  const foodId = req.params.foodId;

  if (!foodId) return res.status(400).json({ msg: "Food ID is required" });

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    user.favorites = user.favorites.filter(
      (favId) => favId.toString() !== foodId
    );
    await user.save();

    const updatedUser = await User.findById(req.user.id).populate("favorites");

    res.json({
      msg: "Favorite removed",
      favorites: formatFavoritesWithBase64(updatedUser.favorites),
    });
  } catch (err) {
    res
      .status(500)
      .json({ msg: "Failed to remove favorite", error: err.message });
  }
};

module.exports = {
  signup,
  signin,
  getProfile,
  updateProfile,
  toggleFavorite,
  getFavorites,
  removeFavorite,
};
