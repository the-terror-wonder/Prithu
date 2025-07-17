const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { optimizeRoute } = require('../controllers/optimizationController');

// Protect this route with auth middleware
router.post('/', auth, optimizeRoute);

module.exports = router;