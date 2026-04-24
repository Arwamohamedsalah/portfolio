const mongoose = require('mongoose');

const educationSchema = new mongoose.Schema({
  institution: {
    type: String,
    required: true
  },
  degree: {
    type: String,
    required: true
  },
  duration: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  tracks: [{
    title: String,
    duration: String,
    period: String,
    description: String,
    skills: [{
      name: String,
      category: String
    }]
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Education', educationSchema);

