import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Department from './models/Department.js';

dotenv.config();

const departments = [
  { name: 'Estate & Maintenance', officeLocation: 'Utility Wing, Ground Floor' },
  { name: 'IT Infrastructure', officeLocation: 'Academic Block A, Room 102' },
  { name: 'Hostel Administration', officeLocation: 'Hostel Office, Block 1' },
  { name: 'Security Services', officeLocation: 'Main Gate, Cabin 1' },
  { name: 'Canteen & Mess', officeLocation: 'Student Center, Level 1' }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to DB...');
    
    // Clear existing departments to avoid duplicates
    await Department.deleteMany({});
    
    // Insert new ones
    await Department.insertMany(departments);
    
    console.log('✅ Campus Catalog Seeded Successfully!');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedDB();