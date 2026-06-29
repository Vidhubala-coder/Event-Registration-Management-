const Registration = require('../models/Registration');
const Event = require('../models/Event');
const generateQRCode = require('../utils/qrGenerator');
const { sendConfirmationEmail } = require('../utils/emailService');

/**
 * @desc    Register for an event
 * @route   POST /api/registrations
 * @access  Public / Student
 */
exports.createRegistration = async (req, res, next) => {
  try {
    const { eventId, studentName, rollNumber, email, phone, department } = req.body;

    // Validate if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    // Check if event is cancelled or completed
    if (event.eventStatus === 'Cancelled') {
      return res.status(400).json({ success: false, message: 'This event has been cancelled' });
    }
    if (event.eventStatus === 'Completed') {
      return res.status(400).json({ success: false, message: 'This event has already completed' });
    }

    // Check registration deadline
    if (new Date() > new Date(event.deadline)) {
      return res.status(400).json({ success: false, message: 'Registration deadline has passed for this event' });
    }

    // Check if seats are full
    if (event.registeredCount >= event.totalSeats) {
      return res.status(400).json({ success: false, message: 'Registration full. No seats available' });
    }

    // Check for duplicate registration on this event with same email
    const duplicate = await Registration.findOne({ eventId, email: email.toLowerCase() });
    if (duplicate) {
      return res.status(400).json({ 
        success: false, 
        message: 'You have already registered for this event with this email address' 
      });
    }

    // Create registration (without QR code first, to get the registration ID)
    const registration = new Registration({
      eventId,
      studentName,
      rollNumber,
      email: email.toLowerCase(),
      phone,
      department,
      registrationStatus: 'Confirmed',
      attendanceStatus: 'Pending',
    });

    // Generate QR code with registration info
    const qrData = JSON.stringify({
      registrationId: registration._id,
      studentName,
      rollNumber,
      eventTitle: event.title,
    });
    
    const qrCodeUrl = await generateQRCode(qrData);
    registration.qrCode = qrCodeUrl;

    // Save registration
    await registration.save();

    // Increment registeredCount using MongoDB $inc operator
    const updatedEvent = await Event.findByIdAndUpdate(
      eventId,
      { $inc: { registeredCount: 1 } },
      { new: true }
    );

    // Send confirmation email
    await sendConfirmationEmail(registration, updatedEvent);

    // Broadcast seat availability update via Socket.IO
    const io = req.app.get('socketio');
    if (io) {
      io.emit('seatUpdate', {
        eventId: eventId,
        registeredCount: updatedEvent.registeredCount,
        totalSeats: updatedEvent.totalSeats
      });
    }

    res.status(201).json({
      success: true,
      message: 'Registration successful! Confirmation email has been sent.',
      data: registration,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all registrations
 * @route   GET /api/registrations
 * @access  Private (Admin)
 */
exports.getRegistrations = async (req, res, next) => {
  try {
    const { eventId } = req.query;
    const query = {};

    if (eventId) {
      query.eventId = eventId;
    }

    const registrations = await Registration.find(query)
      .populate('eventId', 'title category date venue time')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: registrations.length,
      data: registrations,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get one registration by ID
 * @route   GET /api/registrations/:id
 * @access  Public / Student / Admin
 */
exports.getRegistration = async (req, res, next) => {
  try {
    const registration = await Registration.findById(req.params.id)
      .populate('eventId', 'title description category date venue time organiser bannerImage eventStatus');

    if (!registration) {
      return res.status(404).json({ success: false, message: 'Registration not found' });
    }

    res.status(200).json({
      success: true,
      data: registration,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get student registrations by email
 * @route   GET /api/registrations/student
 * @access  Public / Student
 */
exports.getMyRegistrations = async (req, res, next) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Please provide email query parameter' });
    }

    const registrations = await Registration.find({ email: email.toLowerCase() })
      .populate('eventId')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: registrations.length,
      data: registrations,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Cancel registration
 * @route   DELETE /api/registrations/:id
 * @access  Public / Student / Admin
 */
exports.cancelRegistration = async (req, res, next) => {
  try {
    const registration = await Registration.findById(req.params.id);

    if (!registration) {
      return res.status(404).json({ success: false, message: 'Registration ticket not found' });
    }

    const eventId = registration.eventId;

    // Check if event exists
    const event = await Event.findById(eventId);

    // Delete the registration
    await Registration.findByIdAndDelete(req.params.id);

    // Decrement registeredCount using $inc: -1 operator if event exists
    let updatedEvent = null;
    if (event) {
      updatedEvent = await Event.findByIdAndUpdate(
        eventId,
        { $inc: { registeredCount: -1 } },
        { new: true }
      );
    }

    // Broadcast seat availability update via Socket.IO
    const io = req.app.get('socketio');
    if (io && event && updatedEvent) {
      io.emit('seatUpdate', {
        eventId: eventId,
        registeredCount: updatedEvent.registeredCount,
        totalSeats: updatedEvent.totalSeats
      });
    }

    res.status(200).json({
      success: true,
      message: 'Registration has been successfully cancelled.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update attendance status
 * @route   PUT /api/registrations/:id/attendance
 * @access  Private (Admin)
 */
exports.updateAttendance = async (req, res, next) => {
  try {
    const { attendanceStatus } = req.body;

    if (!['Pending', 'Present', 'Absent'].includes(attendanceStatus)) {
      return res.status(400).json({ success: false, message: 'Invalid attendance status value' });
    }

    const registration = await Registration.findByIdAndUpdate(
      req.params.id,
      { attendanceStatus },
      { new: true }
    ).populate('eventId', 'title date');

    if (!registration) {
      return res.status(404).json({ success: false, message: 'Registration not found' });
    }

    res.status(200).json({
      success: true,
      message: `Attendance status marked as ${attendanceStatus}`,
      data: registration,
    });
  } catch (error) {
    next(error);
  }
};
