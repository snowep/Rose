import Dexie from 'dexie';

// Simple local DB for Rose
export const db = new Dexie('RoseDB');

db.version(1).stores({
  users: '++id, email, password_hash, plan, created_at',
  books: '++id, title, author, isbn, year, genre, status, created_at'
});

export default db;
