import mongoose from 'mongoose';
const { Schema, model } = mongoose;

/**
 * Complaint Schema for UniFix
 * Stores student-reported issues and tracks the resolution lifecycle.
 */
const complaintSchema = new Schema({
  title: {
    type: String,
    required: [true, 'Title is required.'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Description is required.'],
  },
  status: {
    type: String,
    enum: ['Submitted', 'In Progress', 'Resolved', 'Closed'],
    default: 'Submitted',
  },
  
  // UPDATED: Campus-specific location instead of Lat/Lng
  location: {
    building: { 
      type: String, 
      required: [true, 'Building/Block name is required.'] 
    },
    roomNumber: { 
      type: String 
    },
    area: { 
      type: String, 
      placeholder: 'e.g., Near the elevator' 
    },
  },

  // URLs for images stored via server/uploads
  beforeImage: {
    type: String,
    required: [true, 'A photo of the issue is required.'],
  },
  afterImage: {
    type: String, // Provided by Staff upon resolution
  },

  // References
  submittedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  
  // Array of students who support this issue to increase its priority
  upvotedBy: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  ],

  // Student feedback (1-5 stars)
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: null,
  },

  // UPDATED: Links the complaint to the Department that fixed it
  resolvedByDepartment: {
    type: Schema.Types.ObjectId,
    ref: 'Department',
    default: null,
  },

}, {
  timestamps: true, // Adds createdAt and updatedAt automatically
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// --- VIRTUAL FIELD ---
// Dynamically calculates the number of upvotes for the frontend feed
complaintSchema.virtual('upvoteCount').get(function() {
  return this.upvotedBy ? this.upvotedBy.length : 0;
});

const Complaint = model('Complaint', complaintSchema);
export default Complaint;