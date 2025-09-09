import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

// Define a proper type for the cache
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Initialize properly
let cached: MongooseCache = (global as any).mongoose || { conn: null, promise: null };

export const connectToDatabase = async () => {
  if (cached.conn) return cached.conn;

  if (!MONGODB_URI) throw new Error('MONGODB_URI is missing');

  try {
    cached.promise = cached.promise || mongoose.connect(MONGODB_URI, {
      dbName: 'EventHub',
      bufferCommands: true,
      serverSelectionTimeoutMS: 10000, // 10 seconds timeout for server selection
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      family: 4, // Use IPv4, skip IPv6 (can help with some DNS issues)
    });
    
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    // Reset cache on error to allow retry
    cached.promise = null;
    cached.conn = null;
    
    console.error('MongoDB connection error:', error);
    // throw new Error("Database connection failed", ${error.message});
  }
};