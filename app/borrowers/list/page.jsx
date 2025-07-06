'use client';
import { useEffect, useState } from 'react';

export default function BorrowersList() {
  const [borrowers, setBorrowers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/borrowers')
      .then(res => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then(data => {
        setBorrowers(Array.isArray(data) ? data : []);
      })
      .catch(err => {
        console.error('Failed to fetch:', err);
        setError('Failed to load borrowers');
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredBorrowers = borrowers.filter(borrower => {
    const term = searchTerm.toLowerCase();
    return (
      borrower?.name?.toLowerCase().includes(term) ||
      borrower?.email?.toLowerCase().includes(term) ||
      borrower?.phone?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="container mt-4">
      <h2>Borrowers</h2>

      <div className="mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Search by name, email, or phone..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <p>Loading borrowers...</p>
      ) : error ? (
        <p className="text-danger">{error}</p>
      ) : filteredBorrowers.length > 0 ? (
        filteredBorrowers.map((borrower, borrowerIdx) => (
          <div key={borrower._id ?? borrowerIdx} className="card mb-4 shadow-sm">
            <div className="card-body">
              <h5 className="card-title">{borrower.name ?? 'Unnamed Borrower'}</h5>
              <p className="card-text">
                <strong>Email:</strong> {borrower.email ?? 'N/A'}<br />
                <strong>Phone:</strong> {borrower.phone ?? 'N/A'}<br />
                <strong>Address:</strong> {borrower.address ?? 'N/A'}
              </p>

              <div className="accordion mt-3" id={`accordion-${borrowerIdx}`}>
                {borrower.borrowedBooks.map((book, bookIdx) => {
                  const headingId = `heading-${borrowerIdx}-${bookIdx}`;
                  const collapseId = `collapse-${borrowerIdx}-${bookIdx}`;
                  return (
                    <div className="accordion-item" key={bookIdx}>
                      <h2 className="accordion-header" id={headingId}>
                        <button
                          className="accordion-button collapsed"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target={`#${collapseId}`}
                          aria-expanded="false"
                          aria-controls={collapseId}
                        >
                          {bookIdx + 1}. {book.title || 'Untitled Book'}
                        </button>
                      </h2>
                      <div
                        id={collapseId}
                        className="accordion-collapse collapse"
                        aria-labelledby={headingId}
                        data-bs-parent={`#accordion-${borrowerIdx}`}
                      >
                        <div className="accordion-body">
                          <strong>Author:</strong> {book.author || 'Unknown'}<br />
                          <strong>Issue Date:</strong> {book.issueDate ? new Date(book.issueDate).toLocaleDateString() : 'N/A'}<br />
                          <strong>Due Date:</strong> {book.dueDate ? new Date(book.dueDate).toLocaleDateString() : 'N/A'}<br />
                          <strong>Date Returned:</strong> {book.returnDate ? new Date(book.returnDate).toLocaleDateString() : 'Not Returned'}<br />
                          <strong>Status:</strong> {book.status ?? 'Unknown'}<br />
                          <strong>Overdue Charges:</strong> KES {book.overdueCharges ?? 0}

                          {book.image && (
                            <div className="mt-3 text-center">
                              <img
                                src={book.image}
                                alt={book.title}
                                className="img-fluid rounded"
                                style={{ maxHeight: '200px', objectFit: 'contain' }}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))
      ) : (
        <p className="text-muted">No matching borrowers found.</p>
      )}
    </div>
  );
}
