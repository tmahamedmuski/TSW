const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
    icon: {
        type: String,
        required: true,
        default: 'Code2'
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    sort_order: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'approved'
    },
    data: {
        type: Map,
        of: String,
        default: {}
    }
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
        transform: function (doc, ret) {
            ret.id = ret._id;
            if (ret.data instanceof Map) {
                ret.data = Object.fromEntries(ret.data);
            }
            return ret;
        }
    },
    toObject: { virtuals: true }
});

module.exports = mongoose.model('Service', ServiceSchema);
