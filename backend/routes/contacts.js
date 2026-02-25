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
const { adminAuth } = require('../middleware/auth');

router.route('/')
    .get(getContacts)
    .post(adminAuth, createContact);

router.route('/:id')
    .get(getContact)
    .put(adminAuth, updateContact)
    .delete(adminAuth, deleteContact);

module.exports = router;
