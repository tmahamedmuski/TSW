const express = require('express');
const {
    getMessages,
    createMessage,
    deleteMessage
} = require('../controllers/messages');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

router.route('/')
    .get(protect, authorize('admin'), getMessages)
    .post(createMessage);

router.route('/:id')
    .delete(protect, authorize('admin'), deleteMessage);

module.exports = router;
