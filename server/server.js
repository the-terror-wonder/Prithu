const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Connect to Database
connectDB();

// --- CORS Configuration ---
// This allows your live frontend to communicate with this backend.
const allowedOrigins = [
    'http://localhost:5173', // Your local dev environment
    'https://prithu.netlify.app' // IMPORTANT: YOUR LIVE NETLIFY URL
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));

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