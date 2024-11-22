const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const careerFieldRoutes = require('../routes/careerFieldRoutes');

let mongod;
const app = express();
app.use(express.json());
app.use('/api/careerFields', careerFieldRoutes);

jest.setTimeout(30000);

beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    await mongoose.connect(uri);
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongod.stop();
});

beforeEach(async () => {
    const collections = await mongoose.connection.db.collections();
    for (let collection of collections) {
        await collection.deleteMany({});
    }
});

describe('Career Field Routes', () => {
    describe('GET /recommended-careers', () => {
        it('Normal case: should return recommended careers', async () => {
            const mockData = {
                careerFields: [
                    { field: 'Software Engineering', rank: 1 },
                    { field: 'Data Science', rank: 2 }
                ]
            };
            await mongoose.connection.db.collection('recommended-careers').insertOne(mockData);

            const response = await request(app).get('/api/careerFields/recommended-careers');
            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockData.careerFields);
        });

        it('Edge case: should return 404 when no recommended careers found', async () => {
            const response = await request(app).get('/api/careerFields/recommended-careers');
            expect(response.status).toBe(404);
            expect(response.body.message).toBe('No career fields found in recommended-careers');
        });
    });

    describe('GET /not-recommended-careers', () => {
        it('Normal case: should return not recommended careers', async () => {
            const mockData = {
                careerFields: [
                    { field: 'Marketing', rank: 1 },
                    { field: 'Sales', rank: 2 }
                ]
            };
            await mongoose.connection.db.collection('not-recommended-careers').insertOne(mockData);

            const response = await request(app).get('/api/careerFields/not-recommended-careers');
            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockData.careerFields);
        });
    });

    describe('GET /all-careers', () => {
        it('Normal case: should return all careers', async () => {
            const recommendedData = {
                careerFields: [
                    { field: 'Software Engineering', rank: 1 },
                    { field: 'Data Science', rank: 2 }
                ]
            };
            const notRecommendedData = {
                careerFields: [
                    { field: 'Marketing', rank: 1 },
                    { field: 'Sales', rank: 2 }
                ]
            };
            await mongoose.connection.db.collection('recommended-careers').insertOne(recommendedData);
            await mongoose.connection.db.collection('not-recommended-careers').insertOne(notRecommendedData);

            const response = await request(app).get('/api/careerFields/all-careers');
            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                recommended: recommendedData.careerFields,
                notRecommended: notRecommendedData.careerFields
            });
        });

        it('Edge case: should return empty arrays when no careers found', async () => {
            const response = await request(app).get('/api/careerFields/all-careers');
            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                recommended: [],
                notRecommended: []
            });
        });
    });

    describe('GET /career-info/:field', () => {
        it('Normal case: should return career info for a specific field', async () => {
            const mockCareerInfo = {
                field: 'Software Engineering',
                description: 'A career in software development',
                careerPaths: ['Frontend Developer', 'Backend Developer'],
                recommendedCourses: [{ degree: 'BSc', major: 'Computer Science', institution: 'Tech University' }],
                salaryRange: [{ role: 'Junior Developer', lowest: 50000, highest: 80000 }],
                alumniTestimonial: { name: 'John Doe', title: 'Senior Developer', quote: 'Great career choice' },
                upcomingEvents: [{ title: 'Tech Conference 2023', link: 'https://example.com' }]
            };
            await mongoose.connection.db.collection('career-field').insertOne(mockCareerInfo);

            const response = await request(app).get('/api/careerFields/career-info/Software%20Engineering');
            expect(response.status).toBe(200);

            // Compare relevant fields without relying on exact _id match
            expect(response.body).toMatchObject({
                field: mockCareerInfo.field,
                description: mockCareerInfo.description,
                careerPaths: mockCareerInfo.careerPaths,
                recommendedCourses: mockCareerInfo.recommendedCourses,
                salaryRange: mockCareerInfo.salaryRange,
                alumniTestimonial: mockCareerInfo.alumniTestimonial,
                upcomingEvents: mockCareerInfo.upcomingEvents
            });

            // Ensure _id is present and is a string
            expect(response.body).toHaveProperty('_id');
            expect(typeof response.body._id).toBe('string');
        });

        it('Edge case: should return 404 when career field not found', async () => {
            const response = await request(app).get('/api/careerFields/career-info/NonexistentField');
            expect(response.status).toBe(404);
            expect(response.body.message).toBe('Career field not found');
        });
    });

    // Abnormal case: Test for server errors
    it('Abnormal case: should handle server errors', async () => {
        // Mock a database error
        jest.spyOn(mongoose.connection.db, 'collection').mockImplementationOnce(() => {
            throw new Error('Database error');
        });

        const response = await request(app).get('/api/careerFields/recommended-careers');
        expect(response.status).toBe(500);
        expect(response.body.message).toBe('Error fetching data from recommended-careers');
    });
});