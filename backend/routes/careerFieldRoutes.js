// Import required modules
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Function to fetch data from a specific collection in MongoDB
async function getCollectionData(collectionName) {
    try {
        const collection = mongoose.connection.db.collection(collectionName); // Access the collection
        const data = await collection.find({}).toArray(); // Fetch all documents in the collection
        console.log(`Fetched data from ${collectionName}:`, data); // Log the fetched data
        return data; // Return the fetched data
    } catch (error) {
        console.error(`Error fetching data from ${collectionName}:`, error); // Log any errors encountered
        throw error; // Throw the error to handle it in the route
    }
}

// Define an array of career fields with their corresponding collection names
const careerFields = [
    { name: 'recommended-careers', collection: 'recommended-careers' }, // Route for recommended careers
    { name: 'not-recommended-careers', collection: 'not-recommended-careers' } // Route for not-recommended careers
];

// Loop through each career field and define a GET route
careerFields.forEach(field => {
    router.get(`/${field.name}`, async (req, res) => {
        try {
            const data = await getCollectionData(field.collection); // Fetch data from the specified collection
            if (data && data.length > 0 && data[0].careerFields) {
                // If data is found, respond with the careerFields array
                res.json(data[0].careerFields);
            } else {
                // If no data is found, respond with a 404 status and a message
                res.status(404).json({ message: `No career fields found in ${field.collection}` });
            }
        } catch (error) {
            console.error(`Error in /${field.name} route:`, error); // Log any errors encountered
            // Respond with a 500 status and error message if there was an issue fetching the data
            res.status(500).json({ message: `Error fetching data from ${field.collection}`, error: error.message });
        }
    });
});

router.get('/all-careers', async (req, res) => {
    try {
        // Fetch data from both recommended and not-recommended career collections
        const recommendedData = await getCollectionData('recommended-careers');
        const notRecommendedData = await getCollectionData('not-recommended-careers');

        // Combine the data into a single object
        const allCareers = {
            recommended: recommendedData[0]?.careerFields || [], // If no data is found, default to an empty array
            notRecommended: notRecommendedData[0]?.careerFields || []
        };

        // Respond with the combined career data
        res.json(allCareers);
    } catch (error) {
        console.error('Error in /all-careers route:', error); // Log any errors encountered
        // Respond with a 500 status and error message if there was an issue fetching the data
        res.status(500).json({ message: 'Error fetching all career data', error: error.message });
    }
});

// Updated route to get specific career information using getCollectionData
router.get('/career-info/:field', async (req, res) => {
    console.log("the router of the specific career information is evoked")
    try {
        const fieldName = decodeURIComponent(req.params.field);
        const careerInfoData = await getCollectionData('career-field');
        const careerInfo = careerInfoData.find(info => info.field === fieldName);

        if (!careerInfo) {
            return res.status(404).json({ message: 'Career field not found' });
        }
        res.json(careerInfo);
    } catch (error) {
        console.error('Error in /career-info/:field route:', error);
        res.status(500).json({ message: 'Error fetching career information', error: error.message });
    }
});

module.exports = router;
