const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { optimizeRoute, snapToRoad } = require('../controllers/optimizationController');

// This confirms the file is being read
console.log("SUCCESS: optimizationRoutes.js has been loaded.");

// Defines the main optimization route
router.post('/', auth, optimizeRoute);

// Defines the snap-to-road route
router.post('/nearest', auth, snapToRoad);

module.exports = router;