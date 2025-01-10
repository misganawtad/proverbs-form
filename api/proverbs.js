// api/proverbs.js
import { MongoClient } from 'mongodb';

export default async function handler(req, res) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    // Connect to MongoDB
    const client = await MongoClient.connect(process.env.MONGODB_URI);
    const db = client.db('proverbs');
    
    // Handle POST request from your form
    if (req.method === 'POST') {
      // Check if req.body exists and has required fields
      if (!req.body || !req.body.originalText || !req.body.language || !req.body.country) {
        return res.status(400).json({ 
          message: 'Missing required fields'
        });
      }

      // Add timestamp
      const proverbData = {
        ...req.body,
        createdAt: new Date()
      };

      const result = await db.collection('proverbs').insertOne(proverbData);
      await client.close();
      
      return res.status(201).json({ 
        message: 'Proverb saved successfully',
        proverb: result
      });
    }
    
    // Handle GET request
    if (req.method === 'GET') {
      const proverbs = await db.collection('proverbs').find({}).toArray();
      await client.close();
      return res.status(200).json(proverbs);
    }

    // Handle invalid methods
    return res.status(405).json({ message: 'Method not allowed' });

  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ 
      message: 'Error processing request',
      error: error.message 
    });
  }
}
