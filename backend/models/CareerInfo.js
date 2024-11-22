const mongoose = require('mongoose');

const careerInfoSchema = new mongoose.Schema({
    field: {
        name: String,
        required: true,
        unique: true
    },
    icon_data: String,
    description: String,
    careerPaths: [String],
    recommendedCourses: [{
        degree: String,
        major: String,
        institution: String
    }],
    salaryRange: [{
        role: String,
        lowest: Number,
        highest: Number
    }],
    alumniTestimonial: {
        name: String,
        title: String,
        quote: String,
        image_data: String
    },
    upcomingEvents: [{
        title: String,
        link: String
    }]
});

module.exports = mongoose.model('CareerInfo', careerInfoSchema);