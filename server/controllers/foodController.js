const FoodItem = require("../models/FoodItem");

// Get all food items
exports.getAllFoods = async (req, res) => {
  try {
    const foodItems = await FoodItem.find();

    // Convert image buffers to base64 for frontend
    const formattedItems = foodItems.map((item) => ({
      ...item.toObject(),
      image: item.image?.data
        ? `data:${item.image.contentType};base64,${item.image.data.toString("base64")}`
        : null,
    }));

    res.json(formattedItems);
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch food items" });
  }
};

// Add a new food item
exports.addFood = async (req, res) => {
  try {
    const { name, price, description, category, discount, finalPrice } = req.body;
    if (!name || !price || !description || !category || !req.file) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    const image = {
      data: req.file.buffer,
      contentType: req.file.mimetype,
    };

    const newFood = new FoodItem({
      name,
      price,
      description,
      category,
      discount,
      finalPrice,
      image,
    });

    await newFood.save();
    res.status(201).json({ msg: "Food item added", food: newFood });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ msg: "Failed to add food item" });
  }
};

// Update food item
exports.updateFood = async (req, res) => {
  try {
    const food = await FoodItem.findById(req.params.id);
    if (!food) return res.status(404).json({ msg: "Food item not found" });

    food.name = req.body.name || food.name;
    food.price = req.body.price || food.price;
    food.description = req.body.description || food.description;
    food.category = req.body.category || food.category;
    food.discount = req.body.discount || food.discount;
    food.finalPrice = req.body.finalPrice || food.finalPrice;

    if (req.file) {
      food.image = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      };
    }

    await food.save();
    res.json({ msg: "Food item updated", food });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ msg: "Failed to update food item" });
  }
};

// Delete food item
exports.deleteFood = async (req, res) => {
  try {
    const food = await FoodItem.findById(req.params.id);
    if (!food) return res.status(404).json({ msg: "Food item not found" });

    await FoodItem.findByIdAndDelete(req.params.id);
    res.json({ msg: "Food item deleted" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ msg: "Failed to delete food item" });
  }
};
