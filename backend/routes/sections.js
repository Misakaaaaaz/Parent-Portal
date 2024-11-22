// Import required modules
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Function to fetch data from a specific collection in MongoDB based on studentId
async function getCollectionDataByStudentId(collectionName, studentId) {
    try {
        // Get the specified collection
        const collection = mongoose.connection.db.collection(collectionName);
        // Create a query object based on whether studentId is provided
        const query = studentId
            ? { studentId: new mongoose.Types.ObjectId(studentId) }
            : {};
        // Fetch and return the data as an array
        return await collection.find(query).toArray();
    } catch (error) {
        console.error(`Error fetching data from ${collectionName}:`, error);
        throw error;
    }
}

// Define an array of sections with their corresponding collection names
const sections = [
    { name: 'section0', collection: 'section0' },
    { name: 'section1', collection: 'section1' },
    { name: 'section2', collection: 'section2' },
    { name: 'section3', collection: 'section3' },
    { name: 'section4', collection: 'section4' },
    { name: 'section5', collection: 'section5' },
    { name: 'academic', collection: 'academic' }
];

// Create a route for each section
sections.forEach(section => {
    router.get(`/${section.name}`, async (req, res) => {
        try {
            // Get studentId from query parameters
            const studentId = req.query.studentId;
            // Fetch data for the specific section and student
            const data = await getCollectionDataByStudentId(section.collection, studentId);
            // Send the fetched data as a JSON response
            res.json(data);
        } catch (error) {
            // If an error occurs, send a 500 status with the error message
            res.status(500).json({ message: error.message });
        }
    });
});

// Test route to check if the API is working
router.get('/test', (req, res) => {
    res.json({ message: "API is working!" });
});

// Export the router for use in the main app
module.exports = router;
