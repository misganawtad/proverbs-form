// api/test.js
import { MongoClient } from 'mongodb';

export default async function handler(req, res) {
  try {
    // Simple connection test
    const client = await MongoClient.connect(process.env.MONGODB_URI);
    const db = client.db('proverbs');
    
    // Simple database operation
    const count = await db.collection('proverbs').countDocuments();
    
    // Close connection
    await client.close();
    
    // Return success
    res.status(200).json({ 
      status: 'success',
      message: 'Connected to MongoDB',
      count: count
    });
    
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      status: 'error', 
      message: error.message 
    });
  }
}
