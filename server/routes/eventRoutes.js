const express = require('express');
const {
  createEvent,
  getEvents,
  getEvent,
  updateEvent,
  deleteEvent,
  getDashboardStats,
} = require('../controllers/eventController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.get('/', getEvents);
router.get('/:id', getEvent);

// Protected routes (Admin only)
router.post('/', protect, authorize('admin'), createEvent);
router.get('/dashboard/stats', protect, authorize('admin'), getDashboardStats);
router.put('/:id', protect, authorize('admin'), updateEvent);
router.delete('/:id', protect, authorize('admin'), deleteEvent);

module.exports = router;
