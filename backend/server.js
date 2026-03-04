const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Enable CORS
app.use(cors());

// Body parser
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Routes
app.use('/api/services', require('./routes/services'));
app.use('/api/employees', require('./routes/employees'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/industries', require('./routes/industries'));
app.use('/api/stats', require('./routes/stats'));
app.use('/api/contacts', require('./routes/contacts'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/custom-tabs', require('./routes/customTabs'));
app.use('/api/custom-items', require('./routes/customItems'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/home-content', require('./routes/homeContent'));


// Static folder for uploads
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
