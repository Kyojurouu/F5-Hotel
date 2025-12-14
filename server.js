require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// Import routes
const authRoutes = require('./routes/auth');
const bookingRoutes = require('./routes/bookings');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname)));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);

// MongoDB Connection (accept both MONGODB_URI and MONGO_URI for convenience)
const mongoURI = process.env.MONGODB_URI || process.env.MONGO_URI;
if (!mongoURI) {
    console.error('✗ MONGODB_URI (or MONGO_URI) not defined in .env');
    process.exit(1);
}

// FIXED: Removed deprecated options
mongoose.connect(mongoURI)
.then(() => {
    console.log('✓ Connected to MongoDB Atlas successfully');
})
.catch(err => {
    console.error('✗ MongoDB connection error:', err.message);
    process.exit(1);
});

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

const PORT = process.env.PORT || 3000;

// FIXED: Added error handling for EADDRINUSE
const server = app.listen(PORT, () => {
    console.log(`✓ Server running on http://localhost:${PORT}`);
    console.log(`✓ Frontend: http://localhost:${PORT}/login.html`);
    console.log(`✓ API: http://localhost:${PORT}/api/auth`);
}).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`✗ Port ${PORT} is already in use!`);
        console.error('  Solutions:');
        console.error(`  1. Stop the process using port ${PORT}`);
        console.error(`  2. Use a different port: PORT=3002 npm start`);
        console.error(`  3. Run: taskkill /IM node.exe /F (Windows)`);
        process.exit(1);
    } else {
        console.error('✗ Server error:', err.message);
        process.exit(1);
    }
});