// ─────────────────────────────────────────────────────────
// SchoolERP Backend — Express Application Setup
// ─────────────────────────────────────────────────────────
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

// Config
import { connectDB } from './config/database.js';

// Middleware
import { errorHandler } from './middleware/errorHandler.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';

// Routes
// import authRoutes from './routes/auth.routes.js';
// import studentRoutes from './routes/student.routes.js';
// import classRoutes from './routes/class.routes.js';
// import parentRoutes from './routes/parent.routes.js';
// import attendanceRoutes from './routes/attendance.routes.js';
// import feeRoutes from './routes/fee.routes.js';
// import paymentRoutes from './routes/payment.routes.js';
// import reportRoutes from './routes/report.routes.js';
// import settingsRoutes from './routes/settings.routes.js';

const app = express();

// ─── Security ─────────────────────────────────────────────
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));

// ─── Rate Limiting ────────────────────────────────────────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: { error: 'Too many requests, please try again later.' },
});
app.use('/api/', limiter);

// ─── Body Parsing ─────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ─── Logging ──────────────────────────────────────────────
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// ─── Database Connection ──────────────────────────────────
connectDB();

// ─── Health Check ─────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// ─── API Routes ───────────────────────────────────────────
// Uncomment as you implement each module:
// app.use('/api/auth', authRoutes);
// app.use('/api/students', studentRoutes);
// app.use('/api/classes', classRoutes);
// app.use('/api/parents', parentRoutes);
// app.use('/api/attendance', attendanceRoutes);
// app.use('/api/fees', feeRoutes);
// app.use('/api/payments', paymentRoutes);
// app.use('/api/reports', reportRoutes);
// app.use('/api/settings', settingsRoutes);

// ─── Error Handling ───────────────────────────────────────
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
