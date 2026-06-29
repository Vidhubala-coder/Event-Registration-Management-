const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add an event title'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please add an event description'],
  },
  category: {
    type: String,
    required: [true, 'Please select a category'],
    enum: {
      values: ['Technical', 'Cultural', 'Sports', 'Workshop'],
      message: 'Category must be Technical, Cultural, Sports, or Workshop',
    },
  },
  date: {
    type: Date,
    required: [true, 'Please add an event date'],
  },
  time: {
    type: String,
    required: [true, 'Please add an event time'],
  },
  venue: {
    type: String,
    required: [true, 'Please add an event venue'],
  },
  organiser: {
    type: String,
    required: [true, 'Please specify the organiser name'],
  },
  totalSeats: {
    type: Number,
    required: [true, 'Please specify total seats'],
    min: [1, 'Seats must be at least 1'],
  },
  registeredCount: {
    type: Number,
    default: 0,
    min: 0,
  },
  deadline: {
    type: Date,
    required: [true, 'Please add a registration deadline date'],
  },
  bannerImage: {
    type: String,
    default: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80&w=800',
  },
  eventStatus: {
    type: String,
    enum: ['Upcoming', 'Ongoing', 'Completed', 'Cancelled'],
    default: 'Upcoming',
  },
  tags: {
    type: [String],
    default: [],
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Event', eventSchema);
