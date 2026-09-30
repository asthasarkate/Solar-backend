const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const { analyzeImage, getHistory, getPrediction } = require('../controllers/predictionController');
const { getProfile, updateProfile } = require('../controllers/authController');

router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.post('/analyze', protect, upload.single('image'), analyzeImage);
router.get('/history', protect, getHistory);
router.get('/predictions/:id', protect, getPrediction);

module.exports = router;
