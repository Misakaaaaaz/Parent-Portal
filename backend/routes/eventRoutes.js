// Import express and the Event model
const express = require('express');
const router = express.Router();
const Event = require('../models/Event'); // Ensure correct path to Event model

// Route to fetch events
router.get('/', async (req, res) => {
  try {
    const studentId = req.query.studentId; // Get studentId from query parameters
    let events;

    if (studentId) {
      // If studentId is provided, fetch events related to the specific student and populate the student field
      events = await Event.find({ student: studentId }).populate('student');
    } else {
      // If no studentId is provided, fetch all events and populate the student field
      events = await Event.find().populate('student');
    }

    // Respond with the fetched events in JSON format
    res.json(events);

  } catch (error) {
    // Log any errors that occur during event fetching and return a 500 status with an error message
    console.error('Error fetching events:', error);
    res.status(500).json({ message: 'Error fetching events', error: error.message });
  }
});

// Export the router to be used in the main app
module.exports = router;
