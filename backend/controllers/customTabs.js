const CustomTab = require('../models/CustomTab');
const CustomItem = require('../models/CustomItem');

// @desc    Get all custom tabs
// @route   GET /api/custom-tabs
exports.getTabs = async (req, res) => {
    try {
        const tabs = await CustomTab.find().sort('name');
        res.status(200).json({ success: true, count: tabs.length, data: tabs });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Create new tab
// @route   POST /api/custom-tabs
exports.createTab = async (req, res) => {
    try {
        const tab = await CustomTab.create(req.body);
        res.status(201).json({ success: true, data: tab });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Delete tab
// @route   DELETE /api/custom-tabs/:id
exports.deleteTab = async (req, res) => {
    try {
        const tab = await CustomTab.findById(req.params.id);
        if (!tab) return res.status(404).json({ success: false, error: 'Tab not found' });

        // Delete all items associated with this tab
        await CustomItem.deleteMany({ tabSlug: tab.slug });

        await tab.deleteOne();
        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};
// @desc    Update tab (e.g., add fields)
// @route   PUT /api/custom-tabs/:id
exports.updateTab = async (req, res) => {
    try {
        const updateData = { ...req.body };
        delete updateData._id;
        delete updateData.id;
        const tab = await CustomTab.findByIdAndUpdate(req.params.id, updateData, {
            new: true,
            runValidators: true
        });
        if (!tab) return res.status(404).json({ success: false, error: 'Tab not found' });
        res.status(200).json({ success: true, data: tab });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};
