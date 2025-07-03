const mongoose = require('mongoose');
const MongoUri = process.env.MONGO_URI;

async function connectDB() {
    try {
        await mongoose.connect(MongoUri);
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection error:', error);
    }
}

module.exports = connectDB;