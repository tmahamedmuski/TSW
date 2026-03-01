const mongoose = require('mongoose');

const HomeContentSchema = new mongoose.Schema({
    hero: {
        subtitle: {
            type: String,
            default: 'Innovation with Integrity'
        },
        title: {
            type: String,
            default: 'For People, Planet, and Purpose'
        },
        description: {
            type: String,
            default: 'Saltware (PVT) Ltd delivers world-class software solutions and IT services that empower businesses to thrive in the digital era.'
        },
        primaryButtonText: {
            type: String,
            default: 'Explore Services'
        },
        primaryButtonLink: {
            type: String,
            default: '#services'
        }
    },
    about: {
        subtitle: {
            type: String,
            default: 'About Us'
        },
        title: {
            type: String,
            default: 'Tailoring world-class digital solutions to match your distinct requirements'
        },
        description1: {
            type: String,
            default: 'Saltware (PVT) Ltd, based in Puttalam, North Western Province, is a premier software development company specializing in designing, executing, and supporting enterprise solutions for diverse industries.'
        },
        description2: {
            type: String,
            default: 'Prioritizing our client\'s needs, we emphasize value creation by employing collaborative methodologies, ensuring technology solutions are perfectly aligned with business objectives.'
        },
        competenciesTitle: {
            type: String,
            default: 'Key Competencies'
        },
        competencies: {
            type: [String],
            default: [
                'End-to-End Software Solutions',
                'Expertise Across Multiple Platforms',
                'Dedicated Team & Support Resources',
                'Strategic Technology Partnerships',
                'Industry-Specific Verticals',
                'Professional Project Management'
            ]
        }
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('HomeContent', HomeContentSchema);
