const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
require('dotenv').config();

const app = express();
connectDB(); // Connect to database

app.use(cors());
app.use(express.json({ extended: false }));

// Define Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/optimize', require('./routes/optimizationRoutes'));
app.use('/api/places', require('./routes/placeRoutes'));
app.use('/api/routes', require('./routes/routeRoutes'));
app.use('/api/feedback', require('./routes/feedbackRoutes'));


const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));