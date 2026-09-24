// ─────────────────────────────────────────────────────────
// Repository: User
// ─────────────────────────────────────────────────────────
import User from '../models/User.js';

export const userRepository = {
  findByEmail: (email) =>
    User.findOne({ email: email.toLowerCase().trim() }).select('+password'),

  findById: (id) =>
    User.findById(id),

  create: (data) =>
    User.create(data),

  updateById: (id, data) =>
    User.findByIdAndUpdate(id, data, { new: true, runValidators: true }),
};
