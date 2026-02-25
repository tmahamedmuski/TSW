const express = require('express');
const { getEmployees, createEmployee, updateEmployee, deleteEmployee } = require('../controllers/employees');
const { adminAuth } = require('../middleware/auth');

const router = express.Router();

router.route('/')
    .get(getEmployees)
    .post(adminAuth, createEmployee);

router.route('/:id')
    .put(adminAuth, updateEmployee)
    .delete(adminAuth, deleteEmployee);

module.exports = router;
