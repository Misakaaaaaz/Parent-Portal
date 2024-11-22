const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const userRouter = require('../routes/userRouter'); 
const User = require('../models/userModel'); 
const Student = require('../models/Student');
const { generateToken } = require('../utils/utils');
const bcrypt = require('bcrypt');

let mongod;
const app = express();
app.use(express.json());
app.use('/api/users', userRouter);

//Create a memory database before all tests
beforeAll(async () => {
  process.env.JWT_SECRET = 'key';
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

// Clear the database before each test
beforeEach(async () => {
  await User.deleteMany({});
  await Student.deleteMany({});
});
//----NORMAL CASE------

// Test the user routes
describe('User Router Tests', () => {
  describe('GET /api/users/seed', () => {
    test('should create sample users', async () => {
      const response = await request(app).get('/api/users/seed');
      expect(response.status).toBe(200);
      expect(response.body.createdUsers).toBeDefined();
      expect(Array.isArray(response.body.createdUsers)).toBeTruthy();
    });
  });

  describe('POST /api/users/signin', () => {
    test('should sign in user with valid credentials', async () => {
      const hashedPassword = await bcrypt.hash('password123', 10);
      const user = new User({
        name: 'Test User',
        email: 'test@example.com',
        password: hashedPassword,
        linkingCode: 'testCode123',
        mobileNumber: '1234567890',
        residentialAddress: '123 Test St',
        educationalBackground: 'Test Edu',
        occupationalArea: 'Test Occupation',
        annualEducationBudget: 10000,
        preferredFoE: ['Test Field'],
        notes: 'Test notes'
      });
      await user.save();

      const response = await request(app)
        .post('/api/users/signin')
        .send({ email: 'test@example.com', password: 'password123' });

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        name: 'Test User',
        email: 'test@example.com',
        linkingCode: 'testCode123',
        mobileNumber: '1234567890',
        residentialAddress: '123 Test St',
        educationalBackground: 'Test Edu',
        occupationalArea: 'Test Occupation',
        annualEducationBudget: '10000',
        preferredFoE: ['Test Field'],
        notes: 'Test notes'
      });
      expect(response.body.token).toBeDefined();
    });

    test('should return 401 for non-existent user', async () => {
      const response = await request(app)
        .post('/api/users/signin')
        .send({ email: 'nonexistent@example.com', password: 'anypassword' });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Invalid email or password');
    });

    test('should return 401 for incorrect password', async () => {
      const user = new User({
        name: 'Test User',
        email: 'test@example.com',
        password: await bcrypt.hash('correctpassword', 10),
        linkingCode: 'testLinkingCode',
      });
      await user.save();

      const response = await request(app)
        .post('/api/users/signin')
        .send({ email: 'test@example.com', password: 'wrongpassword' });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Invalid email or password');
    });
  });

  describe('POST /api/users/register', () => {
    test('should create a new user with valid linking code', async () => {
      await Student.create({ linkingCode: 'validCode123' });

      const newUser = {
        name: 'New User',
        email: 'newuser@example.com',
        password: 'password123',
        linkingCode: 'validCode123'
      };

      const response = await request(app)
        .post('/api/users/register')
        .send(newUser);

      expect(response.status).toBe(200);
      expect(response.body.name).toBe(newUser.name);
      expect(response.body.email).toBe(newUser.email);
      expect(response.body.token).toBeDefined();

      const updatedStudent = await Student.findOne({ linkingCode: 'validCode123' });
      expect(updatedStudent.parents.length).toBe(1);
    });

  describe('GET /api/users/:id', () => {
    test('should return user by id', async () => {
      const user = new User({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        linkingCode: 'testCode123'
      });
      await user.save();

      const response = await request(app).get(`/api/users/${user._id}`);

      expect(response.status).toBe(200);
      expect(response.body.name).toBe(user.name);
      expect(response.body.email).toBe(user.email);
    });

    test('should return 404 for non-existent user', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const response = await request(app).get(`/api/users/${nonExistentId}`);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('User Not Found');
    });
  });
  });

    // Continuation of the userRouter tests
    describe('PUT /api/users/profile', () => {
      test('should update user profile with valid data', async () => {
        const hashedPassword = await bcrypt.hash('password123', 10);
        const user = new User({
          name: 'Test User',
          email: 'testuser@example.com',
          password: hashedPassword,
          linkingCode: 'testCode123',
          mobileNumber: '1234567890',
          residentialAddress: '123 Test St',
          educationalBackground: 'Test Education',
          occupationalArea: 'Test Occupation',
          annualEducationBudget: 10000,
          preferredFoE: ['Test Field'],
          notes: 'Test Notes',
        });
        await user.save();
  
        const token = generateToken(user);
  
        const updatedData = {
          name: 'Updated Test User',
          email: 'updateduser@example.com',
          mobileNumber: '0987654321',
          residentialAddress: '321 Updated St',
        };
  
        const response = await request(app)
          .put('/api/users/profile')
          .set('Authorization', `Bearer ${token}`)
          .send(updatedData);
  
        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({
          name: 'Updated Test User',
          email: 'updateduser@example.com',
          mobileNumber: '0987654321',
          residentialAddress: '321 Updated St',
        });
      });
  
      test('should return 404 if user not found', async () => {
        const nonExistentUserId = new mongoose.Types.ObjectId();
  
        const mockUser = {
          _id: nonExistentUserId,   // Use the valid ObjectId
          name: 'Mock User',
          email: 'mockuser@example.com', // Mock valid email
        };
    
        const token = generateToken(mockUser); // Generate token for a valid mock user
    
        const response = await request(app)
          .put('/api/users/profile')
          .set('Authorization', `Bearer ${token}`) // Use valid token
          .send({
            name: 'Updated Name',
            email: 'updatedemail@example.com',
            password: 'newpassword123',
          });
    
  
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('User not found');
      });
    });
  
    describe('PUT /api/users/change-password', () => {
      test('should change password with valid old password', async () => {
        const hashedPassword = await bcrypt.hash('password123', 10);
        const user = new User({
          name: 'Test User',
          email: 'test@example.com',
          password: hashedPassword,
          linkingCode: 'testCode123',
        });
        await user.save();
  
        const token = generateToken(user);
  
        const response = await request(app)
          .put('/api/users/change-password')
          .set('Authorization', `Bearer ${token}`)
          .send({
            userId: user._id,
            oldPassword: 'password123',
            newPassword: 'newPassword123',
          });
  
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Password updated successfully');
  
        // Verify the password has been updated
        const updatedUser = await User.findById(user._id);
        const isMatch = await bcrypt.compare('newPassword123', updatedUser.password);
        expect(isMatch).toBe(true);
      });
  
      test('should return 400 if old password is incorrect', async () => {
        const hashedPassword = await bcrypt.hash('password123', 10);
        const user = new User({
          name: 'Test User',
          email: 'test@example.com',
          password: hashedPassword,
          linkingCode: 'testCode123',
        });
        await user.save();
  
        const token = generateToken(user);
  
        const response = await request(app)
          .put('/api/users/change-password')
          .set('Authorization', `Bearer ${token}`)
          .send({
            userId: user._id,
            oldPassword: 'wrongpassword',
            newPassword: 'newPassword123',
          });
  
        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Old password is incorrect');
      });
    });
  
    describe('PUT /api/users/reset-password', () => {
      test('should reset password for a valid email', async () => {
        const user = new User({
          name: 'Test User',
          email: 'test@example.com',
          password: await bcrypt.hash('oldpassword', 10),
          linkingCode: 'testCode123',
        });
        await user.save();
  
        const response = await request(app)
          .put('/api/users/reset-password')
          .send({
            email: 'test@example.com',
            newPassword: 'newpassword123',
          });
  
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Password updated successfully.');
  
        // Verify password update
        const updatedUser = await User.findOne({ email: 'test@example.com' });
        const isMatch = await bcrypt.compare('newpassword123', updatedUser.password);
        expect(isMatch).toBe(true);
      });
  
      test('should return 404 for a non-existent email', async () => {
        const response = await request(app)
          .put('/api/users/reset-password')
          .send({
            email: 'nonexistent@example.com',
            newPassword: 'newpassword123',
          });
  
        expect(response.status).toBe(404);
        expect(response.body.message).toBe('User not found with this email.');
      });
    });
  });
  
