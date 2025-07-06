'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AddBorrowerPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  const [error, setError] = useState('');

  const handleChange = e => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError(''); // Clear error when user types
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    const res = await fetch('/api/borrowers', {
      method: 'POST',
      body: JSON.stringify(form)
    });

    if (res.ok) {
      router.push('/borrowers/list');
    } else if (res.status === 409) {
      const data = await res.json();
      setError(data.error); // "Email already exists"
    } else {
      setError('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="container mt-4">
      <h2>Add New Borrower</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Name</label>
          <input name="name" className="form-control" onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label>Email</label>
          <input name="email" className="form-control" onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label>Phone</label>
          <input name="phone" className="form-control" onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label>Address</label>
          <input name="address" className="form-control" onChange={handleChange} />
        </div>
        <button className="btn btn-primary">Add Borrower</button>
      </form>
    </div>
  );
}
