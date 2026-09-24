// ─────────────────────────────────────────────────────────
// JWT Configuration
// ─────────────────────────────────────────────────────────
export const jwtConfig = {
  secret: process.env.JWT_SECRET || 'change-me-in-production',
  expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
  cookieName: 'schoolerp_token',
};
