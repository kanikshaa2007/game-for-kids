import mongoose from 'mongoose';
import { mockDb } from './mock-db';

export interface DatabaseConfig {
  uri: string;
  dbName?: string;
  serverSelectionTimeoutMS?: number;
}

export let databaseMode: 'mongodb' | 'mock' = 'mongodb';

export async function connectDatabase(config: DatabaseConfig): Promise<void> {
  try {
    const options = {
      dbName: config.dbName || 'kids-learning',
      serverSelectionTimeoutMS: config.serverSelectionTimeoutMS ?? 5000,
    };

    await mongoose.connect(config.uri, options);

    console.log(`MongoDB connected successfully to "${options.dbName}"`);

    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB disconnected');
    });

    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('MongoDB connection closed through app termination');
      process.exit(0);
    });
  } catch (error) {
    console.warn('??  MongoDB connection failed, enabling mock database mode');
    databaseMode = 'mock';
    mockDb.enable();
    return; // Don't throw, allow server to start
  }
}

export async function disconnectDatabase(): Promise<void> {
  try {
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  } catch (error) {
    console.error('Error closing MongoDB connection:', error);
    throw error;
  }
}


