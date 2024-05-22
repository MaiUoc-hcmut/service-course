const express = require('express');
const router = express.Router();
const CategoryController = require('../app/controllers/CategoryController');

router.route('/')
    .get(CategoryController.getAllCategory)
    .post(CategoryController.createCategory);

router.route('/:categoryId')
    .get(CategoryController.getCategoryById)
    .put(CategoryController.updateCategory)
    .delete(CategoryController.deleteCategory);

router.route('/parent/:parentId')
    .get(CategoryController.getCategoryGroupByParent);

module.exports = router;