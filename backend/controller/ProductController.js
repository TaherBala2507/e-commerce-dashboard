// controllers/ProductController.js
const Product = require("../models/Product");
const upload = require("../multer");

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
      await newProduct.save();
      res.json(newProduct);
    } catch (err) {
      res.status(500).json({ message: "Error adding product" });
    }
  }

  async getProducts(req, res) {
    try {
      const products = await Product.find().select('productName price stock description');
      res.json(products);
    } catch (err) {
      res.status(500).json({ message: 'Error fetching products' });
    }
  }
  async deleteAllProducts(req, res) {
    try {
      await Product.deleteMany();
      res.json({ message: "All products deleted" });
    } catch (err) {
      res.status(500).json({ message: "Error deleting products" });
    }
  }
}

module.exports = ProductController;
