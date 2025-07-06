// lib/setupIndexes.js
import clientPromise from './mongodb';

export async function ensureUniqueEmailIndex() {
  const client = await clientPromise;
  const db = client.db();
  await db.collection('borrowers').createIndex({ email: 1 }, { unique: true });
}
