// routes/return.js
const express = require('express');
const router = express.Router();
const ReturnController = require('../controllers/ReturnController');

router.get('/', ReturnController.getReturns);
router.post('/', ReturnController.addReturn);
router.get('/:id', ReturnController.getReturn);
router.put('/:id', ReturnController.updateReturn);
router.delete('/:id', ReturnController.deleteReturn);

module.exports = router;