const mongoose = require('../config/database');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  customer: String,
  total: String,
  status: String,
  products: [{ type: Schema.Types.ObjectId, ref: 'Product' }]
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;