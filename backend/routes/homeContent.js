const express = require('express');
const router = express.Router();
const { getHomeContent, updateHomeContent } = require('../controllers/homeContent');
const { protect, authorize } = require('../middleware/auth');

router.route('/')
    .get(getHomeContent)
    .put(protect, authorize('admin'), updateHomeContent);

module.exports = router;
