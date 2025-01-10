// api/hello.js
import { MongoClient } from 'mongodb';

// Create cached connection variable
let cachedDb = null;

// Function to connect to MongoDB
async function connectToDatabase() {
  if (cachedDb) {
    return cachedDb;
  }

  // Connect to MongoDB
  const client = await MongoClient.connect(process.env.MONGODB_URI);
  const db = client.db('proverbs'); // your database name

  cachedDb = db;
  return db;
}

export default async function handler(req, res) {
  try {
    // Connect to database
    const db = await connectToDatabase();
    
    // Simple test: count documents in proverbs collection
    const count = await db.collection('proverbs').countDocuments();
    
    res.status(200).json({ 
      message: 'Connected to MongoDB!',
      proverbCount: count 
    });
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ error: 'Failed to connect to database' });
  }
}
