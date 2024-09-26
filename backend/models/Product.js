// models/Product.js
const mongoose = require('../config/database');
const Schema = mongoose.Schema;

const productSchema = new Schema({
  productName: String,
  categoryId: { type: Schema.Types.ObjectId, ref: 'Category' },
  parentCategory: String,
  childCategory: String,
  description: String,
  gallery: [{ type: String }],
  hasVariations: Boolean,
  attributes: [{ name: String, values: [String] }],
  variations: [
    {
      values: [String],
      price: String,
      stockStatus: String,
      image: String,
      gallery: [{ type: String }],
    },
  ],
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;