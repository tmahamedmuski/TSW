const Stat = require('../models/Stat');

// @desc    Get all stats
// @route   GET /api/stats
exports.getStats = async (req, res) => {
    try {
        const stats = await Stat.find().sort('sort_order');
        res.status(200).json({ success: true, count: stats.length, data: stats });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Create new stat
// @route   POST /api/stats
exports.createStat = async (req, res) => {
    try {
        const stat = await Stat.create(req.body);
        res.status(201).json({ success: true, data: stat });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Update stat
// @route   PUT /api/stats/:id
exports.updateStat = async (req, res) => {
    try {
        const stat = await Stat.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!stat) return res.status(404).json({ success: false, error: 'Stat not found' });
        res.status(200).json({ success: true, data: stat });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Delete stat
// @route   DELETE /api/stats/:id
exports.deleteStat = async (req, res) => {
    try {
        const stat = await Stat.findByIdAndDelete(req.params.id);
        if (!stat) return res.status(404).json({ success: false, error: 'Stat not found' });
        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};
