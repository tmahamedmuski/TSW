const express = require('express');
const router = express.Router();
const multer = require('multer');
const { protect } = require('../middleware/auth');

// Memory storage to store file in buffer
const storage = multer.memoryStorage();
const upload = multer({ 
    storage,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB max limit
});

// @desc    Upload image and return Base64 string
// @route   POST /api/upload
// @access  Private
router.post('/', protect, upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, error: 'Please upload a file' });
        }

        // Convert buffer to base64 data URI
        const b64 = req.file.buffer.toString('base64');
        const mimeType = req.file.mimetype;
        const dataURI = `data:${mimeType};base64,${b64}`;

        res.status(200).json({
            success: true,
            data: dataURI
        });
    } catch (error) {
        console.error('Upload Error:', error);
        res.status(500).json({ success: false, error: 'Server error during upload' });
    }
});

module.exports = router;
