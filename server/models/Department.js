import mongoose from 'mongoose';

/**
 * Department Model (UniFix)
 * Represents campus units like "IT Support", "Maintenance", or "Hostel Administration".
 */
const DepartmentSchema = new mongoose.Schema({
  // The official name of the campus department
  name: {
    type: String, 
    required: [true, 'Department name is required.'],
    unique: true,
    trim: true,
  },
  
  // Physical office where students can find this department
  // e.g., "Main Building, Ground Floor, Room 10"
  officeLocation: {
    type: String,
    required: [true, 'Office location is required.'],
  },
  
  // Calculated dynamically based on student feedback from Resolved complaints
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
}, { 
  timestamps: true // Automatically tracks when a department was added or updated
});

const Department = mongoose.model('Department', DepartmentSchema);
export default Department;