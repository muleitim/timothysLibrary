'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function BooksPage() {
  const [books, setBooks] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await fetch('/api/books');
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to load books');
        setBooks(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchBooks();
  }, []);

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>All Books</h2>       
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {books.length === 0 ? (
        <div className="banner"></div>
      ) : (
        <div className="row row-cols-1 row-cols-md-3 g-4">
          {books.map((book) => (
            <div className="col" key={book._id}>
              <Link href={`/books/${book._id}`} className="text-decoration-none text-dark">
                <div className="card h-100">
                  {book.imageBase64 && (
                    <img
                      src={book.imageBase64}
                      className="card-img-top"
                      alt={`${book.title} cover`}
                      style={{ maxHeight: '250px', objectFit: 'cover' }}
                    />
                  )}
                  <div className="card-body">
                    <h5 className="card-title">{book.title}</h5>
                    <p className="card-text mb-1"><strong>Author:</strong> {book.author}</p>
                    <p className="card-text mb-1"><strong>Genre:</strong> {book.genre}</p>
                    <p className="card-text mb-1"><strong>Language:</strong> {book.language}</p>
                    <p className="card-text mb-1"><strong>Status:</strong> {book.status}</p>
                    <p className="card-text small text-muted">
                      Published: {book.year_published} | Overdue Rate: {book.overdue_rate} | Lost Price: {book.lost_price}
                    </p>
                    <div className="d-grid mt-3">
                      <button
                        type="button"
                        className="btn btn-outline-primary bg-success text-white"
                        onClick={(e) => {
                          e.preventDefault(); // prevent Link from firing
                          window.location.href = `/books/${book._id}`;
                        }}
                      >
                        View
                      </button>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
