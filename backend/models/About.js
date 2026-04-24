const mongoose = require('mongoose');

const aboutSchema = new mongoose.Schema({
  title: {
    type: String,
    default: 'About Me'
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String,
    default: ''
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    alt: {
      type: String,
      default: ''
    },
    order: {
      type: Number,
      default: 0
    }
  }],
  stats: [{
    number: String,
    label: String,
    icon: String
  }],
  personalInfo: {
    location: String,
    availability: String,
    github: String,
    linkedin: String,
    khamsat: String,
    mostaql: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('About', aboutSchema);

