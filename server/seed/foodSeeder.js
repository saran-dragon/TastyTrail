const mongoose = require("mongoose");
const dotenv = require("dotenv");
const FoodItem = require("../models/FoodItem");

dotenv.config();
mongoose.connect(process.env.MONGO_URI);

const seedFood = async () => {
  await FoodItem.deleteMany();

  await FoodItem.insertMany([
    {
      name: "Margherita Pizza",
      image: "https://example.com/pizza.jpg",
      price: 9.99,
      category: "Pizza",
      description: "Classic cheese pizza with basil",
    },
    {
      name: "Veg Burger",
      image: "https://example.com/burger.jpg",
      price: 5.99,
      category: "Burger",
      description: "Grilled patty with fresh veggies",
    },
    {
      name: "Paneer Wrap",
      image: "https://example.com/wrap.jpg",
      price: 6.99,
      category: "Wraps",
      description: "Spicy paneer wrapped in paratha",
    },
  ]);

  console.log("Sample food items seeded ✅");
  process.exit();
};

seedFood();
