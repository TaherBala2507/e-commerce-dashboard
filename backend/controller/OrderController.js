const Order = require('../models/Order');
const Product = require('../models/Product');

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('products');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching orders' });
  }
};

exports.addOrder = async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Error adding order' });
  }
};

exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('products');
    res.json(order);
  } catch (err) {
    res.status(404).json({ message: 'Order not found' });
  }
};

exports.updateOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(order);
  } catch (err) {
    res.status(404).json({ message: 'Order not found' });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    await Order.findByIdAndRemove(req.params.id);
    res.json({ message: 'Order deleted' });
  } catch (err) {
    res.status(404).json({ message: 'Order not found' });
  }
};