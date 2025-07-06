// app/api/books/[id]/route.js
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// GET a book by ID
export async function GET(_, { params }) {
  try {
    const { id } = params; // ✅ FIXED (removed 'await')
    const client = await clientPromise;
    const db = client.db();

    const book = await db.collection('books').findOne({ _id: new ObjectId(id) });

    return new Response(JSON.stringify({ book }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch book' }), {
      status: 500,
    });
  }
}

// UPDATE a book by ID
export async function PUT(req, { params }) {
  try {
    const { id } = params; // ✅ FIXED (removed 'await')
    const body = await req.json();

    const { _id, ...updateData } = body;

    const client = await clientPromise;
    const db = client.db();

    await db.collection('books').updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...updateData,
          year_published: parseInt(updateData.year_published),
          overdue_rate: parseFloat(updateData.overdue_rate),
          lost_price: parseFloat(updateData.lost_price),
        },
      }
    );

    return new Response(JSON.stringify({ message: 'Book updated successfully' }), {
      status: 200,
    });
  } catch (error) {
    console.error('PUT error:', error);
    return new Response(JSON.stringify({ error: 'Failed to update book' }), {
      status: 500,
    });
  }
}

// DELETE a book by ID
export async function DELETE(_, { params }) {
  try {
    const { id } = params; // ✅ FIXED (consistency)
    const client = await clientPromise;
    const db = client.db();

    await db.collection('books').deleteOne({ _id: new ObjectId(id) });

    return new Response(JSON.stringify({ message: 'Book deleted successfully' }), {
      status: 200,
    });
  } catch (error) {
    console.error('DELETE error:', error);
    return new Response(JSON.stringify({ error: 'Failed to delete book' }), {
      status: 500,
    });
  }
}
