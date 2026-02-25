const express = require('express');
const { getStats, createStat, updateStat, deleteStat } = require('../controllers/stats');
const { adminAuth } = require('../middleware/auth');

const router = express.Router();

router.route('/')
    .get(getStats)
    .post(adminAuth, createStat);

router.route('/:id')
    .put(adminAuth, updateStat)
    .delete(adminAuth, deleteStat);

module.exports = router;
