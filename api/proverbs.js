// api/proverbs.js
import { MongoClient } from 'mongodb';

let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb) {
    return cachedDb;
  }

  const client = await MongoClient.connect(process.env.MONGODB_URI);
  const db = client.db('proverbs');
  
  cachedDb = db;
  return db;
}

export default async function handler(req, res) {
  try {
    const db = await connectToDatabase();
    const collection = db.collection('proverbs');

    switch (req.method) {
      case 'GET':
        const proverbs = await collection.find({}).toArray();
        res.status(200).json(proverbs);
        break;

      case 'POST':
        const result = await collection.insertOne(req.body);
        res.status(201).json(result);
        break;

      default:
        res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Database operation failed' });
  }
}
