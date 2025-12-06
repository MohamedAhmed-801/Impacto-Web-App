// back-end/controller/AdminController.js

const User = require('../model/User');
const Donation = require('../model/Donation');
const Order = require('../model/Order');
const mongoose = require('mongoose');

// Helper function to validate ObjectId
const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

// --- User Management (FR-1, FR-4) ---

// @desc    Get all users (excluding Admin role)
// @route   GET /api/admin/users
// @access  Private (Admin Only)
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({ role: { $ne: 'Admin' } })
            .select('-password'); 

        res.status(200).json({
            success: true,
            count: users.length,
            data: users
        });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch users.' });
    }
};

// @desc    Update a user's role, status, or NGO status
// @route   PUT /api/admin/users/:userId
// @access  Private (Admin Only)
exports.updateUser = async (req, res) => {
    const { userId } = req.params;
    const { role, isActive, ngoStatus } = req.body;

    if (!isValidId(userId)) {
        return res.status(400).json({ success: false, message: 'Invalid User ID.' });
    }

    try {
        const updateFields = {};
        if (role) updateFields.role = role;
        if (typeof isActive === 'boolean') updateFields.isActive = isActive;
        if (ngoStatus) { // Handles NGO approval (SR-04)
             updateFields.ngoStatus = ngoStatus;
             // Ensure status is valid for NGO role
             if (!['Pending', 'Approved', 'Rejected'].includes(ngoStatus)) {
                return res.status(400).json({ success: false, message: 'Invalid NGO status.' });
             }
        }

        const user = await User.findByIdAndUpdate(
            userId,
            updateFields,
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        res.status(200).json({
            success: true,
            message: `User ${user.email} updated successfully.`,
            data: user
        });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to update user.' });
    }
};

// @desc    Suspend/Deactivate a user account (Specific function for FR-4)
// @route   POST /api/admin/users/suspend/:userId
// @access  Private (Admin Only)
exports.suspendUser = async (req, res) => {
    const { userId } = req.params;

    if (!isValidId(userId)) {
        return res.status(400).json({ success: false, message: 'Invalid User ID.' });
    }
    
    try {
        const user = await User.findByIdAndUpdate(
            userId,
            { isActive: false }, 
            { new: true }       
        ).select('-password');

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        if (user.role === 'Admin') {
            return res.status(403).json({ success: false, message: 'Cannot suspend an Admin account.' });
        }

        res.status(200).json({
            success: true,
            message: `User ${user.email} account suspended.`,
            data: user
        });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to suspend user account.' });
    }
};

// @desc    Delete a user account
// @route   DELETE /api/admin/users/:userId
// @access  Private (Admin Only)
exports.deleteUser = async (req, res) => {
    const { userId } = req.params;

    if (!isValidId(userId)) {
        return res.status(400).json({ success: false, message: 'Invalid User ID.' });
    }

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }
        
        if (user.role === 'Admin') {
            return res.status(403).json({ success: false, message: 'Cannot delete an Admin account.' });
        }
        
        // Delete related data (Donations, Orders) for data integrity
        await Donation.deleteMany({ donor: userId });
        await Order.deleteMany({ customer: userId });

        await User.findByIdAndDelete(userId);

        res.status(200).json({
            success: true,
            message: `User ${user.email} and related data deleted successfully.`
        });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to delete user.' });
    }
};

// --- Monitoring and Reporting (FR-2) ---

// @desc    Monitor all ongoing donations and transactions
// @route   GET /api/admin/donations
// @access  Private (Admin Only)
exports.getAllDonations = async (req, res) => {
    try {
        // FR-2: Monitor all donations and transactions
        const donations = await Donation.find({})
            .populate('donor', 'name email role') // Show donor name and email
            .populate('acceptedBy', 'name email role'); // Show NGO name and email

        res.status(200).json({
            success: true,
            count: donations.length,
            data: donations
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch donations.' });
    }
};

// @desc    Monitor all Last Order sales (Transactions)
// @route   GET /api/admin/orders
// @access  Private (Admin Only)
exports.getAllOrders = async (req, res) => {
    try {
        // FR-2: Monitor all transactions
        const orders = await Order.find({})
            .populate('customer', 'name email role') // Show customer info
            .populate('donationItem', 'foodType originalPrice'); // Show item details

        res.status(200).json({
            success: true,
            count: orders.length,
            data: orders
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch orders/transactions.' });
    }
};