const mongoose = require('mongoose');

const CustomItemSchema = new mongoose.Schema({
    tabSlug: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    data: {
        type: Map,
        of: String,
        default: {}
    },
    image: {
        type: String,
        default: null
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'approved'
    },
    sort_order: {
        type: Number,
        default: 0
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

module.exports = mongoose.model('CustomItem', CustomItemSchema);
