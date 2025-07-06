'use client';
import { useEffect, useState } from 'react';
import jsPDF from 'jspdf';

export default function ReturnBooksPage() {
  const [borrowers, setBorrowers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [returningBookId, setReturningBookId] = useState(null);
  const [receipt, setReceipt] = useState(null);

  const fetchBorrowers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/borrowers');
      if (!res.ok) throw new Error('Network response was not ok');
      const data = await res.json();
      setBorrowers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch:', err);
      setError('Failed to load borrowers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBorrowers();
  }, []);

  const handleReturnBook = async (borrowerId, bookId) => {
    const confirmReturn = confirm('Are you sure you want to return this book?');
    if (!confirmReturn) return;

    setReturningBookId(bookId);
    try {
      const res = await fetch('/api/borrowers', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ borrowerId, bookId }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || 'Failed to return book');
        return;
      }

      await fetchBorrowers();

      const borrower = borrowers.find(b => b._id === borrowerId);
      const book = borrower?.borrowedBooks.find(b => b.bookId === bookId);
      const now = new Date();

      const dueDate = new Date(book?.dueDate);
      const daysOverdue = Math.max(Math.ceil((now - dueDate) / (1000 * 60 * 60 * 24)), 0);
      const overdueRate = book?.overdueRate ?? 0;
      const overdueCharges = daysOverdue > 0 ? overdueRate * daysOverdue : 0;

      setReceipt({
        borrowerName: borrower?.name,
        bookTitle: book?.title,
        bookAuthor: book?.author,
        returnDate: now,
        overdueCharges,
        bookId,
      });
    } catch (err) {
      console.error('Error returning book:', err);
      alert('An error occurred while returning the book');
    } finally {
      setReturningBookId(null);
    }
  };

  const downloadReceipt = () => {
    if (!receipt) return;

    const doc = new jsPDF();

    const formattedDate = receipt.returnDate.toLocaleDateString();
    const formattedTime = receipt.returnDate.toLocaleTimeString();

    doc.setFontSize(18);
    doc.text("Tim's Library Book Return Receipt", 20, 20);

    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text('Date:', 20, 35);
    doc.setFont(undefined, 'normal');
    doc.text(formattedDate, 60, 35);

    doc.setFont(undefined, 'bold');
    doc.text('Time:', 20, 42);
    doc.setFont(undefined, 'normal');
    doc.text(formattedTime, 60, 42);

    doc.setFont(undefined, 'bold');
    doc.text('Borrower Name:', 20, 52);
    doc.setFont(undefined, 'normal');
    doc.text(receipt.borrowerName, 60, 52);

    doc.setFont(undefined, 'bold');
    doc.text('Book Title:', 20, 62);
    doc.setFont(undefined, 'normal');
    doc.text(receipt.bookTitle, 60, 62);

    doc.setFont(undefined, 'bold');
    doc.text('Author:', 20, 72);
    doc.setFont(undefined, 'normal');
    doc.text(receipt.bookAuthor, 60, 72);

    doc.setFont(undefined, 'bold');
    doc.text('Book ID:', 20, 82);
    doc.setFont(undefined, 'normal');
    doc.text(receipt.bookId, 60, 82);

    doc.setFont(undefined, 'bold');
    doc.text('Overdue Charges:', 20, 92);
    doc.setFont(undefined, 'normal');
    doc.text(`KES ${receipt.overdueCharges}`, 60, 92);

    doc.setFontSize(10);
    doc.text('Thank you for using our library services.', 20, 110);

    const nameForFile = receipt.borrowerName.replace(/\s+/g, '-');
    const now = receipt.returnDate;
    const fileName = `${nameForFile}-${now.toLocaleDateString('en-GB').replace(/\//g, '-')}_${now.toLocaleTimeString('en-GB')}.pdf`.replace(/:/g, '-');

    doc.save(fileName);
    setReceipt(null);
  };

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
      <h2>Return Borrowed Books</h2>

      <div className="mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Search by name, email, or phone..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      {receipt && (
        <div className="alert alert-success d-flex justify-content-between align-items-center">
          <div>
            ✅ Book returned successfully! Overdue Charges: <strong>KES {receipt.overdueCharges}</strong>
          </div>
          <button className="btn btn-sm btn-primary" onClick={downloadReceipt}>
            Download Receipt
          </button>
        </div>
      )}

      {loading ? (
        <p>Loading borrowers...</p>
      ) : error ? (
        <p className="text-danger">{error}</p>
      ) : filteredBorrowers.length > 0 ? (
        filteredBorrowers.map((borrower, borrowerIdx) => (
          <div key={borrower._id} className="card mb-4 shadow-sm">
            <div className="card-body">
              <h5 className="card-title">{borrower.name}</h5>
              <p className="card-text">
                <strong>Email:</strong> {borrower.email}<br />
                <strong>Phone:</strong> {borrower.phone}<br />
                <strong>Address:</strong> {borrower.address}
              </p>

              <div className="accordion mt-3" id={`accordion-${borrowerIdx}`}>
                {borrower.borrowedBooks.map((book, bookIdx) => {
                  const headingId = `heading-${borrowerIdx}-${bookIdx}`;
                  const collapseId = `collapse-${borrowerIdx}-${bookIdx}`;

                  const now = new Date();
                  const issueDate = book.issueDate ? new Date(book.issueDate) : null;
                  const dueDate = book.dueDate ? new Date(book.dueDate) : null;
                  const returnDate = book.returnDate ? new Date(book.returnDate) : null;

                  const isReturned = book.status === 'returned';
                  const overdueRate = book.overdue_rate ?? 0;

                  const effectiveReturnDate = returnDate || now;
                  const daysOverdue = dueDate
                    ? Math.max(Math.ceil((effectiveReturnDate - dueDate) / (1000 * 60 * 60 * 24)), 0)
                    : 0;

                  const overdueCharges = daysOverdue > 0 ? overdueRate * daysOverdue : 0;

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
                          <strong>Issue Date:</strong> {issueDate?.toLocaleDateString() || 'N/A'}<br />
                          <strong>Due Date:</strong> {dueDate?.toLocaleDateString() || 'N/A'}<br />
                          <strong>Date Returned:</strong> {returnDate?.toLocaleDateString() || 'Not Returned'}<br />
                          <strong>Status:</strong> {book.status}<br />
                          <strong>Days Overdue:</strong> {daysOverdue}<br />
                          <strong>Overdue Rate:</strong> KES {overdueRate} per day<br />
                          <strong>Overdue Charges:</strong>{' '}
                          <span className="text-danger">KES {overdueCharges}</span>

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

                          <br />

                          {!isReturned && (
                            <button
                              className="btn btn-sm btn-outline-success mt-3 bg-primary text-white"
                              onClick={() => handleReturnBook(borrower._id, book.bookId)}
                              disabled={returningBookId === book.bookId}
                            >
                              {returningBookId === book.bookId ? 'Returning...' : 'Return'}
                            </button>
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
