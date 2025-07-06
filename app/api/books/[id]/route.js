// app/api/books/[id]/route.js
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';


// addition
export async function GET(_, { params }) {
  try {
    const {id} = await params;
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

// end of addition


export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const body = await req.json();

    // Create a copy of body and remove _id if it exists
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
    console.log(`\nError:\n${error}\n`);
    return new Response(JSON.stringify({ error: 'Failed to update book' }), {
      status: 500,
    });
  }
}

export async function DELETE(_, { params }) {
  try {
    const id = params.id;
    const client = await clientPromise;
    const db = client.db();

    await db.collection('books').deleteOne({ _id: new ObjectId(id) });

    return new Response(JSON.stringify({ message: 'Book deleted successfully' }), {
      status: 200,
    });
  } catch (error) {
    console.log(`\nError:\n${error}\n`);
    return new Response(JSON.stringify({ error: 'Failed to delete book' }), {
      status: 500,
    });
  }
}
