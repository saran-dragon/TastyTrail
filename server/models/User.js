const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  address: String, // ⬅️ New field
  role: { type: String, default: "user" },
  cart: [
    {
      itemId: { type: mongoose.Schema.Types.ObjectId, ref: "FoodItem" },
      quantity: Number,
    },
  ],
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'FoodItem' }],

});

module.exports = mongoose.model("User", UserSchema);
