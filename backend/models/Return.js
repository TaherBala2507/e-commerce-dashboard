// models/Return.js
const mongoose = require('../config/database');
const Schema = mongoose.Schema;

const returnSchema = new Schema({
  orderId: { type: Schema.Types.ObjectId, ref: 'Order' },
  reason: String,
  status: String,
  returnDate: Date,
});

const Return = mongoose.model('Return', returnSchema);

module.exports = Return;