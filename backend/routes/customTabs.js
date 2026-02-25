const express = require('express');
const { getTabs, createTab, deleteTab, updateTab } = require('../controllers/customTabs');
const { adminAuth } = require('../middleware/auth');

const router = express.Router();

router.route('/')
    .get(getTabs)
    .post(adminAuth, createTab);

router.route('/:id')
    .put(adminAuth, updateTab)
    .delete(adminAuth, deleteTab);

module.exports = router;
