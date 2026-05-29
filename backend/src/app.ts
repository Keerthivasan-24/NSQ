import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import recordRoutes from './routes/record.routes';
import userRoutes from './routes/user.routes';
import { loggerMiddleware } from './middleware/logger.middleware';
import { latencyMiddleware } from './middleware/latency.middleware';
import { errorMiddleware } from './middleware/error.middleware';

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS with support for headers/methods
app.use(cors({
  origin: '*',
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Simulate-Latency'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

// Body parser
app.use(express.json());

// Log incoming requests
app.use(loggerMiddleware);

// Artificial latency simulator middleware
app.use(latencyMiddleware);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/records', recordRoutes);
app.use('/api/users', userRoutes);

// Root route check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'MPloyChek Verification API is active.' });
});

// Error handling middleware
app.use(errorMiddleware);

// Start server
app.listen(PORT, () => {
  console.log(`[Server] MPloyChek backend is running on http://localhost:${PORT}`);
});
