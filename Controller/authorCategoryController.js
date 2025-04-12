const Category=require("../Model/categoryModel")


const addCategory = async (req, res) => {
    console.log("Reached at addCategory");
    try {
      const { name } = req.body;
  
      // Check if name is provided
      if (!name) {
        return res.status(400).json({ message: "Category name is required" });
      }
  
      // Check for duplicate category
      const existingCategory = await Category.findOne({ name: name.trim() });
      if (existingCategory) {
        return res.status(409).json({ message: "Category already exists" });
      }
  
      // Create and save category
      const newCategory = new Category({ name: name.trim() });
      await newCategory.save();
  
      res.status(201).json({ message: "Category created successfully", category: newCategory });
    } catch (err) {
      res.status(500).json({ message: "Server error", error: err.message });
    }
  }
  const getCategories = async (req, res) => {
    try {
      const categories = await Category.find();
      res.status(200).json({ categories });
    } catch (err) {
      res.status(500).json({ message: "Error fetching categories", error: err.message });
    }
  };

  module.exports = { addCategory, getCategories};
