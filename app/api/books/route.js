// app/api/books/route.js
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();
    const books = await db.collection('books').find({}).toArray();

    return new Response(JSON.stringify(books), {
      status: 200,
    });
  } catch (error) {
    console.error('Error fetching books:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch books' }), {
      status: 500,
    });
  }
}

