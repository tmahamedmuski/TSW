const CustomItem = require('../models/CustomItem');

// @desc    Get items for a tab
// @route   GET /api/custom-items/:tabSlug
exports.getItems = async (req, res) => {
    try {
        const items = await CustomItem.find({ tabSlug: req.params.tabSlug }).sort('sort_order');
        res.status(200).json({ success: true, count: items.length, data: items });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Create item
// @route   POST /api/custom-items
exports.createItem = async (req, res) => {
    try {
        const item = await CustomItem.create(req.body);
        res.status(201).json({ success: true, data: item });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Update item
// @route   PUT /api/custom-items/:id
exports.updateItem = async (req, res) => {
    try {
        const item = await CustomItem.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!item) return res.status(404).json({ success: false, error: 'Item not found' });
        res.status(200).json({ success: true, data: item });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Delete item
// @route   DELETE /api/custom-items/:id
exports.deleteItem = async (req, res) => {
    try {
        const item = await CustomItem.findByIdAndDelete(req.params.id);
        if (!item) return res.status(404).json({ success: false, error: 'Item not found' });
        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};
