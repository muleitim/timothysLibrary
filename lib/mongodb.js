// lib/mongodb.js
import { MongoClient } from 'mongodb';
import { ensureUniqueEmailIndex } from './setupIndexes'; // ✅ Add this line

const uri = process.env.MONGODB_URI;
const options = {};

let client;
let clientPromise;

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your Mongo URI to .env.local');
}

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

// ✅ Call index setup AFTER connection is established
clientPromise.then(() => {
  ensureUniqueEmailIndex()
    .then(() => console.log('\n✅ Unique email index ensured\n'))
    .catch(err => console.error('❌ Failed to ensure index:', err));
});

export default clientPromise;
