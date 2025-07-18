const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = function(req, res, next) {
  console.log('\n--- Auth Middleware Triggered ---');

  const authHeader = req.header('authorization');

  // DEBUG: Log the header as the server sees it
  console.log('1. Received Authorization Header:', authHeader);

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('Error: Header is missing or not a Bearer token.');
    return res.status(401).json({ msg: 'No valid token, authorization denied' });
  }

  const token = authHeader.split(' ')[1];

  // DEBUG: Log the token after extracting it
  console.log('2. Extracted Token:', token);

  // DEBUG: Log the secret key to make sure it's not undefined
  console.log('3. Verifying with secret:', process.env.JWT_ACCESS_SECRET);

  if (!process.env.JWT_ACCESS_SECRET) {
      console.log('FATAL ERROR: JWT_ACCESS_SECRET is not defined in .env file!');
      return res.status(500).send('Server configuration error.');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    console.log('4. Token successfully verified. Decoded payload:', decoded);
    req.user = decoded.user;
    next();
  } catch (err) {
    console.log('5. ERROR: Token verification failed!', err.message);
    res.status(401).json({ msg: 'Token is not valid' });
  }
};