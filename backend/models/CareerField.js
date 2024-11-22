const mongoose = require('mongoose');

// Define a schema for career fields
const careerFieldSchema = new mongoose.Schema({
    careerFields: [{
        field: String,
        rank: Number
    }]
});

module.exports = mongoose.model('CareerField', careerFieldSchema);