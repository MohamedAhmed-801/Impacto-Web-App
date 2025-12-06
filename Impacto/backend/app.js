// back-end/app.js

const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config(); 

const app = express();
const PORT = process.env.PORT || 3000;

// Import Routers
const adminRoutes = require('./router/adminRoutes');
// const authRoutes = require('./router/authRoutes'); // Placeholder

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/OFDP_DB';

mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('✅ MongoDB connected successfully.');
        
        // Start server after successful DB connection
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port: ${PORT}`);
        });
    })
    .catch(err => {
        console.error('❌ Database connection failed:', err.message);
        process.exit(1);
    });

// API Routes
app.use('/api/admin', adminRoutes);
// app.use('/api/auth', authRoutes); // Placeholder for future auth

// Basic Root route
app.get('/', (req, res) => {
    res.status(200).json({ message: 'OFDP Backend API is running.' });
});

module.exports = app;