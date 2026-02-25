const express = require('express');
const { getItems, createItem, updateItem, deleteItem } = require('../controllers/customItems');
const { adminAuth } = require('../middleware/auth');

const router = express.Router();

router.route('/')
    .post(adminAuth, createItem);

router.route('/:id')
    .put(adminAuth, updateItem)
    .delete(adminAuth, deleteItem);

router.route('/:tabSlug')
    .get(getItems);

module.exports = router;
