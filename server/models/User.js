import mongoose, { Schema } from 'mongoose';

/**
 * User Model (UniFix)
 * Handles identity for both Students (reporters) and Staff (resolvers).
 */
const UserSchema = new Schema(
  {
    // Full display name
    name: {
      type: String,
      required: [true, 'Name is required.'],
      trim: true,
    },

    // Unique login handle
    username: {
      type: String,
      required: [true, 'Username is required.'],
      unique: true,
      trim: true,
    },

    // Campus email
    email: {
      type: String,
      required: [true, 'Email is required.'],
      unique: true,
      trim: true,
      lowercase: true,
    },

    // Bcrypt hashed password
    password: {
      type: String,
      required: [true, 'Password is required.'],
    },

    // UPDATED ROLES: Student (formerly Citizen) or Staff (formerly Municipal)
    role: {
      type: String,
      enum: ['Student', 'Staff'],
      default: 'Student',
      required: [true, 'Role is required.'],
    },

    // Optional campus locality (e.g., "Hostel Block A" or "Day Scholar")
    locality: {
      type: String,
      trim: true,
    },

    // UPDATED: Link to Department (only required when role === 'Staff')
    department: {
      type: Schema.Types.ObjectId,
      ref: 'Department',
      required: [
        function () {
          return this.role === 'Staff';
        },
        'Department assignment is required for staff users.',
      ],
    },
  },
  { timestamps: true } // Automatically manages createdAt and updatedAt
);

const User = mongoose.model('User', UserSchema);
export default User;