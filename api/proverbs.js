// api/test.js
import { MongoClient } from 'mongodb';

export default async function handler(req, res) {
  try {
    // Log the MongoDB URI (remove password for security)
    const redactedUri = process.env.MONGODB_URI 
      ? process.env.MONGODB_URI.replace(/:([^@]+)@/, ':***@')
      : 'Not defined';
    console.log('Attempting connection with:', redactedUri);

    // Attempt connection
    const client = await MongoClient.connect(process.env.MONGODB_URI, {
      maxPoolSize: 1,
      serverSelectionTimeoutMS: 5000
    });

    // Test the connection
    const db = client.db('proverbs');
    await db.command({ ping: 1 });

    // Close connection
    await client.close();

    // Return success
    return res.status(200).json({ 
      status: 'success', 
      message: 'Successfully connected to MongoDB' 
    });

  } catch (error) {
    console.error('Connection test error:', error);
    return res.status(500).json({ 
      status: 'error',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}
