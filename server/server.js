const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();

connectDB();
const allowedOrigins = [
    'http://localhost:5173', // Your local dev environment
    'https://prithu.netlify.app' // Your live Netlify URL
];

const corsOptions = {
  origin: allowedOrigins,
  credentials: true, // This is the crucial line for cookies
};

app.use(cors(corsOptions));


// Init Middleware
app.use(express.json({ extended: false }));
app.use(cookieParser());
app.get('/api/health', (req, res) => res.status(200).json({ status: 'ok' }));

// Define Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/optimize', require('./routes/optimizationRoutes'));
app.use('/api/places', require('./routes/placeRoutes'));
app.use('/api/routes', require('./routes/routeRoutes'));
app.use('/api/feedback', require('./routes/feedbackRoutes'));

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));