// routes/category.js
const express = require('express');
const router = express.Router();
const CategoryController = require('../controllers/CategoryController');
const upload = require('../multer');

const categoryUpload = upload.fields([
  { name: 'thumbnail', maxCount: 1 },
]);

router.post('/add', categoryUpload, CategoryController.addCategory);
router.get('/categories', CategoryController.getCategories);
router.delete('/delete/:id', CategoryController.deleteCategory);
router.put('/update/:id', categoryUpload, CategoryController.updateCategory);

module.exports = router;