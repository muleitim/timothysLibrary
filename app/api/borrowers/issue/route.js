import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(req) {
  const client = await clientPromise;
  const db = client.db();
  const { borrowerId, bookId, dueDate } = await req.json();

  const bookObjectId = new ObjectId(bookId);
  const borrowerObjectId = new ObjectId(borrowerId);

  // 1. Check if book is available
  const book = await db.collection('books').findOne({ _id: bookObjectId });
  if (!book || book.status !== 'available') {
    return Response.json({ error: 'Book is not available for borrowing.' }, { status: 400 });
  }

  // 2. Update borrower’s borrowedBooks array
  const borrowEntry = {
    bookId: bookObjectId,
    issueDate: new Date(),
    dueDate: new Date(dueDate),
    returnDate: null,
    status: 'borrowed',
    overdueCharges: 0
  };

  await db.collection('borrowers').updateOne(
    { _id: borrowerObjectId },
    { $push: { borrowedBooks: borrowEntry } }
  );

  // 3. Mark the book as issued
  await db.collection('books').updateOne(
    { _id: bookObjectId },
    { $set: { status: 'issued' } }
  );

  return Response.json({ message: 'Book issued successfully' });
}
