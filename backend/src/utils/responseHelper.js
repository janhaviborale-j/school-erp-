// ─────────────────────────────────────────────────────────
// Utility: Standard API Response Helpers
// ─────────────────────────────────────────────────────────

/**
 * Send a success response.
 * Shape: { success, message, data?, meta? }
 */
export const sendResponse = (res, { statusCode = 200, message = 'Success', data = null, meta = null }) => {
  const body = { success: true, message };
  if (data !== null && data !== undefined) body.data = data;
  if (meta !== null && meta !== undefined) body.meta = meta;
  return res.status(statusCode).json(body);
};

/**
 * Send an error response.
 * Shape: { success, message, errors? }
 */
export const sendError = (res, { statusCode = 500, message = 'Internal Server Error', errors = [] }) => {
  const body = { success: false, message };
  if (errors.length > 0) body.errors = errors;
  return res.status(statusCode).json(body);
};

/**
 * Build pagination meta object.
 */
export const buildMeta = (page, limit, total) => ({
  page:       parseInt(page, 10),
  limit:      parseInt(limit, 10),
  total,
  totalPages: Math.ceil(total / limit),
});
