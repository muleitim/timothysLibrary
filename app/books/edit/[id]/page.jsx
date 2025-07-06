'use client';

import { useEffect, use, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function EditBookPage({ params }) {
  const router = useRouter();
  const { id } = use(params);

  const [form, setForm] = useState({
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
    image: '', // Will hold the base64 string
  });

  // Fetch book details
  useEffect(() => {
    const fetchBook = async () => {
      const res = await fetch(`/api/books/${id}`);
      const data = await res.json();
      const book = data.book;

      setForm({
        title: book.title || '',
        author: book.author || '',
        genre: book.genre || '',
        publisher: book.publisher || '',
        language: book.language || '',
        description: book.description || '',
        year_published: book.year_published || '',
        status: book.status || 'available',
        overdue_rate: book.overdue_rate || '',
        lost_price: book.lost_price || '',
        image: book.image || book.imageBase64 || '',
      });
    };

    fetchBook();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setForm({ ...form, image: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch(`/api/books/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      router.push('/books/search');
    } else {
      alert('Failed to update book');
    }
  };

  return (
    <div className="container my-5">
      <h2>Edit Book</h2>
      <form onSubmit={handleSubmit}>
        {Object.entries(form).map(([key, value]) => {
          if (key === '_id' || key === 'createdAt' || key === 'imageBase64') return null;

          if (key === 'image') {
            return (
              <div className="mb-3" key={key}>
                <label className="form-label fw-bold ">Image</label>
                <input
                  type="file"
                  accept="image/*"
                  className="form-control"
                  onChange={handleFileChange}
                />
                {form.image && (
                  <div className="mt-2">
                    <img
                      src={form.image}
                      alt="Current"
                      style={{ maxWidth: '200px', height: 'auto' }}
                    />
                  </div>
                )}
              </div>
            );
          }

          return (
            <div className="mb-3" key={key}>
              <label className="form-label text-capitalize fw-bold">{key.replace('_', ' ')}:</label>
              {key === 'description' ? (
                <textarea
                  name={key}
                  rows="7"
                  className="form-control"
                  value={value}
                  onChange={handleChange}
                />
              ) : (
                <input
                  type={
                    ['year_published', 'overdue_rate', 'lost_price'].includes(key)
                      ? 'number'
                      : 'text'
                  }
                  name={key}
                  className="form-control"
                  value={value}
                  onChange={handleChange}
                />
              )}
            </div>
          );
        })}

        <button type="submit" className="btn btn-primary">
          Update
        </button>
      </form>
    </div>
  );
}
