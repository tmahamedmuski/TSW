const express = require('express');
const { getEmployees, createEmployee, updateEmployee, deleteEmployee } = require('../controllers/employees');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.route('/')
    .get(getEmployees)
    .post(protect, authorize('admin'), createEmployee);

router.route('/:id')
    .put(protect, authorize('admin'), updateEmployee)
    .delete(protect, authorize('admin'), deleteEmployee);

module.exports = router;
