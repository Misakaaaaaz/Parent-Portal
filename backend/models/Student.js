const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
  name: String,
  age: Number,
  schoolName: String,
  class: String,
  grade: Number,
  recentEmotion: {
    ExtraSad: Number,
    Sad: Number,
    Neutral: Number,
    Happy: Number,
    ExtraHappy: Number
  },
  interests: [{
    _id: mongoose.Schema.Types.ObjectId,
    code: String,
    name: String
  }],
  recentPerformance: [{
    Term: String,
    Student: Number,
    Course1: Number,
    Course2: Number,
    Course3: Number
  }],
  linkingCode: String,
  parents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  imageURL: String,
  subjects: [{
    name: String,
    mark: Number,
    max: Number,
    median: Number,
    min: Number,
    q1: Number,
    q3: Number
  }],
  institutions: [{
    institution: { type: mongoose.Schema.Types.ObjectId, ref: 'Institution' },
    courses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }]
  }]
});

module.exports = mongoose.model('Student', StudentSchema);