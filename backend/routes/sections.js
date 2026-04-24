const express = require('express');
const About = require('../models/About');
const Education = require('../models/Education');
const Review = require('../models/Review');
const { authenticate } = require('../middleware/auth');
const router = express.Router();

// ==================== ABOUT SECTION ====================

// @route   GET /api/sections/about
// @desc    Get about section
// @access  Public
router.get('/about', async (req, res) => {
  try {
    let about = await About.findOne();
    
    if (!about) {
      // Create default about if none exists
      about = new About({
        title: 'About Me',
        description: 'Default description',
        stats: [],
        personalInfo: {}
      });
      await about.save();
    }

    res.json({
      success: true,
      data: about
    });
  } catch (error) {
    console.error('Error fetching about:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch about section',
      error: error.message
    });
  }
});

// @route   PUT /api/sections/about
// @desc    Update about section
// @access  Private
router.put('/about', authenticate, async (req, res) => {
  try {
    let about = await About.findOne();

    if (!about) {
      about = new About(req.body);
    } else {
      Object.assign(about, req.body);
    }

    await about.save();

    res.json({
      success: true,
      message: 'About section updated successfully',
      data: about
    });
  } catch (error) {
    console.error('Error updating about:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update about section',
      error: error.message
    });
  }
});

// @route   POST /api/sections/about/images
// @desc    Add image to about section
// @access  Private
router.post('/about/images', authenticate, async (req, res) => {
  try {
    let about = await About.findOne();

    if (!about) {
      about = new About({
        title: 'About Me',
        description: 'Default description',
        stats: [],
        personalInfo: {},
        images: []
      });
    }

    const { url, alt = '', order = about.images.length } = req.body;

    if (!url) {
      return res.status(400).json({
        success: false,
        message: 'Image URL is required'
      });
    }

    about.images.push({ url, alt, order });
    await about.save();

    res.json({
      success: true,
      message: 'Image added successfully',
      data: about
    });
  } catch (error) {
    console.error('Error adding image:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add image',
      error: error.message
    });
  }
});

// @route   DELETE /api/sections/about/images/:imageId
// @desc    Delete image from about section
// @access  Private
router.delete('/about/images/:imageId', authenticate, async (req, res) => {
  try {
    const about = await About.findOne();

    if (!about) {
      return res.status(404).json({
        success: false,
        message: 'About section not found'
      });
    }

    about.images = about.images.filter(
      img => img._id.toString() !== req.params.imageId
    );

    await about.save();

    res.json({
      success: true,
      message: 'Image deleted successfully',
      data: about
    });
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete image',
      error: error.message
    });
  }
});

// ==================== EDUCATION SECTION ====================

// @route   GET /api/sections/education
// @desc    Get education section
// @access  Public
router.get('/education', async (req, res) => {
  try {
    const education = await Education.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      data: education
    });
  } catch (error) {
    console.error('Error fetching education:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch education section',
      error: error.message
    });
  }
});

// @route   POST /api/sections/education
// @desc    Create education entry
// @access  Private
router.post('/education', authenticate, async (req, res) => {
  try {
    const education = new Education(req.body);
    await education.save();

    res.status(201).json({
      success: true,
      message: 'Education entry created successfully',
      data: education
    });
  } catch (error) {
    console.error('Error creating education:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create education entry',
      error: error.message
    });
  }
});

// @route   PUT /api/sections/education/:id
// @desc    Update education entry
// @access  Private
router.put('/education/:id', authenticate, async (req, res) => {
  try {
    const education = await Education.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!education) {
      return res.status(404).json({
        success: false,
        message: 'Education entry not found'
      });
    }

    res.json({
      success: true,
      message: 'Education entry updated successfully',
      data: education
    });
  } catch (error) {
    console.error('Error updating education:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update education entry',
      error: error.message
    });
  }
});

// @route   DELETE /api/sections/education/:id
// @desc    Delete education entry
// @access  Private
router.delete('/education/:id', authenticate, async (req, res) => {
  try {
    const education = await Education.findByIdAndDelete(req.params.id);

    if (!education) {
      return res.status(404).json({
        success: false,
        message: 'Education entry not found'
      });
    }

    res.json({
      success: true,
      message: 'Education entry deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting education:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete education entry',
      error: error.message
    });
  }
});

// ==================== REVIEWS SECTION ====================

// @route   GET /api/sections/reviews
// @desc    Get all reviews
// @access  Public
router.get('/reviews', async (req, res) => {
  try {
    const reviews = await Review.find()
      .sort({ order: 1, createdAt: -1 });

    res.json({
      success: true,
      data: reviews
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reviews',
      error: error.message
    });
  }
});

// @route   POST /api/sections/reviews
// @desc    Create review
// @access  Private
router.post('/reviews', authenticate, async (req, res) => {
  try {
    const review = new Review(req.body);
    await review.save();

    res.status(201).json({
      success: true,
      message: 'Review created successfully',
      data: review
    });
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create review',
      error: error.message
    });
  }
});

// @route   PUT /api/sections/reviews/:id
// @desc    Update review
// @access  Private
router.put('/reviews/:id', authenticate, async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    res.json({
      success: true,
      message: 'Review updated successfully',
      data: review
    });
  } catch (error) {
    console.error('Error updating review:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update review',
      error: error.message
    });
  }
});

// @route   DELETE /api/sections/reviews/:id
// @desc    Delete review
// @access  Private
router.delete('/reviews/:id', authenticate, async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    res.json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete review',
      error: error.message
    });
  }
});

module.exports = router;

