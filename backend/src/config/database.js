// ─────────────────────────────────────────────────────────
// Database Configuration — MongoDB Connection via Mongoose
// ─────────────────────────────────────────────────────────
import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;

    if (!uri) {
      console.warn('⚠  MONGODB_URI not set. Database connection skipped.');
      return;
    }

    mongoose.connection.on('connected', () => {
      console.log('✓  MongoDB connected:', mongoose.connection.host);
    });

    mongoose.connection.on('error', (err) => {
      console.error('✕  MongoDB connection error:', err.message);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠  MongoDB disconnected.');
    });

    await mongoose.connect(uri, {
      autoIndex: process.env.NODE_ENV !== 'production',
    });
  } catch (error) {
    console.error('✕  MongoDB initial connection failed:', error.message);
    process.exit(1);
  }
};
