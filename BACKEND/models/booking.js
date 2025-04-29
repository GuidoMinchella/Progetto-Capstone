// backend/models/Booking.js
const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  carId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Auto',
    required: true
  },
  carModel: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  rentalType: {
    type: String,
    enum: ['svago', 'lavoro', 'altro'],
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  paymentInfo: {
    cardName: { type: String },
    lastFourDigits: { type: String },
    expiryDate: { type: String }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
