// Import required modules
const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log('MongoDB connection error:', err));

// Define the Student schema
const StudentSchema = new mongoose.Schema({
    name: String,
    age: Number,
    schoolName: String,
    class: String,
    grade: Number,
    recentEmotion: {
        ExtraSad: Number,
        Sad: Number,
        Neutral: Number,
        Happy: Number,
        ExtraHappy: Number
    },
    interests: [{
        name: String,
        value: Number
    }],
    recentPerformance: [{
        Term: String,
        Student: Number,
        Course1: Number,
        Course2: Number,
        Course3: Number
    }],
    linkingCode: String,
    institutions: [{
        institution: {type: mongoose.Schema.Types.ObjectId, ref: 'Institution'},
        courses: [{type: mongoose.Schema.Types.ObjectId, ref: 'Course'}]
    }]
});

// Create the Student model
const Student = mongoose.model('Student', StudentSchema);

// Create a sample student
const sampleStudent = new Student({
    name: "Rachel Adams",
    age: 18,
    schoolName: "Lincoln High School",
    class: "12B",
    grade: 12,
    recentEmotion: {
        ExtraSad: 30,
        Sad: 25,
        Neutral: 20,
        Happy: 15,
        ExtraHappy: 10
    },
    interests: [
        {name: "Dance", value: 600.00},
        {name: "Karate", value: 300.00},
        {name: "Violin", value: 2200.00},
        {name: "Cooking", value: 100.00}
    ],
    recentPerformance: [
        {Term: "Term 1", Student: 65, Course1: 70, Course2: 80, Course3: 90},
        {Term: "Term 2", Student: 75, Course1: 70, Course2: 80, Course3: 90},
        {Term: "Term 3", Student: 80, Course1: 70, Course2: 80, Course3: 90},
        {Term: "Term 4", Student: 91, Course1: 70, Course2: 80, Course3: 90}
    ],
    linkingCode: "ABC123",
    institutions: [
        {
            institution: {
                id: 1,
                name: "UMelb",
                rank: 1,
                address: "Parkville VIC 3010, Australia"
            },
            courses: [
                {
                    id: 101,
                    name: "Bachelor of Science",
                    rank: 5,
                    duration: 3,
                    international_fee: 45000,
                    domestic_fee: 9000
                },
                {
                    id: 102,
                    name: "Master of Engineering",
                    rank: 3,
                    duration: 2,
                    international_fee: 50000,
                    domestic_fee: 10000
                }
            ]
        }
    ]
});

// Save the sample student to the database
sampleStudent.save()
    .then(() => {
        console.log('Sample student data saved successfully');
        mongoose.connection.close();
    })
    .catch(err => {
        console.error('Error saving sample student data:', err);
        mongoose.connection.close();
    });