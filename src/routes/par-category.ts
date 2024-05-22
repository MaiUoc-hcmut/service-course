const express = require('express');
const router = express.Router();
const parentCategoryController = require('../app/controllers/ParentCategoryController');

router.route('/')
    .get(parentCategoryController.getAllParentCategory)
    .post(parentCategoryController.createParentCategory);

router.route('/:parentId')
    .get(parentCategoryController.getParentCategoryById)
    .put(parentCategoryController.updateParentCategory)
    .delete(parentCategoryController.deleteParentCategory);

module.exports = router;