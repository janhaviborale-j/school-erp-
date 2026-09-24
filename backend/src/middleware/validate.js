// ─────────────────────────────────────────────────────────
// Middleware: express-validator Result Handler
// ─────────────────────────────────────────────────────────
import { validationResult } from 'express-validator';

/**
 * Run this after any array of express-validator checks.
 * If there are errors it short-circuits with 400.
 */
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors:  errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};
