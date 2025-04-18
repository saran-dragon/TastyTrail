const mongoose = require("mongoose");

const foodItemSchema = new mongoose.Schema({
  name: String,
  price: Number,
  discount: Number,
  finalPrice: Number,
  description: String,
  category: String,
  image: {
    data: Buffer, // ✅ FIXED: Should be Buffer, not String
    contentType: String,
  },
});

module.exports = mongoose.model("FoodItem", foodItemSchema);
