import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

let cached: MongooseCache = (global as any).mongoose;

if (!cached) {
  cached = { conn: null, promise: null };
  (global as any).mongoose = cached;
}

export const connectToDatabase = async () => {
  if (cached.conn) return cached.conn;

  if (!MONGODB_URI) {
    throw new Error("❌ MONGODB_URI is missing in environment variables");
  }

  try {
    cached.promise =
      cached.promise ||
      mongoose.connect(MONGODB_URI, {
        dbName: "EventHub",
        bufferCommands: false,
        serverSelectionTimeoutMS: 10000, // fail fast if cannot connect
        socketTimeoutMS: 45000,
        family: 4,
      });

    cached.conn = await cached.promise;
    console.log("✅ MongoDB connected");
    return cached.conn;
  } catch (error) {
    cached.promise = null;
    cached.conn = null;
    console.error("❌ MongoDB connection error:", error);
    throw error;
  }
};
