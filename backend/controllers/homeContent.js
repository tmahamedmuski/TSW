const HomeContent = require('../models/HomeContent');

// @desc    Get home content
// @route   GET /api/home-content
// @access  Public
exports.getHomeContent = async (req, res) => {
    try {
        let content = await HomeContent.findOne();
        if (!content) {
            // Create default content if it doesn't exist
            content = await HomeContent.create({});
        }
        res.status(200).json({ success: true, data: content });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Update home content
// @route   PUT /api/home-content
// @access  Private (Admin)
exports.updateHomeContent = async (req, res) => {
    try {
        let content = await HomeContent.findOne();
        if (!content) {
            content = await HomeContent.create(req.body);
        } else {
            content = await HomeContent.findOneAndUpdate({}, req.body, {
                new: true,
                runValidators: true
            });
        }
        res.status(200).json({ success: true, data: content });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};
