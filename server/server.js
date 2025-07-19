const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Connect to Database
connectDB();

// --- NEW, SIMPLIFIED CORS CONFIGURATION ---
const allowedOrigins = [
    'http://localhost:5173', // For your local development
    'https://prithu.netlify.app' // IMPORTANT: YOUR LIVE NETLIFY URL
];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests if the origin is in our list, or if there's no origin (like from a mobile app)
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};

app.use(cors(corsOptions));
// --- END OF NEW CORS CONFIGURATION ---

// Init Middleware
app.use(express.json({ extended: false }));

// Define Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/optimize', require('./routes/optimizationRoutes'));
app.use('/api/places', require('./routes/placeRoutes'));
app.use('/api/routes', require('./routes/routeRoutes'));
app.use('/api/feedback', require('./routes/feedbackRoutes'));

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));