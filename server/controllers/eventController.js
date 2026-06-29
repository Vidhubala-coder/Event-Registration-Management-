const Event = require('../models/Event');
const Registration = require('../models/Registration');

/**
 * @desc    Create a new event
 * @route   POST /api/events
 * @access  Private (Admin)
 */
exports.createEvent = async (req, res, next) => {
  try {
    const event = await Event.create(req.body);
    
    // Broadcast via socket if available
    const io = req.app.get('socketio');
    if (io) {
      io.emit('eventCreated', event);
    }

    res.status(201).json({
      success: true,
      data: event,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all events with filters, search, and pagination
 * @route   GET /api/events
 * @access  Public
 */
exports.getEvents = async (req, res, next) => {
  try {
    const { category, upcoming, search, sort, page = 1, limit = 6 } = req.query;

    // Build query object
    const query = {};

    // Filter by Category
    if (category && category !== 'All') {
      query.category = category;
    }

    // Filter upcoming events
    if (upcoming === 'true') {
      query.date = { $gte: new Date() };
    }

    // Search by title or tags
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    // Convert page and limit parameters
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    // Find documents query
    let result = Event.find(query);

    // Sorting
    if (sort === 'oldest') {
      result = result.sort({ date: 1 });
    } else if (sort === 'seats') {
      result = result.sort({ totalSeats: -1 });
    } else if (sort === 'soonest') {
      result = result.sort({ date: 1 });
    } else {
      // Default: latest created
      result = result.sort({ createdAt: -1 });
    }

    // Pagination
    result = result.skip(skip).limit(limitNum);

    // Run query
    const events = await result;

    // Total count for pagination metadata
    const total = await Event.countDocuments(query);

    res.status(200).json({
      success: true,
      count: events.length,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(total / limitNum),
        totalEvents: total,
        hasMore: skip + events.length < total,
      },
      data: events,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single event by ID
 * @route   GET /api/events/:id
 * @access  Public
 */
exports.getEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    res.status(200).json({
      success: true,
      data: event,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update an event
 * @route   PUT /api/events/:id
 * @access  Private (Admin)
 */
exports.updateEvent = async (req, res, next) => {
  try {
    let event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    // Broadcast via socket if available
    const io = req.app.get('socketio');
    if (io) {
      io.emit('eventUpdated', event);
    }

    res.status(200).json({
      success: true,
      data: event,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete an event and its registrations
 * @route   DELETE /api/events/:id
 * @access  Private (Admin)
 */
exports.deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    // Delete all registrations for this event
    await Registration.deleteMany({ eventId: req.params.id });

    // Delete the event itself
    await Event.findByIdAndDelete(req.params.id);

    // Broadcast via socket if available
    const io = req.app.get('socketio');
    if (io) {
      io.emit('eventDeleted', req.params.id);
    }

    res.status(200).json({
      success: true,
      message: 'Event and all its registrations have been deleted',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get dashboard statistics
 * @route   GET /api/events/dashboard/stats
 * @access  Private (Admin)
 */
exports.getDashboardStats = async (req, res, next) => {
  try {
    const totalEvents = await Event.countDocuments();
    const upcomingEvents = await Event.countDocuments({ date: { $gte: new Date() } });
    const totalRegistrations = await Registration.countDocuments({ registrationStatus: 'Confirmed' });
    
    // Aggregation for categories distribution
    const categoryStats = await Event.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
        },
      },
    ]);

    // Sum up total seats and registered counts
    const seatAgg = await Event.aggregate([
      {
        $group: {
          _id: null,
          totalSeats: { $sum: '$totalSeats' },
          registeredCount: { $sum: '$registeredCount' },
        },
      },
    ]);

    const seatsInfo = seatAgg[0] || { totalSeats: 0, registeredCount: 0 };
    const availableSeats = Math.max(0, seatsInfo.totalSeats - seatsInfo.registeredCount);

    // Recent registrations list (last 5)
    const recentRegistrations = await Registration.find({ registrationStatus: 'Confirmed' })
      .populate('eventId', 'title category date')
      .sort({ createdAt: -1 })
      .limit(5);

    // Event registration rates (top 5 events by popularity)
    const popularEvents = await Event.find()
      .sort({ registeredCount: -1 })
      .limit(5)
      .select('title registeredCount totalSeats category');

    res.status(200).json({
      success: true,
      stats: {
        totalEvents,
        upcomingEvents,
        totalRegistrations,
        availableSeats,
        totalSeats: seatsInfo.totalSeats,
        occupiedSeats: seatsInfo.registeredCount,
      },
      categoryStats,
      recentRegistrations,
      popularEvents,
    });
  } catch (error) {
    next(error);
  }
};
