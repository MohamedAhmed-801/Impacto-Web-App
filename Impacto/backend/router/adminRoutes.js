// back-end/router/adminRoutes.js

const express = require('express');
const { 
    getAllUsers, 
    updateUser,
    suspendUser, 
    deleteUser,
    getAllDonations,
    getAllOrders
} = require('../controller/AdminController');
const router = express.Router();

// --- Authentication Middleware Placeholder ---
// NOTE: We assume middleware (e.g., protect and restrictTo('Admin')) will be added here 
// to ensure only authenticated admins can access these routes.
// Example: router.use(protect, restrictTo('Admin')); 

// User Management Routes (FR-1, FR-4)
router.get('/users', getAllUsers);             // View all users
router.put('/users/:userId', updateUser);      // Update user details, role, or NGO status
router.post('/users/suspend/:userId', suspendUser); // Suspend user
router.delete('/users/:userId', deleteUser);   // Delete user

// Monitoring and Reporting Routes (FR-2)
router.get('/donations', getAllDonations);  // Monitor all donations
router.get('/orders', getAllOrders);        // Monitor all transactions

module.exports = router;