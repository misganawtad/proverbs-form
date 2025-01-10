import { connectToDatabase } from './utils/mongodb';

export default async function handler(req, res) {
  try {
    // Connect to database
    const { db } = await connectToDatabase();
    
    if (req.method === 'GET') {
      // Limit to 20 documents and only fetch necessary fields
      const proverbs = await db.collection('proverbs')
        .find({})
        .limit(20)
        .project({ originalText: 1, language: 1, country: 1 })
        .toArray();
      
      return res.status(200).json(proverbs);
    }
    
    if (req.method === 'POST') {
      if (!req.body) {
        return res.status(400).json({ error: 'No data provided' });
      }
      
      const result = await db.collection('proverbs').insertOne(req.body);
      return res.status(201).json(result);
    }

    return res.status(405).json({ error: 'Method not allowed' });

  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ error: 'Database operation failed' });
  }
}
