console.log("--- Server process started ---");

const express = require('express');
console.log("1. Express loaded successfully.");

const connectDB = require('./config/db');
console.log("2. DB config loaded.");

const cors = require('cors');
require('dotenv').config();
console.log("3. CORS and dotenv loaded.");

const app = express();
console.log("4. Express app initialized.");

// Connect to Database
connectDB(); // This function has its own "MongoDB Connected..." log

// CORS Configuration
const allowedOrigins = [
    'http://localhost:5173',
    'https://your-netlify-site-name.netlify.app' // IMPORTANT: YOUR LIVE NETLIFY URL
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('CORS policy violation'));
    }
  }
}));
console.log("5. CORS configured.");

// Init Middleware
app.use(express.json({ extended: false }));
console.log("6. JSON middleware initialized.");

// Define Routes
console.log("7. Attempting to define routes...");
app.use('/api/auth', require('./routes/authRoutes'));
console.log("   - /api/auth route defined.");
app.use('/api/optimize', require('./routes/optimizationRoutes'));
console.log("   - /api/optimize route defined.");
app.use('/api/places', require('./routes/placeRoutes'));
console.log("   - /api/places route defined.");
app.use('/api/routes', require('./routes/routeRoutes'));
console.log("   - /api/routes route defined.");
app.use('/api/feedback', require('./routes/feedbackRoutes'));
console.log("   - /api/feedback route defined.");
console.log("8. All routes defined successfully.");

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => console.log(`--- Server successfully started on port ${PORT} ---`));