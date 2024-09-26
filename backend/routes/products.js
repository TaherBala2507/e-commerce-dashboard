// routes/product.js
const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/ProductController');
const upload = require('../multer');

const productUpload = upload.fields([
  { name: 'gallery', maxCount: 10 },
  { name: 'variations', maxCount: 10 },
  { name: 'variationsGallery', maxCount: 10 },
]);

router.post('/add', productUpload, ProductController.addProduct);
router.get('/products', ProductController.getProducts);
router.delete('/delete', ProductController.deleteAllProducts);

module.exports = router;