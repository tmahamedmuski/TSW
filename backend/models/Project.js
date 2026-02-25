const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image_url: {
        type: String,
        default: null
    },
    link: {
        type: String,
        default: null
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
    serviceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',
        default: null
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

module.exports = mongoose.model('Project', ProjectSchema);
