const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });

  console.log('App middleware stack:',
    app._router.stack.map(layer => ({
      name: layer.name,
      regexp: layer.regexp.toString()
    }))
  );
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Server', () => {
  it('responds to / with Hello from Express!', async () => {
    const response = await request(app).get('/');
    console.log('Root route response:', {
      status: response.status,
      body: response.body,
      text: response.text,
      headers: response.headers
    });
    expect(response.status).toBe(200);
    expect(response.text).toBe('Hello from Express!');
  });

  it('responds with 404 for undefined routes', async () => {
    const response = await request(app).get('/undefined-route');
    expect(response.status).toBe(404);
  });

  it('uses CORS', async () => {
    const response = await request(app).get('/');
    expect(response.headers['access-control-allow-origin']).toBe('*');
  });

  it('lists all routes', () => {
    const routes = app._router.stack
      .filter(r => r.route)
      .map(r => ({
        path: r.route.path,
        methods: Object.keys(r.route.methods)
      }));
    console.log('Defined routes:', JSON.stringify(routes, null, 2));
    expect(routes.some(r => r.path === '/')).toBe(true);
  });
});

describe('API Routes', () => {
  it('responds to /api/users', async () => {
    const response = await request(app).get('/api/users');
    console.log('/api/users response:', {
      status: response.status,
      body: response.body,
      text: response.text,
      headers: response.headers
    });
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});

describe('Error Handling', () => {
  it('handles errors with 500 status', async () => {
    const response = await request(app).get('/api/test-error');
    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('message');
  });
});

// ... rest of the test file remains the same