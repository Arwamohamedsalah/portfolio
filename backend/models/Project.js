const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Project title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Project description is required'],
    trim: true,
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  image: {
    type: String,
    required: [true, 'Project image is required'],
    trim: true
  },
  technologies: [{
    type: String,
    trim: true
  }],
  type: {
    type: String,
    enum: ['web', 'mobile', 'ui/ux'],
    required: true,
    default: 'web'
  },
  github: {
    type: String,
    trim: true
  },
  live: {
    type: String,
    trim: true,
    default: '#'
  },
  featured: {
    type: Boolean,
    default: false
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for efficient querying
projectSchema.index({ order: 1, createdAt: -1 });
projectSchema.index({ featured: 1 });

module.exports = mongoose.model('Project', projectSchema);

