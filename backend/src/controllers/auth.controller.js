// ─────────────────────────────────────────────────────────
// Controller: Authentication
// ─────────────────────────────────────────────────────────
import { authService }   from '../services/auth.service.js';
import { asyncHandler }  from '../utils/asyncHandler.js';
import { sendResponse }  from '../utils/responseHelper.js';
import { HTTP_STATUS }   from '../constants/index.js';

// POST /api/auth/login
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const { token, user }     = await authService.login(email, password);

  sendResponse(res, {
    statusCode: HTTP_STATUS.OK,
    message:    'Login successful.',
    data:       { token, user },
  });
});

// GET /api/auth/me
export const getMe = asyncHandler(async (req, res) => {
  const user = await authService.getMe(req.user._id);

  sendResponse(res, {
    statusCode: HTTP_STATUS.OK,
    message:    'User retrieved successfully.',
    data:       { user },
  });
});

// POST /api/auth/logout
export const logout = asyncHandler(async (req, res) => {
  // JWT is stateless; client must discard the token.
  // If cookie-based refresh tokens are added later, clear cookie here.
  sendResponse(res, {
    statusCode: HTTP_STATUS.OK,
    message:    'Logged out successfully.',
  });
});
