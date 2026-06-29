const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true,
  },
  studentName: {
    type: String,
    required: [true, 'Please add student name'],
    trim: true,
  },
  rollNumber: {
    type: String,
    required: [true, 'Please add roll number'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please add email address'],
    trim: true,
    lowercase: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email',
    ],
  },
  phone: {
    type: String,
    required: [true, 'Please add phone number'],
  },
  department: {
    type: String,
    required: [true, 'Please select department'],
  },
  registeredAt: {
    type: Date,
    default: Date.now,
  },
  qrCode: {
    type: String, // Will store Base64 Data URL of the QR code
  },
  registrationStatus: {
    type: String,
    enum: ['Confirmed', 'Cancelled'],
    default: 'Confirmed',
  },
  attendanceStatus: {
    type: String,
    enum: ['Pending', 'Present', 'Absent'],
    default: 'Pending',
  },
}, {
  timestamps: true,
});

// Ensure a student can only register once per event using their email
registrationSchema.index({ eventId: 1, email: 1 }, { unique: true });

module.exports = mongoose.model('Registration', registrationSchema);
