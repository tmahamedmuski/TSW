const express = require('express');
const {
    getContacts,
    getContact,
    createContact,
    updateContact,
    deleteContact
} = require('../controllers/contacts');

const router = express.Router();

// Middleware for admin protection
const { protect, authorize } = require('../middleware/auth');

router.route('/')
    .get(protect, authorize('admin'), getContacts)
    .post(createContact);

router.route('/:id')
    .get(getContact)
    .put(protect, authorize('admin'), updateContact)
    .delete(protect, authorize('admin'), deleteContact);

module.exports = router;
