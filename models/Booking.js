const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    // User Information
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    userEmail: {
        type: String,
        required: true
    },
    userPhone: {
        type: String,
        required: true
    },
    
    // Room Information
    roomType: {
        type: String,
        required: [true, 'Room type is required'],
        enum: ['Deluxe Room', 'Executive Suite', 'Presidential Suite', 'Standard Room', 'Family Room']
    },
    roomNumber: {
        type: String
    },
    
    // Booking Details
    checkInDate: {
        type: Date,
        required: [true, 'Check-in date is required']
    },
    checkOutDate: {
        type: Date,
        required: [true, 'Check-out date is required']
    },
    numberOfGuests: {
        type: Number,
        required: [true, 'Number of guests is required'],
        min: 1
    },
    numberOfRooms: {
        type: Number,
        required: true,
        default: 1,
        min: 1
    },
    
    // Pricing
    pricePerNight: {
        type: Number,
        required: true
    },
    totalNights: {
        type: Number,
        required: true
    },
    totalPrice: {
        type: Number,
        required: true
    },
    
    // Status
    status: {
        type: String,
        enum: ['Pending', 'Confirmed', 'Cancelled', 'Completed'],
        default: 'Pending'
    },
    
    // Special Requests
    specialRequests: {
        type: String,
        default: ''
    },
    
    // Timestamps
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Validate check-out date is after check-in date
bookingSchema.pre('save', function(next) {
    if (this.checkOutDate <= this.checkInDate) {
        next(new Error('Check-out date must be after check-in date'));
    }
    next();
});

module.exports = mongoose.model('Booking', bookingSchema);
