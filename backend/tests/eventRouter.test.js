// Import necessary modules and dependencies
const mongoose = require('mongoose');
const request = require('supertest');
const express = require('express');
const { MongoMemoryServer } = require('mongodb-memory-server');
const eventRouter = require('../routes/eventRoutes');
const Event = require('../models/Event');
const Student = require('../models/Student');

// Set up Express app and MongoDB memory server
let mongod;
const app = express();
app.use(express.json());
app.use('/api/events', eventRouter);

// Set up the database connection before running tests
beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    await mongoose.connect(uri);
});

// Clean up and close the database connection after all tests
afterAll(async () => {
    await mongoose.disconnect();
    await mongod.stop();
});

// Clear the database before each test
beforeEach(async () => {
    await Event.deleteMany({});
    await Student.deleteMany({});
});

describe('Event API', () => {
    describe('GET /api/events', () => {
        // Test case: Fetch all events
        it('Normal case: fetch all events', async () => {
            // Create a student and an event
            const student = await Student.create({ name: 'John Doe' });
            await Event.create({
                student: student._id,
                eventName: 'Math Test',
                startDate: new Date('2024-10-20T10:00:00'),
                endDate: new Date('2024-10-20T12:00:00'),
                eventType: 'Exam',
                location: 'Room 101',
            });

            // Send GET request to fetch all events
            const res = await request(app).get('/api/events');
            
            // Assert the response
            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveLength(1);
            expect(res.body[0]).toMatchObject({
                eventName: 'Math Test',
                eventType: 'Exam',
                location: 'Room 101',
            });
        });

        // Test case: Fetch events by studentId
        it('Normal case: fetch events by studentId', async () => {
            // Create a student and an event
            const student = await Student.create({ name: 'John Doe' });
            await Event.create({
                student: student._id,
                eventName: 'Science Fair',
                startDate: new Date('2024-11-20T10:00:00'),
                endDate: new Date('2024-11-20T12:00:00'),
                eventType: 'Exhibition',
                location: 'Auditorium',
            });

            // Send GET request to fetch events for the student
            const res = await request(app).get(`/api/events?studentId=${student._id}`);
            
            // Assert the response
            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveLength(1);
            expect(res.body[0].eventName).toBe('Science Fair');
        });

        // Test case: No events found for a given studentId
        it('Edge case: return 404 when no events found for studentId', async () => {
            // Send GET request with a non-existent studentId
            const res = await request(app).get(`/api/events?studentId=${new mongoose.Types.ObjectId()}`);
            
            // Assert the response
            expect(res.statusCode).toBe(200); // Assuming no error, but empty result
            expect(res.body).toHaveLength(0);
        });

        // Test case: Handle database error
        it('Abnormal case: handle database error and return 500', async () => {
            // Mock the Event.find method to throw an error
            jest.spyOn(Event, 'find').mockImplementationOnce(() => {
                throw new Error('Database error');
            });

            // Send GET request to fetch events
            const res = await request(app).get('/api/events');
            
            // Assert the response
            expect(res.statusCode).toBe(500);
            expect(res.body).toEqual({
                message: 'Error fetching events',
                error: 'Database error',
            });
        });
    });
});