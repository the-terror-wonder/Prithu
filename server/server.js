const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Connect to Database
connectDB();

// --- NEW, SIMPLIFIED CORS CONFIGURATION ---
// This tells the server to accept requests from ANY origin.
// This is the most reliable way to solve stubborn deployment CORS issues.
app.use(cors());
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