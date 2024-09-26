// controllers/ProductController.js
const Product = require('../models/Product');
const Category = require('../models/Category');
const upload = require('../multer');

class ProductController {
  async addProduct(req, res) {
    try {
      const productData = req.body;
      const newProduct = new Product(productData);
      if (req.files) {
        const gallery = req.files.gallery.map((file) => file.filename);
        const variations = req.files.variations.map((file) => file.filename);
        newProduct.gallery = gallery;
        newProduct.variations = variations.map((variation, index) => ({
          values: productData.variations[index].values,
          price: productData.variations[index].price,
          stockStatus: productData.variations[index].stockStatus,
          image: variation,
          gallery: req.files.variationsGallery[index].map(
            (file) => file.filename
          ),
        }));
      }
      const category = await Category.findById(productData.categoryId);
      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }
      newProduct.categoryId = category._id;
      await newProduct.save();
      res.json(newProduct);
    } catch (err) {
      res.status(500).json({ message: 'Error adding product' });
    }
  }

  async deleteProduct(req, res) {
    try {
      const productId = req.params.id;
      const product = await Product.findById(productId);
      if (product.categoryId) {
        const category = await Category.findById(product.categoryId);
        if (category) {
          category.children = category.children.filter((child) => child.toString() !== product._id.toString());
          await category.save();
        }
      }
      await Product.findByIdAndDelete(productId);
      res.json({ message: "Product deleted successfully" });
    } catch (err) {
      res.status(500).json({ message: "Error deleting product" });
    }
  }
  async deleteAllProducts(req, res) {
    try {
      const products = await Product.find();
      for (const product of products) {
        if (product.categoryId) {
          const category = await Category.findById(product.categoryId);
          if (category) {
            category.children = category.children.filter((child) => child.toString() !== product._id.toString());
            await category.save();
          }
        }
      }
      await Product.deleteMany();
      res.json({ message: "All products deleted" });
    } catch (err) {
      res.status(500).json({ message: "Error deleting products" });
    }
  }
}

module.exports = ProductController;