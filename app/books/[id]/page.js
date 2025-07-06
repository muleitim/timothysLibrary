export const dynamic = 'force-dynamic'; // Ensure dynamic rendering

import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

// Fetch a single book by ID
async function getBook(id) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/books/${id}`, {
      cache: 'no-store',
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch book');
    return data.book;
  } catch (err) {
    console.error('Error fetching book:', err);
    return null;
  }
}

export default async function BookDetails({ params }) {
  const { id } = params; // ✅ Extract first before using

  const book = await getBook(id); // ✅ Safe use

  if (!book) {
    return notFound();
  }

  return (
    <div className="container my-5">
      <h1 className="mb-4">{book.title}</h1>

      <div className="row g-4">
        {/* Book Image */}
        <div className="col-md-4">
          <img
            src={book.imageBase64 || '/placeholder.jpg'}
            alt={book.title}
            className="img-fluid rounded shadow-sm"
            style={{ maxHeight: '400px', objectFit: 'cover', width: '100%' }}
          />
        </div>

        {/* Book Info */}
        <div className="col-md-8">
          <ul className="list-group list-group-flush">
            <li className="list-group-item"><strong>Author:</strong> {book.author}</li>
            <li className="list-group-item"><strong>Publisher:</strong> {book.publisher}</li>
            <li className="list-group-item"><strong>Year Published:</strong> {book.year_published}</li>
            <li className="list-group-item"><strong>Genre:</strong> {book.genre}</li>
            <li className="list-group-item"><strong>Language:</strong> {book.language}</li>
            <li className="list-group-item"><strong>Status:</strong> {book.status}</li>
            <li className="list-group-item"><strong>Overdue Rate:</strong> KES {book.overdue_rate}</li>
            <li className="list-group-item"><strong>Lost Price:</strong> KES {book.lost_price}</li>
          </ul>
        </div>
      </div>

      {/* Description */}
      <div className="mt-5">
        <h4>Description</h4>
        <div className="border rounded p-3" style={{ whiteSpace: 'pre-line' }}>
          {book.description}
        </div>
      </div>

      {/* Back Button */}
      <div className="mt-5 text-end">
        <Link href="/books/list" className="btn btn-outline-primary btn-lg bg-success text-white">
          ← Back to Book List
        </Link>
      </div>
    </div>
  );
}
