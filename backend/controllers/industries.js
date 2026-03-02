const Industry = require('../models/Industry');

// @desc    Get all industries
// @route   GET /api/industries
exports.getIndustries = async (req, res) => {
    try {
        const industries = await Industry.find().sort('sort_order');
        res.status(200).json({ success: true, count: industries.length, data: industries });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Create new industry
// @route   POST /api/industries
exports.createIndustry = async (req, res) => {
    try {
        const industry = await Industry.create(req.body);
        res.status(201).json({ success: true, data: industry });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Update industry
// @route   PUT /api/industries/:id
exports.updateIndustry = async (req, res) => {
    try {
        const industry = await Industry.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!industry) return res.status(404).json({ success: false, error: 'Industry not found' });
        res.status(200).json({ success: true, data: industry });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Delete industry
// @route   DELETE /api/industries/:id
exports.deleteIndustry = async (req, res) => {
    try {
        const industry = await Industry.findByIdAndDelete(req.params.id);
        if (!industry) return res.status(404).json({ success: false, error: 'Industry not found' });
        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};
