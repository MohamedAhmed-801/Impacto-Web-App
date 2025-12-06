// back-end/model/Order.js

const mongoose = require('mongoose');

const orderStatus = ['Pending Payment', 'Processing', 'Paid', 'Shipped', 'Delivered', 'Cancelled'];

const OrderSchema = new mongoose.Schema({
    // FR-18: Purchase by Public User or Hotel
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    donationItem: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Donation',
        required: true
    },
    transactionId: { // FR-51: Payment Gateway ID
        type: String, 
        required: true,
        unique: true
    },
    totalAmount: {
        type: Number,
        required: true
    },
    deliveryFee: { // BR-003: Delivery fees
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: orderStatus,
        default: 'Pending Payment'
    },
    deliveryAddress: {
        type: String,
        required: true
    },
    courier: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    isPaymentSecured: { // SEC-02: Secure payment compliance
        type: Boolean, 
        default: false
    }
}, {
    timestamps: true
});

const Order = mongoose.model('Order', OrderSchema);
module.exports = Order;