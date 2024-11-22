// Import express and necessary modules
const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const Student = require('../models/Student'); // Ensure correct path to Student model

// Route to get student data (all or filtered)
router.get('/student-data', studentController.getStudentData);

// Route to get student data by specific student ID
router.get('/student-data/:id', studentController.getStudentDataById);

// Route to get all students' institutions and courses data
router.get('/institutions', studentController.getAllStudentsInstitutionsCourses);

// Route to get institutions of a specific student by student ID
router.get('/:id/institutions', studentController.getStudentInstitutions);

// Route to get student data by linkingCode
router.get('/student', async (req, res) => {
    const { linkingCode } = req.query; // Get linkingCode from query parameters
    try {
      // Search for student by linkingCode
      const student = await Student.findOne({ linkingCode });
      if (student) {
        // If found, send student data
        res.status(200).json(student);
      } else {
        // If student not found, send 404 status with message
        res.status(404).json({ message: 'Student not found' });
      }
    } catch (error) {
      // Handle server error
      res.status(500).json({ message: 'Server error', error });
    }
  });

// Export the router for use in the main app
module.exports = router;
