import mongoose from 'mongoose';
import { initializeStore } from './store.js';

let isMongoConnected = false;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/villagecare';
  try {
    mongoose.set('strictQuery', false);
    // Connect with a 1-second timeout so it doesn't hang if no local MongoDB service
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 1000,
    });
    isMongoConnected = true;
    console.log(`[Database] MongoDB Connected successfully to: ${uri}`);
  } catch (error) {
    isMongoConnected = false;
    console.log(`[Database] Notice: Direct MongoDB connection not active (${error.message}).`);
    console.log(`[Database] Initializing persistent zero-config local storage for VillageCare.`);
    await initializeStore();
  }
};

export const getDbStatus = () => ({
  type: isMongoConnected ? 'MongoDB' : 'LocalPersistentStore',
  status: 'connected',
  details: isMongoConnected ? 'Mongoose Connected' : 'Auto-fallback active (Zero setup required)',
});

export const isMongo = () => isMongoConnected;
