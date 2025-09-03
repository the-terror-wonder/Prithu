const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const sendTokenCookie = (user, statusCode, res) => {
    const payload = { user: { id: user.id } };
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: '15m' });

    const cookieOptions = {
        expires: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
        httpOnly: true, // Most important: Prevents JS access
        secure: true, // Only send over HTTPS in production
        sameSite: 'none'
    };

    res.status(statusCode)
       .cookie('accessToken', accessToken, cookieOptions)
       .json({ success: true, user: { id: user.id, username: user.username } });
};

exports.register = async (req, res) => {
    const { username, password } = req.body;
    try {
        let user = await User.findOne({ username });
        if (user) return res.status(400).json({ msg: 'User already exists' });
        user = new User({ username, password });
        user.password = await bcrypt.hash(password, 10);
        await user.save();
        sendTokenCookie(user, 201, res);
    } catch (err) { res.status(500).send('Server error'); }
};

exports.login = async (req, res) => {
    const { username, password } = req.body;
    try {
        let user = await User.findOne({ username });
        if (!user) return res.status(400).json({ msg: 'Invalid Credentials' });
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid Credentials' });
        sendTokenCookie(user, 200, res);
    } catch (err) { res.status(500).send('Server error'); }
};

exports.logout = (req, res) => {
    res.cookie('accessToken', 'loggedout', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
    });
    res.status(200).json({ success: true, message: 'User logged out successfully' });
};

// Add this function at the bottom of authController.js
exports.checkUser = async (req, res) => {
    // If the authMiddleware succeeds, req.user will be attached.
    // We just need to find the full user details to send back.
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};