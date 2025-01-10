import clientPromise from '../../lib/mongodb';
import mongoose from 'mongoose';
import Proverb from '../../models/Proverb';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db("proverbs");
    
    // Create new proverb document
    const proverb = new Proverb(req.body);
    
    // Save to database
    await db.collection('proverbs').insertOne(proverb);
    
    res.status(201).json({ message: 'Proverb saved successfully', proverb });
  } catch (error) {
    console.error('Error saving proverb:', error);
    res.status(500).json({ message: 'Error saving proverb', error: error.message });
  }
}
