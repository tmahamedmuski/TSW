const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const uri = "mongodb://127.0.0.1:27017/saltware";
        console.log(`Connecting to: ${uri}`);
        const conn = await mongoose.connect(uri);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (err) {
        console.error(`Error: ${err.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
