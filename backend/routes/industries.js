const express = require('express');
const { getIndustries, createIndustry, updateIndustry, deleteIndustry } = require('../controllers/industries');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.route('/')
    .get(getIndustries)
    .post(protect, authorize('admin'), createIndustry);

router.route('/:id')
    .put(protect, authorize('admin'), updateIndustry)
    .delete(protect, authorize('admin'), deleteIndustry);

module.exports = router;
