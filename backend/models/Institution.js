// models/Institution.js
const mongoose = require('mongoose');

const InstitutionSchema = new mongoose.Schema({
  name: String,
  rank: Number,
  address: String,
  courses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }]
});

module.exports = mongoose.model('Institution', InstitutionSchema);