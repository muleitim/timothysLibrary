'use client';
import { useEffect, useState } from 'react';

export default function UpdateBooksPage() {
  const [books, setBooks] = useState([]);
  const [editingBook, setEditingBook] = useState(null);
  const [formData, setFormData] = useState({});
  const [preview, setPreview] = useState('');

  const fetchBooks = async () => {
    const res = await fetch('/api/books');
    const data = await res.json();
    setBooks(data);
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleEditClick = (book) => {
    setEditingBook(book._id);
    setFormData({ ...book });
    setPreview(book.imageBase64);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({ ...prev, imageBase64: reader.result }));
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleUpdate = async () => {
    const res = await fetch(`/api/books/${editingBook}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    if (res.ok) {
      setEditingBook(null);
      fetchBooks();
    } else {
      alert(data.error || 'Failed to update book');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this book?')) return;
    const res = await fetch(`/api/books/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (res.ok) fetchBooks();
    else alert(data.error || 'Failed to delete book');
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Update or Delete Books</h2>
      <div className="row row-cols-1 row-cols-md-2 g-4">
        {books.map((book) => (
          <div className="col" key={book._id}>
            <div className="card h-100">
              {book.imageBase64 && (
                <img
                  src={book.imageBase64}
                  className="card-img-top"
                  alt="cover"
                  style={{ height: '200px', objectFit: 'cover' }}
                />
              )}

              <div className="card-body">
                {editingBook === book._id ? (
                  <>
                    {['title', 'author', 'genre', 'publisher', 'language', 'year_published', 'overdue_rate', 'lost_price'].map((field) => (
                      <div className="mb-2" key={field}>
                        <label className="form-label fw-bold">{field.replace('_', ' ')}</label>
                        <input
                          type={['year_published', 'overdue_rate', 'lost_price'].includes(field) ? 'number' : 'text'}
                          className="form-control"
                          name={field}
                          value={formData[field] || ''}
                          onChange={handleInputChange}
                        />
                      </div>
                    ))}
                    <div className="mb-2">
                      <label className="form-label fw-bold">Status</label>
                      <select name="status" className="form-select" value={formData.status} onChange={handleInputChange}>
                        <option value="available">Available</option>
                        <option value="issued">Issued</option>
                      </select>
                    </div>
                    <div className="mb-2">
                      <label className="form-label fw-bold ">Description</label>
                      <textarea
                        className="form-control"
                        name="description"
                        rows="7"
                        value={formData.description || ''}
                        onChange={handleInputChange}
                      ></textarea>
                    </div>
                    <div className="mb-2">
                      <label className="form-label fw-bold">Update Image</label>
                      <input className="form-control" type="file" onChange={handleImageUpload} />
                      {preview && (
                        <img
                          src={preview}
                          className="img-thumbnail mt-2"
                          style={{ maxHeight: '150px', objectFit: 'cover' }}
                          alt="Preview"
                        />
                      )}
                    </div>
                    <div className="d-flex gap-2">
                      <button className="btn btn-success btn-sm" onClick={handleUpdate}>
                        Save
                      </button>
                      <button className="btn btn-secondary btn-sm" onClick={() => setEditingBook(null)}>
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <h5 className="card-title">{book.title}</h5>
                    <p className="card-text"><strong>Author:</strong> {book.author}</p>
                    <p className="card-text"><strong>Status:</strong> {book.status}</p>
                    <div className="d-flex gap-2">
                      <button className="btn btn-outline-primary btn-sm bg-primary text-white" onClick={() => handleEditClick(book)}>
                        Edit
                      </button>
                      <button className="btn btn-outline-danger btn-sm bg-danger text-white" onClick={() => handleDelete(book._id)}>
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

