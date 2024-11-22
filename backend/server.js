const data = require('./data/data.js');
const mongoose = require('mongoose');
const express = require('express');
const dotenv = require('dotenv');
const userRouter = require('./routes/userRouter.js');
const studentRoutes = require('./routes/studentRoutes');
const careerFieldRoutes = require('./routes/careerFieldRoutes');
const app = require('./app');
const cors = require('cors');

// Enable CORS for cross-origin resource sharing
app.use(cors());
dotenv.config();// Load environment variables

// Middleware to parse incoming JSON requests
app.use(express.json());

// Connect to MongoDB using connection string from .env file
mongoose.connect('mongodb+srv://haolan:GHL20022133kog@soft3888-p42.52cizos.mongodb.net/OIC').then(async () => {
  console.log('Connected to MongoDB');
  try {
    // List all collections from the MongoDB database
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Collections:', collections.map(c => c.name));
  } catch (error) {
    console.error('Error listing collections:', error);
  }
})
.catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});

const port = 5000;// Set the port for the server

// Basic route to check server status
app.get('/', (req, res) => {
  res.send('Hello from Express!');
});

// Import additional routes for sections, students, and career fields
const sectionRoutes = require('./routes/sections');

// Define API routes
app.use('/api/users', userRouter); // Routes for user-related API calls
app.use('/api', sectionRoutes); // General section-related API calls
app.use('/api/students', studentRoutes); // Routes for student-related API calls
app.use('/api/careerFields', careerFieldRoutes); // Routes for career fields

// Global error handler to send 500 status on server errors
app.use((err,req,res,next)=>{
  res.status(500).send({message:err.message});
});

// Start the server and listen on the specified port
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = app; // Export app for use in other modules