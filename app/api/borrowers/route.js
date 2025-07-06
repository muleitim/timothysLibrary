import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(req) {
  try {
    const client = await clientPromise;
    const db = client.db();
    const borrowersCollection = db.collection('borrowers');
    const booksCollection = db.collection('books');

    const borrowers = await borrowersCollection.find().toArray();
    const filteredBorrowers = [];

    for (const borrower of borrowers) {
      if (!Array.isArray(borrower.borrowedBooks) || borrower.borrowedBooks.length === 0) {
        await borrowersCollection.deleteOne({ _id: borrower._id });
        continue;
      }

      for (const record of borrower.borrowedBooks) {
        const book = await booksCollection.findOne({ _id: new ObjectId(record.bookId) });
        if (book) {
          record.title = book.title;
          record.author = book.author;
          record.overdue_rate = book.overdue_rate;
          record.image = book.image;
        }
      }

      filteredBorrowers.push(borrower);
    }

    return new Response(JSON.stringify(filteredBorrowers), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching borrowers:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch borrowers' }), { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    const { borrowerId, bookId } = await req.json();
    const client = await clientPromise;
    const db = client.db();
    const borrowersCollection = db.collection('borrowers');
    const booksCollection = db.collection('books');

    const borrower = await borrowersCollection.findOne({ _id: new ObjectId(borrowerId) });
    if (!borrower) {
      return new Response(JSON.stringify({ error: 'Borrower not found' }), { status: 404 });
    }

    const bookObjectId = new ObjectId(bookId);
    const bookRecord = borrower.borrowedBooks.find(book =>
      book.bookId && book.bookId.equals(bookObjectId)
    );

    if (!bookRecord) {
      return new Response(JSON.stringify({ error: 'Book not found in borrower record' }), { status: 404 });
    }

    const now = new Date();
    const dueDate = new Date(bookRecord.dueDate);
    const overdueDays = Math.max(0, Math.ceil((now - dueDate) / (1000 * 60 * 60 * 24)));

    const book = await booksCollection.findOne({ _id: bookObjectId });
    const overdueRate = book?.overdue_rate || 0;

    const overdueCharges = parseFloat((overdueDays * overdueRate).toFixed(2));

    // Remove the book from borrowedBooks list
    const updatedBorrowedBooks = borrower.borrowedBooks.filter(book =>
      !(book.bookId && book.bookId.equals(bookObjectId))
    );

    await borrowersCollection.updateOne(
      { _id: new ObjectId(borrowerId) },
      { $set: { borrowedBooks: updatedBorrowedBooks } }
    );

    await booksCollection.updateOne(
      { _id: bookObjectId },
      { $set: { status: 'available' } }
    );

    return new Response(JSON.stringify({ message: 'Book returned successfully', overdueCharges }), {
      status: 200,
    });
  } catch (error) {
    console.error('Error returning book:', error);
    return new Response(JSON.stringify({ error: 'Failed to return book' }), { status: 500 });
  }
}
