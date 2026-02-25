const express = require('express');
const { getIndustries, createIndustry, updateIndustry, deleteIndustry } = require('../controllers/industries');
const { adminAuth } = require('../middleware/auth');

const router = express.Router();

router.route('/')
    .get(getIndustries)
    .post(adminAuth, createIndustry);

router.route('/:id')
    .put(adminAuth, updateIndustry)
    .delete(adminAuth, deleteIndustry);

module.exports = router;
