const express = require('express');
const { getItems, createItem, updateItem, deleteItem } = require('../controllers/customItems');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.route('/')
    .post(protect, authorize('admin'), createItem);

router.route('/:id')
    .put(protect, authorize('admin'), updateItem)
    .delete(protect, authorize('admin'), deleteItem);

router.route('/:tabSlug')
    .get(getItems);

module.exports = router;
