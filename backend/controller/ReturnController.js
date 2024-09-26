// controllers/ReturnController.js
const Return = require('../models/Return');
const Order = require('../models/Order');

exports.getReturns = async (req, res) => {
  try {
    const returns = await Return.find().populate('orderId');
    res.json(returns);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching returns' });
  }
};

exports.addReturn = async (req, res) => {
  try {
    const orderId = req.body.orderId;
    const order = await Order.findById(orderId);
    if (!order) {
      res.status(404).json({ message: 'Order not found' });
    } else {
      const returnData = {
        orderId: orderId,
        reason: req.body.reason,
        status: 'pending',
        returnDate: new Date(),
      };
      const newReturn = new Return(returnData);
      await newReturn.save();
      res.json(newReturn);
    }
  } catch (err) {
    res.status(500).json({ message: 'Error adding return' });
  }
};

exports.getReturn = async (req, res) => {
  try {
    const returnId = req.params.id;
    const returnData = await Return.findById(returnId).populate('orderId');
    res.json(returnData);
  } catch (err) {
    res.status(404).json({ message: 'Return not found' });
  }
};

exports.updateReturn = async (req, res) => {
  try {
    const returnId = req.params.id;
    const returnData = await Return.findByIdAndUpdate(returnId, req.body, { new: true });
    res.json(returnData);
  } catch (err) {
    res.status(404).json({ message: 'Return not found' });
  }
};

exports.deleteReturn = async (req, res) => {
  try {
    const returnId = req.params.id;
    await Return.findByIdAndRemove(returnId);
    res.json({ message: 'Return deleted' });
  } catch (err) {
    res.status(404).json({ message: 'Return not found' });
  }
};