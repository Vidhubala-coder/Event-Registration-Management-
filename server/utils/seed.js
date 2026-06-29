const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Event = require('../models/Event');
const Registration = require('../models/Registration');

// Load env vars
dotenv.config();

const mockEvents = [
  {
    title: 'Hackathon 2026',
    description: 'A 24-hour coding challenge to solve real-world problems. Team up with developers, designers, and entrepreneurs to build innovative solutions and win cash prizes, internships, and mentorship from top industry giants.',
    category: 'Technical',
    date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days in future
    time: '09:00 AM',
    venue: 'Campus Main Auditorium & Seminar Hall B',
    organiser: 'Computer Science Department',
    totalSeats: 150,
    registeredCount: 0,
    deadline: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000), // 8 days in future
    bannerImage: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=800',
    eventStatus: 'Upcoming',
    tags: ['hackathon', 'coding', 'development', 'prizes'],
  },
  {
    title: 'Inter-College Football Championship',
    description: 'The annual soccer showdown featuring elite teams from regional universities. Come support your local college squad as they compete for the championship cup in a high-intensity single-elimination tournament.',
    category: 'Sports',
    date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days in future
    time: '04:00 PM',
    venue: 'Sports Pavilion Arena A',
    organiser: 'Athletics & Recreation Committee',
    totalSeats: 300,
    registeredCount: 0,
    deadline: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000), // 12 days in future
    bannerImage: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=800',
    eventStatus: 'Upcoming',
    tags: ['football', 'sports', 'tournament', 'championship'],
  },
  {
    title: 'AI & Deep Learning Masterclass',
    description: 'An advanced workshop covering neural network architectures, transformers, and prompt engineering. Led by visiting AI research scientists, this session includes hands-on Google Colab notebooks and real-world deployment labs.',
    category: 'Workshop',
    date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days in future
    time: '10:00 AM',
    venue: 'Advanced Computing Lab, Block 3',
    organiser: 'Research and Development Cell',
    totalSeats: 50,
    registeredCount: 0,
    deadline: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // 4 days in future
    bannerImage: 'https://images.unsplash.com/photo-1591453089816-0fbb971b454c?auto=format&fit=crop&q=80&w=800',
    eventStatus: 'Upcoming',
    tags: ['AI', 'deep-learning', 'workshop', 'hands-on'],
  },
  {
    title: 'Rhythms 2026: Cultural Fest',
    description: 'Celebrate diversity, music, and art at our annual cultural festival. Featuring guest band performances, street dances, classical instrumental solos, theatre sketches, and food stalls from across the country.',
    category: 'Cultural',
    date: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000), // 20 days in future
    time: '05:30 PM',
    venue: 'Outdoor Amphitheater',
    organiser: 'Student Cultural Council',
    totalSeats: 500,
    registeredCount: 0,
    deadline: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000), // 18 days in future
    bannerImage: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=800',
    eventStatus: 'Upcoming',
    tags: ['music', 'dance', 'culture', 'festival'],
  },
  {
    title: 'Robotics Workshop and Exhibition',
    description: 'A comprehensive workshop on Arduino microcontrollers and ROS (Robot Operating System). Learn how to build obstacle-avoidance rovers and robot arms from scratch, followed by a project exhibition.',
    category: 'Workshop',
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days in past
    time: '11:00 AM',
    venue: 'Electronics and Mechatronics Lab',
    organiser: 'IEEE Student Branch',
    totalSeats: 60,
    registeredCount: 45,
    deadline: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days in past
    bannerImage: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=800',
    eventStatus: 'Completed',
    tags: ['robotics', 'arduino', 'engineering'],
  }
];

const seedData = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/event_registration');
    console.log('MongoDB Connected for Seeding...');

    // Clear existing data
    await User.deleteMany();
    await Event.deleteMany();
    await Registration.deleteMany();
    console.log('Database cleared.');

    // Create Admin User
    const adminUser = new User({
      name: 'Portal Administrator',
      email: 'sakthiram1704@gmail.com',
      password: 'Sakthi@123', // Will be hashed by userSchema.pre('save')
      role: 'admin',
    });
    await adminUser.save();
    console.log('Default Admin Account Seeded (sakthiram1704@gmail.com / Sakthi@123)');

    // Create Previous Admin User as Student
    const previousAdminUser = new User({
      name: 'Previous Admin User',
      email: 'admin@eventportal.com',
      password: 'adminpassword',
      role: 'student',
    });
    await previousAdminUser.save();
    console.log('Previous Admin Account Seeded as Student (admin@eventportal.com / adminpassword)');

    // Create standard Test Student User
    const studentUser = new User({
      name: 'John Doe',
      email: 'john@student.com',
      password: 'studentpassword',
      role: 'student',
    });
    await studentUser.save();
    console.log('Default Student Account Seeded (john@student.com / studentpassword)');

    // Create Events
    const seededEvents = await Event.insertMany(mockEvents);
    console.log(`${seededEvents.length} Mock Events Seeded.`);

    // Add some test registrations to the completed event for analytics demonstration
    const completedEvent = seededEvents.find(e => e.eventStatus === 'Completed');
    if (completedEvent) {
      const demoRegs = [
        {
          eventId: completedEvent._id,
          studentName: 'Alice Smith',
          rollNumber: 'CS2023001',
          email: 'alice@student.com',
          phone: '+15550192',
          department: 'Computer Science',
          registeredAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
          qrCode: 'mock-qr-code-alice',
          registrationStatus: 'Confirmed',
          attendanceStatus: 'Present',
        },
        {
          eventId: completedEvent._id,
          studentName: 'Bob Johnson',
          rollNumber: 'ME2023042',
          email: 'bob@student.com',
          phone: '+15550183',
          department: 'Mechanical Engineering',
          registeredAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
          qrCode: 'mock-qr-code-bob',
          registrationStatus: 'Confirmed',
          attendanceStatus: 'Absent',
        }
      ];
      await Registration.insertMany(demoRegs);
      // Set register count
      completedEvent.registeredCount = 2;
      await completedEvent.save();
      console.log('Test registrations added to completed event.');
    }

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

// Run seed function if executed directly
if (require.main === module) {
  seedData();
}

module.exports = seedData;
