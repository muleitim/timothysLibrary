'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function UpdateBooksPage() {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch books from API
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await fetch('/api/books');
        const data = await res.json();
        setBooks(data);
        console.log('\nBooks loaded:\n', data, '\n');
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };

    fetchBooks();
  }, []);

  // Convert all searchable fields to lowercase string and check match
  const filteredBooks = books?.filter((book) => {
  const values = [
    book.title,
    book.author,
    book.genre,
    book.publisher,
    book.language,
    book.description,
    book.year_published?.toString(),
    book.status,
    book.overdue_rate?.toString(),
    book.lost_price?.toString(),
  ]
    .filter(Boolean) // remove undefined/null
    .join(" ")
    .toLowerCase();

  return values.includes(searchTerm.toLowerCase());
}) || [];



  const handleDelete = async (id) => {
    const confirmDelete = confirm('Are you sure you want to delete this book?');
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/books/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setBooks(books.filter((book) => book._id !== id));
      } else {
        console.error('Failed to delete');
      }
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  return (
    <div className="container my-4">
      <h2 className="mb-4">Update Books</h2>

      <input
        type="text"
        placeholder="Search by any field..."
        className="form-control mb-4"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="row">
        {filteredBooks.length === 0 && (
          <div className="col-12">
            <h2>No books match your search</h2>
            <div className="banner"></div>            
          </div>
        )}

        {filteredBooks.map((book) => (
          <div className="col-md-4 mb-4" key={book._id}>
            <div className="card h-100">
              {(book.image || book.imageBase64) && (
  <img
    src={book.image || book.imageBase64}
    alt={book.title}
    className="card-img-top"
    style={{ height: '250px', objectFit: 'cover' }}
  />
)}
              <div className="card-body">
                <h5 className="card-title">{book.title}</h5>
                <p className="card-text"><strong>Author:</strong> {book.author}</p>
                <p className="card-text"><strong>Genre:</strong> {book.genre}</p>
                <p className="card-text"><strong>Status:</strong> {book.status}</p>
              </div>
              <div className="card-footer d-flex justify-content-between">
                <Link
                  href={`/books/edit/${book._id}`}
                  className="btn btn-sm btn-primary"
                >
                  Edit
                </Link>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(book._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
