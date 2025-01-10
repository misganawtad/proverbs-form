// api/proverbs.js
import { MongoClient } from 'mongodb';

export default async function handler(req, res) {
  try {
    // Connect to MongoDB
    const client = await MongoClient.connect(process.env.MONGODB_URI);
    const db = client.db('proverbs');
    
    // Handle POST request from your form
    if (req.method === 'POST') {
      const result = await db.collection('proverbs').insertOne(req.body);
      await client.close();
      return res.status(201).json(result);
    }
    
    // Handle GET request to fetch proverbs
    if (req.method === 'GET') {
      const proverbs = await db.collection('proverbs').find({}).toArray();
      await client.close();
      return res.status(200).json(proverbs);
    }

  } catch (error) {
    return res.status(500).json({ error: 'Error with database' });
  }
}
