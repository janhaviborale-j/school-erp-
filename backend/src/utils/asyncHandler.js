// ─────────────────────────────────────────────────────────
// Utility: Async Route Handler Wrapper
// ─────────────────────────────────────────────────────────
// Wraps async route handlers so rejected promises are
// automatically forwarded to Express error middleware.
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
