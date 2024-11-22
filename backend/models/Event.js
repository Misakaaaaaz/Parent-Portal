// Event.js
const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
  eventName: String,
  startDate: Date,
  endDate: Date,
  eventType: String,
  location: String
}, { collection: 'Events' });

module.exports = mongoose.model('Event', eventSchema);
