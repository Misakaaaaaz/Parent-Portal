const mongoose = require('mongoose');
const request = require('supertest');
const express = require('express');
const { MongoMemoryServer } = require('mongodb-memory-server');
const studentController = require('../controllers/studentController');
const Student = require('../models/Student');
const Institution = require('../models/Institution');
const Course = require('../models/Course');
const User = require('../models/userModel');

let mongod;
const app = express();
app.use(express.json());
app.get('/api/students/student', studentController.getStudentData);
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

describe('Student Controller', () => {
  describe('getAllStudentsInstitutionsCourses', () => {
    it('Normal case : return the normal value', async () => {
      // Create test data
      const institution = await Institution.create({
        name: 'University A',
        rank: 1,
        address: '123 Main St'
      });

      const course = await Course.create({
        name: 'Computer Science',
        rank: 1,
        duration: 4,
        international_fee: 20000,
        domestic_fee: 10000,
        institution: institution._id
      });

      await Student.create({
        name: 'John Doe',
        institutions: [{
          institution: institution._id,
          courses: [course._id]
        }]
      });

      const req = {};
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      await studentController.getAllStudentsInstitutionsCourses(req, res);

      expect(res.json).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            studentName: 'John Doe',
            institutions: expect.arrayContaining([
              expect.objectContaining({
                institution: expect.objectContaining({
                  name: 'University A',
                  rank: 1,
                  address: '123 Main St'
                }),
                courses: expect.arrayContaining([
                  expect.objectContaining({
                    name: 'Computer Science',
                    rank: 1,
                    duration: 4,
                    international_fee: 20000,
                    domestic_fee: 10000
                  })
                ])
              })
            ])
          })
        ])
      );
    });

    it('Edge case : return 404 when no students are found', async () => {
      const req = {};
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      await studentController.getAllStudentsInstitutionsCourses(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'No students found' });
    });

    it('Edge case : students have no institutions', async () => {
      await Student.create({ name: 'John Doe', institutions: [] });
      
      const req = {};
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      await studentController.getAllStudentsInstitutionsCourses(req, res);

      expect(res.json).toHaveBeenCalledWith(expect.arrayContaining([
        expect.objectContaining({
          studentName: 'John Doe',
          institutions: []
        })
      ]));
    });

    it('Abnormal case : handle errors and return 500 status', async () => {
      // Mock Student.find to throw an error
      jest.spyOn(Student, 'find').mockImplementationOnce(() => {
        throw new Error('Database error');
      });
  
      const req = {};
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
  
      await studentController.getAllStudentsInstitutionsCourses(req, res);
  
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error in getAllStudentsInstitutionsCourses:',
        expect.any(Error)
      );
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Error retrieving data',
        error: 'Database error'
      });
  
      consoleErrorSpy.mockRestore();
      jest.restoreAllMocks();
    });
  });

  describe('getStudentInstitutions', () => {
    it('Normal case : return institutions for a valid student ID', async () => {
      const institution = await Institution.create({
        name: 'University A',
        rank: 1,
        address: '123 Main St'
      });

      const course = await Course.create({
        name: 'Computer Science',
        rank: 1,
        duration: 4,
        international_fee: 20000,
        domestic_fee: 10000,
        institution: institution._id
      });

      const student = await Student.create({
        name: 'John Doe',
        institutions: [{
          institution: institution._id,
          courses: [course._id]
        }]
      });

      const req = { params: { id: student._id.toString() } };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      await studentController.getStudentInstitutions(req, res);

      expect(res.json).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            institution: expect.objectContaining({
              name: 'University A',
              rank: 1,
              address: '123 Main St'
            }),
            courses: expect.arrayContaining([
              expect.objectContaining({
                name: 'Computer Science',
                rank: 1,
                duration: 4,
                international_fee: 20000,
                domestic_fee: 10000
              })
            ])
          })
        ])
      );
    });

    it('Edge case :  return 404 when student is not found', async () => {
      const req = { params: { id: new mongoose.Types.ObjectId().toString() } };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      await studentController.getStudentInstitutions(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Student not found' });
    });

    it('Edge case :  case when student has no institutions', async () => {
      const student = await Student.create({ name: 'Jane Doe', institutions: [] });

      const req = { params: { id: student._id.toString() } };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      await studentController.getStudentInstitutions(req, res);

      expect(res.json).toHaveBeenCalledWith([]);
    });

    
    it('Abnormal case :handle errors and return 500 status', async () => {
      // Mock Student.findById to throw an error
      jest.spyOn(Student, 'findById').mockImplementationOnce(() => {
        throw new Error('Database error');
      });
  
      const req = { params: { id: 'some-id' } };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
  
      await studentController.getStudentInstitutions(req, res);
  
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error in getStudentInstitutions:',
        expect.any(Error)
      );
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Error fetching student institutions',
        error: 'Database error'
      });
  
      consoleErrorSpy.mockRestore();
      jest.restoreAllMocks();
    });
  });

  describe('getStudentData', () => {
    it('Normal case : return student data when valid linking code is provided', async () => {
      const mockStudent = await Student.create({
        name: 'John Doe',
        linkingCode: '123456'
      });

      const req = { query: { linkingCode: '123456' } };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      await studentController.getStudentData(req, res);

      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        name: 'John Doe',
        linkingCode: '123456'
      }));
    });

    it('Abnormal case : return 400 when linking code is not provided', async () => {
      const req = { query: {} };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      await studentController.getStudentData(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Linking code is required' });
    });

    it('Edge case :return 404 when student is not found', async () => {
      const req = { query: { linkingCode: 'nonexistent' } };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      await studentController.getStudentData(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Student not found' });
    });
  });

  describe('getStudentDataById', () => {
    it('Normal case : return student data for a valid ID', async () => {
      const mockStudent = await Student.create({
        name: 'Jane Doe',
      });

      const req = { params: { id: mockStudent._id.toString() } };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      await studentController.getStudentDataById(req, res);

      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        name: 'Jane Doe',
      }));
    });

    it('Abnormal case : return 400 when student ID is not provided', async () => {
      const req = { params: {} };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      await studentController.getStudentDataById(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Student ID is required' });
    });

    it('Edge case : return 404 when student is not found', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const req = { params: { id: nonExistentId.toString() } };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      await studentController.getStudentDataById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Student not found' });
    });

    it('Abnormal case : return 500 when an unexpected error occurs', async () => {
      const mockStudentId = new mongoose.Types.ObjectId();

      // Mock an unexpected error
      jest.spyOn(Student, 'findById').mockImplementationOnce(() => {
        throw new Error('Unexpected error');
      });

      const req = { params: { id: mockStudentId.toString() } };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      await studentController.getStudentDataById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Unexpected error' });

      jest.restoreAllMocks();
    });
  });

  describe('getUserWithChildren', () => {
    it('Normal case : user data with populated children for a valid linking code', async () => {
      const mockStudent1 = await Student.create({ name: 'Child 1' });
      const mockStudent2 = await Student.create({ name: 'Child 2' });
      
      const mockUser = await User.create({
        name: 'Parent User',
        email:'test@gmail.com',
        password:'123456',
        linkingCode: 'PARENT123',
        children: [mockStudent1._id, mockStudent2._id]
      });

      const req = { params: { linkingCode: 'PARENT123' } };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      await studentController.getUserWithChildren(req, res);

      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        name: 'Parent User',
        linkingCode: 'PARENT123',
        children: expect.arrayContaining([
          expect.objectContaining({ name: 'Child 1' }),
          expect.objectContaining({ name: 'Child 2' })
        ])
      }));
    });

    it('Edge case : return 404 when user is not found', async () => {
      const req = { params: { linkingCode: 'NONEXISTENT' } };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      await studentController.getUserWithChildren(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
    });
  });

  it('Normal case :return 500 when an unexpected error occurs', async () => {
    // Mock an unexpected error
    jest.spyOn(User, 'findOne').mockImplementationOnce(() => {
      throw new Error('Unexpected error');
    });

    const req = { params: { linkingCode: 'TEST123' } };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    await studentController.getUserWithChildren(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Server error' });

    jest.restoreAllMocks();
  });
});

describe('GET /student', () => {
  it('Normal case: return student data when valid linking code is provided', async () => {
    const mockStudent = await Student.create({
      name: 'John Doe',
      linkingCode: 'VALID123'
    });

    const res = await request(app)
      .get('/api/students/student')
      .query({ linkingCode: 'VALID123' });

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      name: 'John Doe',
      linkingCode: 'VALID123'
    });
  });

  it('Edge case: return 404 when student is not found', async () => {
    const res = await request(app)
      .get('/api/students/student')
      .query({ linkingCode: 'NONEXISTENT' });

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ message: 'Student not found' });
  });

  it('Abnormal case : return 500 when server error occurs', async () => {
    // Mock a database error
    jest.spyOn(Student, 'findOne').mockImplementationOnce(() => {
      throw new Error('Database error');
    });

    const res = await request(app)
      .get('/api/students/student')
      .query({ linkingCode: 'VALID123' });

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ message: 'Internal server error', error: "Database error" });

    // Restore the original implementation
    jest.spyOn(Student, 'findOne').mockRestore();
  });

  it('Abnormal case :handle missing linking code', async () => {
    const res = await request(app)
      .get('/api/students/student');

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ message: 'Linking code is required' });
  });
});