const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
    title: {
        type: String,
        default: "Let's build something great together"
    },
    description: {
        type: String,
        default: "Ready to take your business to the next level? Reach out and let's discuss how Saltware can help you achieve your goals."
    },
    address: {
        type: String,
        required: [true, 'Please add an address']
    },
    phone: {
        type: String,
        required: [true, 'Please add a phone number']
    },
    whatsapp: {
        type: String,
        required: [true, 'Please add a WhatsApp number']
    },
    email: {
        type: String,
        required: [true, 'Please add an email']
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

module.exports = mongoose.model('Contact', ContactSchema);
