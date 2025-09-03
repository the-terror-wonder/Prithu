const express = require('express');
const router = express.Router();
const { register, login,logout ,checkUser} = require('../controllers/authController');
const auth = require('../middleware/authMiddleware');
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', auth, checkUser);
module.exports = router;