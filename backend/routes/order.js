const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/OrderController');

router.get('/', OrderController.getOrders);
router.post('/', OrderController.addOrder);
router.get('/order/:id', OrderController.getOrder);
router.put('/order/:id', OrderController.updateOrder);
router.delete('/delete/:id', OrderController.deleteOrder);

module.exports = router;