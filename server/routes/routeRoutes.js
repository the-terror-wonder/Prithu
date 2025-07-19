const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { getRoutes, saveRoute, deleteRoute } = require('../controllers/routeController');

router.route('/')
    .get(auth, getRoutes)
    .post(auth, saveRoute);

router.route('/:id')
    .delete(auth, deleteRoute);

module.exports = router;