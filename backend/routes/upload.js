const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { authenticate } = require('../middleware/auth');
const router = express.Router();

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const fileFilter = (req, file, cb) => {
  // Accept only image files
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: fileFilter
});

// @route   POST /api/upload/image
// @desc    Upload image file
// @access  Private
router.post('/image', authenticate, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided'
      });
    }

    // Return the URL to access the uploaded file
    const fileUrl = `/uploads/${req.file.filename}`;

    res.json({
      success: true,
      message: 'Image uploaded successfully',
      data: {
        url: fileUrl,
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size
      }
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload image',
      error: error.message
    });
  }
});

// @route   DELETE /api/upload/image/:filename
// @desc    Delete uploaded image
// @access  Private
router.delete('/image/:filename', authenticate, (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(uploadsDir, filename);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      res.json({
        success: true,
        message: 'Image deleted successfully'
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Image not found'
      });
    }
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete image',
      error: error.message
    });
  }
});

// @route   POST /api/upload/resume
// @desc    Upload resume/CV file
// @access  Private
const resumeUpload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
      // Always save as resume.pdf (or original extension)
      const ext = path.extname(file.originalname);
      cb(null, 'resume' + ext);
    }
  }),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept PDF and common document formats
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (allowedTypes.includes(file.mimetype) || file.originalname.endsWith('.pdf') || file.originalname.endsWith('.doc') || file.originalname.endsWith('.docx')) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF, DOC, and DOCX files are allowed!'), false);
    }
  }
});

router.post('/resume', authenticate, resumeUpload.single('resume'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No resume file provided'
      });
    }

    const fileUrl = `/uploads/${req.file.filename}`;

    res.json({
      success: true,
      message: 'Resume uploaded successfully',
      data: {
        url: fileUrl,
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size
      }
    });
  } catch (error) {
    console.error('Resume upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload resume',
      error: error.message
    });
  }
});

// @route   GET /api/upload/resume
// @desc    Get resume info
// @access  Public
router.get('/resume', (req, res) => {
  try {
    const resumePath = path.join(uploadsDir, 'resume.pdf');
    const resumeDocPath = path.join(uploadsDir, 'resume.doc');
    const resumeDocxPath = path.join(uploadsDir, 'resume.docx');

    let resumeFile = null;
    if (fs.existsSync(resumePath)) {
      resumeFile = { filename: 'resume.pdf', url: '/uploads/resume.pdf' };
    } else if (fs.existsSync(resumeDocxPath)) {
      resumeFile = { filename: 'resume.docx', url: '/uploads/resume.docx' };
    } else if (fs.existsSync(resumeDocPath)) {
      resumeFile = { filename: 'resume.doc', url: '/uploads/resume.doc' };
    }

    if (resumeFile) {
      const stats = fs.statSync(path.join(uploadsDir, resumeFile.filename));
      res.json({
        success: true,
        data: {
          ...resumeFile,
          size: stats.size,
          uploadedAt: stats.mtime
        }
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'No resume found'
      });
    }
  } catch (error) {
    console.error('Get resume error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get resume',
      error: error.message
    });
  }
});

// @route   DELETE /api/upload/resume
// @desc    Delete resume
// @access  Private
router.delete('/resume', authenticate, (req, res) => {
  try {
    const resumePath = path.join(uploadsDir, 'resume.pdf');
    const resumeDocPath = path.join(uploadsDir, 'resume.doc');
    const resumeDocxPath = path.join(uploadsDir, 'resume.docx');

    let deleted = false;
    if (fs.existsSync(resumePath)) {
      fs.unlinkSync(resumePath);
      deleted = true;
    }
    if (fs.existsSync(resumeDocPath)) {
      fs.unlinkSync(resumeDocPath);
      deleted = true;
    }
    if (fs.existsSync(resumeDocxPath)) {
      fs.unlinkSync(resumeDocxPath);
      deleted = true;
    }

    if (deleted) {
      res.json({
        success: true,
        message: 'Resume deleted successfully'
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Resume not found'
      });
    }
  } catch (error) {
    console.error('Delete resume error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete resume',
      error: error.message
    });
  }
});

module.exports = router;

