import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

import { connectDatabase } from './config/database';
import authRoutes from './routes/auth.routes';
import gameRoutes from './routes/game.routes';
import userRoutes from './routes/user.routes';
import aiRoutes from './routes/ai.routes';
import screenTimeRoutes from './routes/screenTime.routes';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME || 'kids-learning';
const MONGODB_SERVER_SELECTION_TIMEOUT_MS = Number(
  process.env.MONGODB_SERVER_SELECTION_TIMEOUT_MS || 5000
);

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    database: {
      provider: 'mongodb',
      name: MONGODB_DB_NAME,
    },
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/game', gameRoutes);
app.use('/api/user', userRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/screentime', screenTimeRoutes);

app.get('/', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Kids Learning Platform API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      auth: '/api/auth/*',
      game: '/api/game/*',
      user: '/api/user/*',
      ai: '/api/ai/*',
      screenTime: '/api/screentime/*',
    },
    documentation: 'Visit http://localhost:3000 for the frontend application',
  });
});

app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
  });
});

app.use((err: Error, _req: Request, res: Response) => {
  console.error('Error:', err);

  res.status(500).json({
    success: false,
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
  });
});

async function startServer(): Promise<void> {
  try {
    await connectDatabase({
      uri: MONGODB_URI,
      dbName: MONGODB_DB_NAME,
      serverSelectionTimeoutMS: MONGODB_SERVER_SELECTION_TIMEOUT_MS,
    });

    app.listen(PORT, () => {
      console.log(`Backend server running on http://localhost:${PORT}`);
      console.log(`Database: MongoDB / ${MONGODB_DB_NAME}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection:', error);
  process.exit(1);
});

process.on('SIGTERM', async () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

startServer();

export default app;

