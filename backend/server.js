// ─────────────────────────────────────────────────────────
// SchoolERP Backend — Server Entry Point
// ─────────────────────────────────────────────────────────
import dotenv from 'dotenv';
dotenv.config();

import app from './src/app.js';

const PORT = process.env.PORT || 5000;
const ENV  = process.env.NODE_ENV || 'development';

const server = app.listen(PORT, () => {
  console.log('╔══════════════════════════════════════════╗');
  console.log('║   SchoolERP API Server                   ║');
  console.log(`║   Port        : ${String(PORT).padEnd(25)}║`);
  console.log(`║   Environment : ${String(ENV).padEnd(25)}║`);
  console.log('╚══════════════════════════════════════════╝');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('Server closed.');
    process.exit(0);
  });
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
  server.close(() => process.exit(1));
});
