const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  name: String,
  rank: Number,
  duration: Number,
  international_fee: Number,
  domestic_fee: Number,
  institution: { type: mongoose.Schema.Types.ObjectId, ref: 'Institution' }
});

module.exports = mongoose.model('Course', CourseSchema);