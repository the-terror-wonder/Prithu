const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { getPlaces, savePlace,deletePlace } = require('../controllers/placeController');

// Defines GET /api/places and POST /api/places
// Both routes are protected by the auth middleware
router.route('/')
    .get(auth, getPlaces)
    .post(auth, savePlace);

router.delete('/:id', auth, deletePlace);

module.exports = router;