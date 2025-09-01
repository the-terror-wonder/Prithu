console.log("--- Loading Optimization Routes ---");

const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { optimizeRoute,snapToRoad } = require('../controllers/optimizationController');

// Protect this route with auth middleware
router.post('/', auth, optimizeRoute);
router.post('/nearest', auth, snapToRoad);

module.exports = router;