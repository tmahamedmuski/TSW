const express = require('express');
const { getStats, createStat, updateStat, deleteStat } = require('../controllers/stats');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.route('/')
    .get(getStats)
    .post(protect, authorize('admin'), createStat);

router.route('/:id')
    .put(protect, authorize('admin'), updateStat)
    .delete(protect, authorize('admin'), deleteStat);

module.exports = router;
