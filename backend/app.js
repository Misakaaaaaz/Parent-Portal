const express = require('express');
const cors = require('cors');
const studentRoutes = require('./routes/studentRoutes');
const eventRoutes = require('./routes/eventRoutes');
const careerFieldRoutes = require('./routes/careerFieldRoutes');
const userRouter = require('./routes/userRouter');
const sectionRoutes = require('./routes/sections');

const app = express();

app.use(cors());
app.use(express.json());

// Basic route to check server status
app.get('/', (req, res) => {
  res.send('Hello from Express!');
});

app.use('/api/users', userRouter);
app.use('/api', studentRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/career-fields', careerFieldRoutes);
app.use('/api', sectionRoutes);

app.get('/api/test-error', (req, res, next) => {
  next(new Error('Test error'));
});

// Global error handler
app.use((err, req, res, next) => {
  res.status(500).send({message: err.message});
});

module.exports = app;