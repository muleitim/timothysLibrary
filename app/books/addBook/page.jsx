'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AddBookPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    genre: '',
    publisher: '',
    language: '',
    description: '',
    year_published: '',
    status: 'available',
    overdue_rate: '',
    lost_price: '',
    imageBase64: '',
  });

  const [preview, setPreview] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({ ...prev, imageBase64: reader.result }));
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/books/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      setSuccess('Book added successfully!');
      setFormData({
        title: '',
        author: '',
        genre: '',
        publisher: '',
        language: '',
        description: '',
        year_published: '',
        status: 'available',
        overdue_rate: '',
        lost_price: '',
        imageBase64: '',
      });
      setPreview('');
      setTimeout(() => router.push('/books/list'), 1000);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Add a New Book</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      <form onSubmit={handleSubmit}>
        <div className="row g-3">
          {['title', 'author', 'genre', 'publisher', 'language', 'year_published', 'overdue_rate', 'lost_price'].map((field) => (
            <div className="col-md-6" key={field}>
              <label className="form-label text-capitalize">{field.replace('_', ' ')}</label>
              <input
                type={['year_published', 'overdue_rate', 'lost_price'].includes(field) ? 'number' : 'text'}
                className="form-control"
                name={field}
                value={formData[field]}
                onChange={handleChange}
                required
              />
            </div>
          ))}

          <div className="col-12">
            <label className="form-label">Description</label>
            <textarea
              className="form-control"
              name="description"
              rows="7"
              value={formData.description}
              onChange={handleChange}
              required
            ></textarea>
          </div>

          <div className="col-md-4">
            <label className="form-label">Status</label>
            <select className="form-select" name="status" value={formData.status} onChange={handleChange}>
              <option value="available">Available</option>
              <option value="issued">Issued</option>
            </select>
          </div>

          <div className="col-md-6">
            <label className="form-label">Book Cover Image</label>
            <input type="file" accept="image/*" className="form-control" onChange={handleImageUpload} />
          </div>

          {preview && (
            <div className="col-md-6">
              <label className="form-label">Preview</label>
              <img src={preview} alt="Preview" className="img-thumbnail" style={{ maxHeight: '200px' }} />
            </div>
          )}
        </div>

        <button type="submit" className="btn btn-primary mt-4">
          Submit
        </button>
      </form>
    </div>
  );
}
