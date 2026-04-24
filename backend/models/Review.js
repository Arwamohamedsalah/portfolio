const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Reviewer name is required'],
    trim: true
  },
  role: {
    type: String,
    trim: true
  },
  company: {
    type: String,
    trim: true
  },
  content: {
    type: String,
    required: [true, 'Review content is required'],
    trim: true,
    maxlength: [1000, 'Review cannot exceed 1000 characters']
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: 5
  },
  avatar: {
    type: String,
    default: ''
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
reviewSchema.index({ order: 1, createdAt: -1 });
reviewSchema.index({ featured: 1 });

module.exports = mongoose.model('Review', reviewSchema);

