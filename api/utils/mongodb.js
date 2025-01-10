import { MongoClient } from 'mongodb';

// Global variable to cache the database connection
let cachedClient = null;
let cachedDb = null;

export async function connectToDatabase() {
  // If we have a cached connection, return it
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  // Set MongoDB connection options
  const opts = {
    connectTimeoutMS: 5000, // 5 seconds connection timeout
    socketTimeoutMS: 5000,  // 5 seconds socket timeout
    maxPoolSize: 10
  };

  // Connect to cluster
  const client = await MongoClient.connect(process.env.MONGODB_URI, opts);
  const db = client.db('proverbs');

  // Set cache
  cachedClient = client;
  cachedDb = db;

  return { client, db };
}
