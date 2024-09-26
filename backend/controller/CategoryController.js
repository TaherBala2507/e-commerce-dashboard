// controllers/CategoryController.js
const Category = require('../models/Category');

class CategoryController {
  async addCategory(req, res) {
    try {
      const categoryData = req.body;
      const newCategory = new Category(categoryData);
      await newCategory.save();
      res.json(newCategory);
    } catch (err) {
      res.status(500).json({ message: 'Error adding category' });
    }
  }

  async getCategories(req, res) {
    try {
      const categories = await Category.find().populate('children');
      res.json(categories);
    } catch (err) {
      res.status(500).json({ message: 'Error fetching categories' });
    }
  }

  async deleteCategory(req, res) {
    try {
      const categoryId = req.params.id;
      await Category.findByIdAndDelete(categoryId);
      res.json({ message: 'Category deleted successfully' });
    } catch (err) {
      res.status(500).json({ message: 'Error deleting category' });
    }
  }

  async updateCategory(req, res) {
    try {
      const categoryId = req.params.id;
      const categoryData = req.body;
      await Category.findByIdAndUpdate(categoryId, categoryData, { new: true });
      res.json({ message: 'Category updated successfully' });
    } catch (err) {
      res.status(500).json({ message: 'Error updating category' });
    }
  }
}

module.exports = CategoryController;