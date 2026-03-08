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
app.use(cors('*'));

// Body parser
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Routes
app.get('/api/health',  (req, res) => res.json({ status: 'ok' }));
app.use('/api/services', require('./routes/services'));
app.use('/api/employees', require('./routes/employees'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/industries', require('./routes/industries'));
app.use('/api/stats', require('./routes/stats'));
app.use('/api/contacts', require('./routes/contacts'));
app.use('/api/custom-tabs', require('./routes/customTabs'));
app.use('/api/custom-items', require('./routes/customItems'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/home-content', require('./routes/homeContent'));
app.use('/', (req, res) => res.send('Welcome to the TSW API'));





app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
