const express = require('express');
const {
  createRegistration,
  getRegistrations,
  getRegistration,
  getMyRegistrations,
  cancelRegistration,
  updateAttendance,
} = require('../controllers/registrationController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Public / Student routes
router.post('/', createRegistration);
router.get('/student', getMyRegistrations);
router.get('/:id', getRegistration);
router.delete('/:id', cancelRegistration);

// Admin-only routes
router.get('/', protect, authorize('admin'), getRegistrations);
router.put('/:id/attendance', protect, authorize('admin'), updateAttendance);

module.exports = router;
