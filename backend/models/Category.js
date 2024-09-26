// models/Category.js
const mongoose = require('../config/database');
const Schema = mongoose.Schema;

const categorySchema = new Schema({
  name: String,
  thumbnail: String,
  children: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;