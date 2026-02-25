const mongoose = require('mongoose');
const Service = require('./models/Service');

const services = [
    {
        icon: 'Code2',
        title: 'EAD',
        description: 'Enterprise Application Development: Custom software solutions tailored for large-scale business operations and complex workflows.',
        sort_order: 1,
        status: 'approved'
    },
    {
        icon: 'Zap',
        title: 'IOT',
        description: 'Internet of Things: Connecting devices and systems to collect, analyze, and act on data in real-time for smarter operations.',
        sort_order: 2,
        status: 'approved'
    },
    {
        icon: 'Smartphone',
        title: 'MOBILE APP',
        description: 'Mobile Application Development: Building high-performance, user-friendly mobile apps for iOS and Android platforms.',
        sort_order: 3,
        status: 'approved'
    },
    {
        icon: 'Cloud',
        title: 'Cloud Solutions',
        description: 'Secure and scalable cloud infrastructure and migration services to power your digital transformation.',
        sort_order: 4,
        status: 'approved'
    }
];

const seedDB = async () => {
    try {
        // Connect to local MongoDB
        await mongoose.connect('mongodb://127.0.0.1:27017/saltware');
        console.log('Connected to MongoDB for seeding...');

        // Clear existing services
        await Service.deleteMany({});
        console.log('Cleared existing services.');

        // Insert new services
        await Service.insertMany(services);
        console.log('Seeded IT services successfully.');

        process.exit(0);
    } catch (err) {
        console.error('Error seeding database:', err);
        process.exit(1);
    }
};

seedDB();
