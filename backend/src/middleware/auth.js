// ─────────────────────────────────────────────────────────
// Middleware: JWT Authentication & Role Authorization
// ─────────────────────────────────────────────────────────
import jwt               from 'jsonwebtoken';
import { jwtConfig }     from '../config/jwt.js';
import { userRepository } from '../repositories/user.repository.js';
import { ApiError }      from '../utils/ApiError.js';
import { HTTP_STATUS }   from '../constants/index.js';

/**
 * Verifies Bearer token from the Authorization header.
 * Attaches decoded user to req.user.
 */
export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'No token provided. Please log in.');
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, jwtConfig.secret);

    const user = await userRepository.findById(decoded.id);
    if (!user || !user.isActive) {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Session invalid. Please log in again.');
    }

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};

/**
 * Restricts access to specified roles.
 * Must be used after authenticate().
 */
export const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return next(
      new ApiError(HTTP_STATUS.FORBIDDEN, 'You do not have permission to perform this action.')
    );
  }
  next();
};
