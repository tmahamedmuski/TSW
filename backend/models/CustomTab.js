const mongoose = require('mongoose');

const CustomTabSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name for the tab'],
        unique: true
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    icon: {
        type: String,
        default: 'Layout'
    },
    fields: [{
        name: { type: String, required: true },
        type: { type: String, default: 'text' } // e.g., 'text' or 'textarea'
    }]
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
        transform: function (doc, ret) {
            ret.id = ret._id;
            return ret;
        }
    },
    toObject: { virtuals: true }
});

module.exports = mongoose.model('CustomTab', CustomTabSchema);
