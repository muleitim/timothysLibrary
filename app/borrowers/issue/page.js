'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function IssueBookPage() {
  const router = useRouter();

  // States
  const [borrowers, setBorrowers] = useState([]);
  const [books, setBooks] = useState([]);
  const [borrowerEmail, setBorrowerEmail] = useState('');
  const [borrower, setBorrower] = useState(null);
  const [bookSearch, setBookSearch] = useState('');
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [dueDate, setDueDate] = useState('');

  // Fetch borrowers and available books
  useEffect(() => {
    const fetchData = async () => {
      try {
        const borrowersRes = await fetch('/api/borrowers');
        const booksRes = await fetch('/api/books');
        const borrowersData = await borrowersRes.json();
        const booksData = await booksRes.json();
        setBorrowers(borrowersData);
        setBooks(booksData.filter(b => b.status === 'available'));
      } catch (err) {
        console.error('Error loading data:', err);
      }
    };
    fetchData();
  }, []);

  // Borrower search by email
  const handleBorrowerSearch = async () => {
    if (!borrowerEmail.trim()) {
      alert('Enter an email to search.');
      return;
    }

    try {
      const res = await fetch(`/api/borrowers/emailSearch?email=${encodeURIComponent(borrowerEmail.trim())}`);
      if (!res.ok) throw new Error('Borrower not found');
      const data = await res.json();
      setBorrower(data);
    } catch (err) {
      alert('Borrower not found by that email.');
      setBorrower(null);
    }
  };

  // Book search
  const handleBookSearch = () => {
    if (!bookSearch.trim()) {
      alert('Enter a keyword to search.');
      return;
    }

    const keyword = bookSearch.toLowerCase();

    const filtered = books.filter((book) => {
      const values = [
        book.title,
        book.author,
        book.genre,
        book.publisher,
        book.language,
        book.description,
        book.year_published?.toString(),
        book.overdue_rate?.toString(),
        book.lost_price?.toString(),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return values.includes(keyword);
    });

    setFilteredBooks(filtered);
    setSelectedBook(null);
  };

  // Date validation
  const isDueDateValid = (dateStr) => {
    const today = new Date();
    const selectedDate = new Date(dateStr);
    today.setHours(0, 0, 0, 0); // Remove time for accurate comparison
    selectedDate.setHours(0, 0, 0, 0);
    return selectedDate >= today;
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!borrower || !selectedBook || !dueDate) {
      alert('Please complete borrower, book and due date fields.');
      return;
    }

    if (!isDueDateValid(dueDate)) {
      alert('Due date cannot be earlier than today.');
      return;
    }

    const payload = {
      borrowerId: borrower._id,
      bookId: selectedBook._id,
      dueDate
    };

    const res = await fetch('/api/borrowers/issue', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      router.push('/borrowers/list');
    } else {
      const err = await res.json();
      alert(err.error || 'Failed to issue book.');
    }
  };

  return (
    <div className="container mt-4">
      <h2>Issue Book</h2>
      <form onSubmit={handleSubmit}>

        {/* Step 1: Borrower */}
        <div className="mb-5 border p-3 rounded bg-light">
          <h5>Step 1: Search Borrower by Email</h5>
          <div className="input-group mb-3">
            <input
              type="email"
              className="form-control"
              placeholder="Enter borrower email"
              value={borrowerEmail}
              onChange={(e) => setBorrowerEmail(e.target.value)}
              required
            />
            <button type="button" className="btn btn-secondary" onClick={handleBorrowerSearch}>
              Search Borrower
            </button>
          </div>
          {borrower && (
            <div className="alert alert-success">
              <strong>Name:</strong> {borrower.name} <br />
              <strong>Email:</strong> {borrower.email} <br />
              <strong>Phone:</strong> {borrower.phone} <br />
              <strong>Address:</strong> {borrower.address}
            </div>
          )}
        </div>

        {/* Step 2: Book */}
        <div className="mb-5 border p-3 rounded bg-light">
          <h5>Step 2: Search Book by Any Field</h5>
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Enter keyword (e.g. title, author, genre...)"
              value={bookSearch}
              onChange={(e) => setBookSearch(e.target.value)}
            />
            <button type="button" className="btn btn-secondary" onClick={handleBookSearch}>
              Search Book
            </button>
          </div>

          {filteredBooks.length > 0 && (
            <div className="mt-3">
              <h6>Matching Books:</h6>
              <ul className="list-group">
                {filteredBooks.map((b, index) => (
                  <li
                    key={index}
                    className={`list-group-item ${selectedBook?._id === b._id ? 'list-group-item-primary' : ''}`}
                  >
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <strong>{b.title}</strong> by {b.author}<br />
                        <small>{b.genre} | {b.publisher} | {b.year_published}</small>
                      </div>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => setSelectedBook(b)}
                      >
                        Select
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {selectedBook && (
            <div className="alert alert-info mt-3">
              <strong>Selected Book:</strong><br />
              <strong>Title:</strong> {selectedBook.title} <br />
              <strong>Author:</strong> {selectedBook.author} <br />
              <strong>Genre:</strong> {selectedBook.genre} <br />
              <strong>Publisher:</strong> {selectedBook.publisher} <br />
              <strong>Year Published:</strong> {selectedBook.year_published} <br />
              <strong>Overdue Rate:</strong> {selectedBook.overdue_rate} <br />
              <strong>Lost Price:</strong> {selectedBook.lost_price}
            </div>
          )}
        </div>

        {/* Step 3: Due Date */}
        <div className="mb-4 border p-3 rounded bg-light">
          <h5>Step 3: Set Due Date & Issue</h5>
          <div className="mb-3">
            <label className="form-label">Due Date</label>
            <input
              type="date"
              className="form-control"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
              min={new Date().toISOString().split('T')[0]} // Prevent past dates in UI
            />
          </div>
          <button type="submit" className="btn btn-primary">Issue Book</button>
        </div>
      </form>
    </div>
  );
}
