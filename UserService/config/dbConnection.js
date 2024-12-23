const mongoose = require('mongoose');

const connectMongoDB = async (mongoURI) => {
    try {
        console.log(mongoURI,"***")
        const connection = await mongoose.connect(mongoURI, {});
        console.log('MongoDB connected:', connection.connection.host);
        return true;  // Return true if connection is successful
    } catch (error) {
        console.error('MongoDB connection error:', error.message);
        process.exit(1); // Exit the process with a failure
        return false; // Return false if connection is not successful
    }
}

const disconnectMongo = async () => {
    try {
        await mongoose.disconnect();
        console.log('MongoDB disconnected');
    } catch (error) {
        console.error('Error disconnecting from MongoDB:', error.message);
    }
};

module.exports = {
    connectMongoDB,
    disconnectMongo
};