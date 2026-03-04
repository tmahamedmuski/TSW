const express = require('express');
const multer = require('multer');
const path = require('path');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Set memory storage engine
const storage = multer.memoryStorage();

// Check file type
function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png|gif|webp/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images Only!');
    }
}

// Init upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 5000000 }, // 5MB limit
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
});

// @desc    Upload file (Returns Base64 for MongoDB storage)
// @route   POST /api/upload
router.post('/', protect, authorize('admin'), upload.single('image'), (req, res) => {
    if (req.file === undefined) {
        return res.status(400).json({ success: false, error: 'No file selected' });
    }

    // Convert to Base64 data URI
    const b64 = Buffer.from(req.file.buffer).toString('base64');
    const dataUri = `data:${req.file.mimetype};base64,${b64}`;

    res.status(200).json({
        success: true,
        data: dataUri
    });
});

module.exports = router;
