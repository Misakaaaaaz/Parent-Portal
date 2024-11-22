// Import the mongoose library
const mongoose = require('mongoose');

// Function to connect to MongoDB
const connectDB = async () => {
  try {
    // Attempt to connect to MongoDB using the URI from environment variables
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (err) {
    // If connection fails, log the error and exit the process
    console.log('MongoDB connection error:', err);
    process.exit(1);
  }
};

// Export the connectDB function for use in other modules
module.exports = connectDB;