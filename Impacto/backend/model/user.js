// back-end/model/User.js

const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs'); // Will be used for authentication later

const userRoles = ['Admin', 'NGO', 'Donor', 'Public-User', 'Hotel', 'Delivery-Courier'];
const ngoStatuses = ['Pending', 'Approved', 'Rejected'];

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true, 
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: userRoles, 
        required: true
    },
    isActive: { // FR-4: Suspend/Deactivate user
        type: Boolean,
        default: true
    },
    phone: {
        type: String,
        trim: true
    },
    address: {
        type: String,
        trim: true
    },
    // NGO Specific Fields (SR-04: Verify identity)
    registrationNumber: {
        type: String,
        default: null,
    },
    ngoStatus: {
        type: String,
        enum: ngoStatuses,
        default: 'Pending',
        required: function() { return this.role === 'NGO'; } // Required only for NGOs
    },
}, {
    timestamps: true 
});

// Pre-save hook for password hashing (Will be added in Auth phase)
/* userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});
*/

const User = mongoose.model('User', userSchema);
module.exports = User;