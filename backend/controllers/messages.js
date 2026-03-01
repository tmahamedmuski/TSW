const Message = require('../models/Message');
const { Resend } = require('resend');

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// @desc    Get all messages
// @route   GET /api/messages
// @access  Private (Admin)
exports.getMessages = async (req, res) => {
    try {
        const messages = await Message.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: messages.length, data: messages });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Create new message (Contact Form Submission)
// @route   POST /api/messages
// @access  Public
exports.createMessage = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        console.log('Incoming message request:', req.body);

        // 1. Save to database
        const newMessage = await Message.create({ name, email, subject, message });
        console.log('Message saved to database:', newMessage.id);

        // 2. Send email notification using Resend
        const receiverEmail = process.env.RECEIVER_EMAIL || 'info@saltware.lk';

        const { data, error } = await resend.emails.send({
            from: 'Saltware Contact <onboarding@resend.dev>', // Resend requires verified domain or onboarding address
            to: [receiverEmail],
            subject: `New Contact Form: ${subject}`,
            reply_to: email,
            html: `
                <div style="font-family: sans-serif; padding: 20px; color: #333;">
                    <h2 style="color: #0066cc;">New Message from Saltware Website</h2>
                    <p><strong>Name:</strong> ${name}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Subject:</strong> ${subject}</p>
                    <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
                    <p><strong>Message content:</strong></p>
                    <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; border-left: 4px solid #0066cc;">
                        ${message.replace(/\n/g, '<br>')}
                    </div>
                </div>
            `,
        });

        if (error) {
            console.error('Resend error:', error);
        } else {
            console.log('Email sent successfully via Resend:', data.id);
        }

        res.status(201).json({ success: true, data: newMessage });
    } catch (err) {
        console.error('Error creating message:', err);
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Delete message
// @route   DELETE /api/messages/:id
// @access  Private (Admin)
exports.deleteMessage = async (req, res) => {
    try {
        const message = await Message.findByIdAndDelete(req.params.id);
        if (!message) {
            return res.status(404).json({ success: false, error: 'Message not found' });
        }
        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};
