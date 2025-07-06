// app/api/borrowers/search/route.js

import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email');

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  try {
    const client = await clientPromise;
    const db = client.db(); // default database, or use db('your-db-name')
    const borrower = await db.collection('borrowers').findOne({ email: email.toLowerCase() });

    if (!borrower) {
      return NextResponse.json({ error: 'Borrower not found' }, { status: 404 });
    }

    // Convert _id to string for frontend
    borrower._id = borrower._id.toString();

    return NextResponse.json(borrower);
  } catch (err) {
    console.error('Error in borrower search:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
