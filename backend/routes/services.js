const express = require('express');
const { getServices, createService, updateService, deleteService } = require('../controllers/services');
const { adminAuth } = require('../middleware/auth');

const router = express.Router();

router.route('/')
    .get(getServices)
    .post(adminAuth, createService);

router.route('/:id')
    .put(adminAuth, updateService)
    .delete(adminAuth, deleteService);

module.exports = router;
