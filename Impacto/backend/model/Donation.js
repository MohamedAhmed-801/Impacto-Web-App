// back-end/model/Donation.js

const mongoose = require('mongoose');

const donationStatus = ['Pending', 'Accepted', 'Collected', 'Expired', 'LastOrder', 'Sold'];

const DonationSchema = new mongoose.Schema({
    // FR-6: Donation details
    donor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    foodType: {
        type: String,
        required: true,
        trim: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    expiryTime: { // SR-02: Food safety
        type: Date,
        required: true,
    },
    pickupLocation: {
        type: String, 
        required: true,
        // Will be replaced with Lat/Lng object for Google Maps API later
    },
    
    status: {
        type: String,
        enum: donationStatus,
        default: 'Pending'
    },
    
    // FR-12: Accepted by NGO
    acceptedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    
    // Last Order Fields (FR-21)
    isLastOrder: {
        type: Boolean,
        default: false
    },
    discountRate: { // BR-001: Discount rate
        type: Number,
        default: 0
    },
    originalPrice: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

const Donation = mongoose.model('Donation', DonationSchema);
module.exports = Donation;