const Student = require('../models/Student');
const User = require('../models/userModel'); // Assuming your User model is in the userModel.js
const Institution = require('../models/Institution');
const Course = require('../models/Course');

// Controller to fetch student data by linking code
exports.getStudentData = async (req, res) => {
    try {
        const linkingCode = req.query.linkingCode; // Extract linking code from the query parameters
        if (!linkingCode) {
            return res.status(400).json({message: 'Linking code is required'}); // Return error if linking code is not provided
        }

        const student = await Student.findOne({linkingCode}); // Find the student using the linking code

        if (!student) {
            return res.status(404).json({message: 'Student not found'}); // Return error if student is not found
        }

        res.json(student); // Send the student data as a JSON response
    } catch (error) {
        console.error('Error fetching students:', error); // Log any errors
        res.status(500).json({message: "Internal server error", error: error.message}); // Send error response if something fails
    }
};

// Controller to fetch all students, their institutions, and courses
exports.getAllStudentsInstitutionsCourses = async (req, res) => {
    try {
        console.log('Fetching data for all students');

        // Fetch all students and populate their institutions and courses
        const students = await Student.find()
            .populate({
                path: 'institutions.institution',
                select: 'name rank address',
            })
            .populate({
                path: 'institutions.courses',
                select: 'name rank duration international_fee domestic_fee',
                model: 'Course' // Make sure to specify the Course model
            });


        if (!students || students.length === 0) {
            console.log('No students found');
            return res.status(404).json({message: 'No students found'}); // Return error if no students are found
        }

        // Map the data to extract the necessary details about students, institutions, and courses
        const responseData = students.map(student => ({
            studentID: student._id,
            studentName: student.name,
            institutions: student.institutions.map(inst => ({
                institution: {
                    id: inst.institution._id,
                    name: inst.institution.name,
                    rank: inst.institution.rank,
                    address: inst.institution.address
                },
                courses: inst.courses.map(course => ({
                    id: course._id,
                    name: course.name,
                    rank: course.rank,
                    duration: course.duration,
                    international_fee: course.international_fee,
                    domestic_fee: course.domestic_fee
                }))
            }))
        }));

        console.log('Response data:', JSON.stringify(responseData, null, 2)); // Log the response data
        res.json(responseData); // Send the response with students, institutions, and courses data
    } catch (error) {
        console.error('Error in getAllStudentsInstitutionsCourses:', error); // Log any errors
        res.status(500).json({message: 'Error retrieving data', error: error.message}); // Send error response if something fails
    }
};

// Controller to fetch institutions for a specific student by ID
exports.getStudentInstitutions = async (req, res) => {
    try {
        const studentId = req.params.id;
        // console.log(`Fetching institutions for student with ID: ${studentId}`);

        // Find the student by ID and populate their institutions and courses
        const student = await Student.findById(studentId).populate({
            path: 'institutions.institution',
            select: 'name rank address'
        }).populate({
            path: 'institutions.courses',
            select: 'name rank duration international_fee domestic_fee'
        });

        // console.log('Raw student data:', JSON.stringify(student, null, 2));

        if (!student) {
            console.log(`No student found with ID: ${studentId}`);
            return res.status(404).json({message: 'Student not found'}); // Return error if student is not found
        }

        // console.log(`Found student: ${student.name}`);

        if (!student.institutions || student.institutions.length === 0) {
            console.log(`No institutions found for student: ${student.name}`);
        } else {
            console.log(`Number of institutions found: ${student.institutions.length}`);
            student.institutions.forEach((inst, index) => {
                console.log(`Institution ${index + 1}: ${inst.institution.name}`);
                console.log(`Courses for ${inst.institution.name}: ${inst.courses.length}`);
            });
        }

        console.log('Sending response with institutions data');
        res.json(student.institutions); // Send the institutions data as a JSON response
    } catch (error) {
        console.error('Error in getStudentInstitutions:', error); // Log any errors
        res.status(500).json({message: 'Error fetching student institutions', error: error.message}); // Send error response if something fails
    }
};

// Controller to fetch student data by ID
exports.getStudentDataById = async (req, res) => {
    try {
        const studentId = req.params.id; // Extract student ID from request params
        if (!studentId) {
            return res.status(400).json({message: 'Student ID is required'}); // Return error if student ID is not provided
        }

        const student = await Student.findById(studentId); // Find student by ID

        if (!student) {
            return res.status(404).json({message: 'Student not found'}); // Return error if student is not found
        }

        res.json(student); // Send the student data as a JSON response
    } catch (error) {
        res.status(500).json({message: error.message}); // Send error response if something fails
    }
};

// Controller to fetch a user and their children (students) by linkingCode
exports.getUserWithChildren = async (req, res) => {
    try {
        const {linkingCode} = req.params; // Extract linkingCode from request params

        // Find the user by linkingCode and populate the children (students) data
        const user = await User.findOne({linkingCode}).populate('children');

        if (!user) {
            return res.status(404).json({message: 'User not found'}); // Return error if user is not found
        }

        // Return the user along with the populated student (children) data
        res.json(user);
    } catch (error) {
        console.error(error); // Log any errors
        res.status(500).json({message: 'Server error'}); // Send error response if something fails
    }


};
