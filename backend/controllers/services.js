const Service = require('../models/Service');

// @desc    Get all services
// @route   GET /api/services
exports.getServices = async (req, res) => {
    try {
        const services = await Service.find().sort('sort_order');
        res.status(200).json({ success: true, count: services.length, data: services });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Create new service
// @route   POST /api/services
exports.createService = async (req, res) => {
    try {
        const service = await Service.create(req.body);
        res.status(201).json({ success: true, data: service });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Update service
// @route   PUT /api/services/:id
exports.updateService = async (req, res) => {
    try {
        const service = await Service.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!service) return res.status(404).json({ success: false, error: 'Service not found' });
        res.status(200).json({ success: true, data: service });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Delete service
// @route   DELETE /api/services/:id
exports.deleteService = async (req, res) => {
    try {
        const service = await Service.findByIdAndDelete(req.params.id);
        if (!service) return res.status(404).json({ success: false, error: 'Service not found' });
        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};
