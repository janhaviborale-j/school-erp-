// ─────────────────────────────────────────────────────────
// Service: Authentication
// ─────────────────────────────────────────────────────────
import jwt                    from 'jsonwebtoken';
import { jwtConfig }          from '../config/jwt.js';
import { userRepository }     from '../repositories/user.repository.js';
import { ApiError }           from '../utils/ApiError.js';
import { HTTP_STATUS }        from '../constants/index.js';

/**
 * Sign a JWT for the given user payload.
 */
const signToken = (payload) =>
  jwt.sign(payload, jwtConfig.secret, { expiresIn: jwtConfig.expiresIn });

export const authService = {
  /**
   * Validate credentials and return { token, user }.
   */
  login: async (email, password) => {
    // 1. Find user (password field is excluded by default; select it explicitly)
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Invalid email or password.');
    }

    // 2. Check account active
    if (!user.isActive) {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Account is deactivated. Contact your administrator.');
    }

    // 3. Compare password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Invalid email or password.');
    }

    // 4. Sign token
    const token = signToken({ id: user._id, role: user.role });

    return { token, user: user.toPublicJSON() };
  },

  /**
   * Return the currently authenticated user's public data.
   */
  getMe: async (userId) => {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'User not found.');
    }
    return user.toPublicJSON();
  },
};
