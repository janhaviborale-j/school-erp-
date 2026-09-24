// ─────────────────────────────────────────────────────────
// Model: User (Admin accounts)
// ─────────────────────────────────────────────────────────
import mongoose from 'mongoose';
import bcrypt   from 'bcryptjs';
import { ROLES } from '../constants/index.js';

const userSchema = new mongoose.Schema(
  {
    name: {
      type:     String,
      required: [true, 'Name is required'],
      trim:     true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type:      String,
      required:  [true, 'Email is required'],
      unique:    true,
      lowercase: true,
      trim:      true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
    },
    password: {
      type:     String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select:   false, // never returned in queries by default
    },
    role: {
      type:    String,
      enum:    Object.values(ROLES),
      default: ROLES.ADMIN,
    },
    institution: {
      type:    String,
      default: 'St. Jude Early Learners Academy',
      trim:    true,
    },
    academicYear: {
      type:    String,
      default: '2026–27',
    },
    isActive: {
      type:    Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Index
userSchema.index({ email: 1 });

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare plain password with hash
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Safe public representation
userSchema.methods.toPublicJSON = function () {
  return {
    id:           this._id,
    name:         this.name,
    email:        this.email,
    role:         this.role,
    institution:  this.institution,
    academicYear: this.academicYear,
    isActive:     this.isActive,
  };
};

const User = mongoose.model('User', userSchema);
export default User;
