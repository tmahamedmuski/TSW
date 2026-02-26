const express = require('express');
const { getTabs, createTab, deleteTab, updateTab } = require('../controllers/customTabs');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.route('/')
    .get(getTabs)
    .post(protect, authorize('admin'), createTab);

router.route('/:id')
    .put(protect, authorize('admin'), updateTab)
    .delete(protect, authorize('admin'), deleteTab);

module.exports = router;
