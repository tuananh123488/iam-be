const mongoose = require('mongoose');

const mongodbConnect = async () => {
    try {
        const mongoURI = process.env.MONGODB;

        await mongoose.connect(mongoURI);

        console.log('MongoDB connected successfully');
        return mongoose.connection;
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

module.exports = mongodbConnect;
