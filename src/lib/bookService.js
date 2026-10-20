import { db } from './db.js';

export const bookService = {
  async create(data, userId) {
    const book = {
      user_id: userId,
      title: data.title?.trim(),
      author: data.author?.trim() || '',
      isbn: data.isbn?.trim() || '',
      year: data.year || null,
      genre: data.genre?.trim() || '',
      status: data.status || 'want-to-read',
      notes: data.notes?.trim() || '',
      created_at: new Date().toISOString()
    };
    if (!book.title) throw new Error('Title is required');
    return await db.books.add(book);
  },

  async list(userId, { search = '', genre = '', status = '' } = {}) {
    let collection = db.books.where('user_id').equals(userId);
    const all = await collection.toArray();
    return all.filter(b => {
      if (search) {
        const q = search.toLowerCase();
        if (!b.title?.toLowerCase().includes(q) && !b.author?.toLowerCase().includes(q)) return false;
      }
      if (genre && b.genre !== genre) return false;
      if (status && b.status !== status) return false;
      return true;
    });
  },

  async get(id) {
    return await db.books.get(id);
  },

  async update(id, updates, userId) {
    const book = await db.books.get(id);
    if (!book || book.user_id !== userId) throw new Error('Not found');
    return await db.books.update(id, { ...updates, updated_at: new Date().toISOString() });
  },

  async remove(id, userId) {
    const book = await db.books.get(id);
    if (!book || book.user_id !== userId) throw new Error('Not found');
    return await db.books.delete(id);
  },

  async count(userId) {
    return await db.books.where('user_id').equals(userId).count();
  },

  async stats(userId) {
    const books = await db.books.where('user_id').equals(userId).toArray();
    const total = books.length;
    const byStatus = books.reduce((acc, b) => {
      acc[b.status] = (acc[b.status] || 0) + 1;
      return acc;
    }, {});
    const byGenre = books.reduce((acc, b) => {
      if (b.genre) acc[b.genre] = (acc[b.genre] || 0) + 1;
      return acc;
    }, {});
    return { total, byStatus, byGenre };
  }
};
