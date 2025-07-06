// app/api/books/add/route.js
import clientPromise from '@/lib/mongodb';

export async function POST(req) {
  try {
    const body = await req.json();

    const {
      title,
      author,
      genre,
      publisher,
      language,
      description,
      year_published,
      status,
      overdue_rate,
      lost_price,
      imageBase64, // new
    } = body;

    const newBook = {
      title,
      author,
      genre,
      publisher,
      language,
      description,
      year_published: parseInt(year_published),
      status,
      overdue_rate: parseFloat(overdue_rate),
      lost_price: parseFloat(lost_price),
      imageBase64, // store base64 string
      created_at: new Date(),
    };

    const client = await clientPromise;
    const db = client.db(); // default DB
    const result = await db.collection('books').insertOne(newBook);

    return new Response(JSON.stringify({ message: 'Book added', id: result.insertedId }), {
      status: 201,
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Failed to add book' }), { status: 500 });
  }
}
