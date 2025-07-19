const express = require('express');
const router = express.Router();
const { sendFeedback } = require('../controllers/feedbackController');

// @route   POST api/feedback
// @desc    Send feedback email
// @access  Public
router.post('/', sendFeedback);

module.exports = router;