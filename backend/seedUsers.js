const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/userModel');

// Load environment variables
dotenv.config();

const users = [
  {
    name: 'Chief Admin Director',
    email: 'admin@mediflow.ai',
    password: 'admin123',
    role: 'Admin',
    phoneNumber: '+1 (555) 999-8888'
  },
  {
    name: 'Dr. Sarah Connor',
    email: 'doctor@mediflow.ai',
    password: 'doctor123',
    role: 'Doctor',
    specialization: 'AI Diagnostics & Cardiology',
    phoneNumber: '+1 (555) 777-6666'
  },
  {
    name: 'Receptionist Intake Officer',
    email: 'receptionist@mediflow.ai',
    password: 'receptionist123',
    role: 'Receptionist',
    phoneNumber: '+1 (555) 444-3333'
  },
  {
    name: 'Patient John Miller',
    email: 'patient@mediflow.ai',
    password: 'patient123',
    role: 'Patient',
    phoneNumber: '+1 (555) 111-2222'
  }
];

const seedDatabase = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ai_clinic_saas');
    console.log('MongoDB Connected for Seeding...');

    // Clear existing users
    await User.deleteMany();
    console.log('Cleared existing users from database.');

    // Seed users
    // Note: User.create triggers the pre-save password-hashing hook!
    await User.create(users);
    console.log('\x1b[32m%s\x1b[0m', 'Successfully seeded Admin, Doctor, Receptionist, and Patient accounts!');

    // Close connection
    await mongoose.connection.close();
    console.log('Database connection closed.');
    process.exit(0);
  } catch (error) {
    console.error(`\x1b[31m%s\x1b[0m`, `Seeding Failed: ${error.message}`);
    process.exit(1);
  }
};

seedDatabase();
