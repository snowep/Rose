import db from './db.js';

/**
 * Book Service - Handles all book-related database operations
 */

/**
 * Add a new book to the library
 * @param {Object} bookData - The book data to add
 * @returns {Promise<number>} - The ID of the newly added book
 */
export const addBook = async (bookData) => {
  // Ensure we have a dateAdded if not provided
  const bookToAdd = {
    ...bookData,
    dateAdded: bookData.dateAdded || new Date().toISOString(),
    dateModified: new Date().toISOString()
  };

  return await db.books.add(bookToAdd);
};

/**
 * Get all books from the library
 * @returns {Promise<Array>} - Array of book objects
 */
export const getAllBooks = async () => {
  return await db.books.toArray();
};

/**
 * Get a book by its ID
 * @param {number|string} id - The book ID
 * @returns {Promise<Object|null>} - The book object or null if not found
 */
export const getBookById = async (id) => {
  return await db.books.get(id);
};

/**
 * Get a book by its ISBN
 * @param {string} isbn - The book ISBN
 * @returns {Promise<Object|null>} - The book object or null if not found
 */
export const getBookByIsbn = async (isbn) => {
  return await db.books.where('isbn').equals(isbn).first();
};

/**
 * Update a book
 * @param {number|string} id - The book ID
 * @param {Object} updates - The fields to update
 * @returns {Promise<boolean>} - True if updated, false if not found
 */
export const updateBook = async (id, updates) => {
  const updateData = {
    ...updates,
    dateModified: new Date().toISOString()
  };

  const count = await db.books.update(id, updateData);
  return count > 0;
};

/**
 * Delete a book
 * @param {number|string} id - The book ID
 * @returns {Promise<boolean>} - True if deleted, false if not found
 */
export const deleteBook = async (id) => {
  const count = await db.books.delete(id);
  return count > 0;
};

/**
 * Search books by title, author, or tags
 * @param {string} query - The search query
 * @returns {Promise<Array>} - Array of matching books
 */
export const searchBooks = async (query) => {
  if (!query.trim()) {
    return await db.books.toArray();
  }

  const lowerQuery = query.toLowerCase();
  return await db.books.filter(book =>
    book.title.toLowerCase().includes(lowerQuery) ||
    book.author.toLowerCase().includes(lowerQuery) ||
    (book.tags && book.tags.some(tag =>
      tag.toLowerCase().includes(lowerQuery)))
  ).toArray();
};

/**
 * Get all unique tags from the library
 * @returns {Promise<Array>} - Array of unique tag strings
 */
export const getAllTags = async () => {
  const books = await db.books.toArray();
  const tagsSet = new Set();

  books.forEach(book => {
    if (book.tags && Array.isArray(book.tags)) {
      book.tags.forEach(tag => tagsSet.add(tag));
    }
  });

  return Array.from(tagsSet);
};

/**
 * Get books by tag
 * @param {string} tag - The tag to filter by
 * @returns {Promise<Array>} - Array of books with the given tag
 */
export const getBooksByTag = async (tag) => {
  return await db.books.filter(book =>
    book.tags && Array.isArray(book.tags) && book.tags.includes(tag)
  ).toArray();
};

/**
 * Get reading statistics
 * @returns {Promise<Object>} - Statistics about reading progress
 */
export const getReadingStats = async () => {
  const books = await db.books.toArray();

  const totalBooks = books.length;
  const completedBooks = books.filter(b => b.status === 'completed').length;
  const readingBooks = books.filter(b => b.status === 'reading').length;
  const wantToReadBooks = books.filter(b => b.status === 'want-to-read').length;

  // Calculate average progress for reading books
  const readingProgressSum = books
    .filter(b => b.status === 'reading' && b.progress !== undefined)
    .reduce((sum, b) => sum + (b.progress || 0), 0);

  const avgProgress = readingBooks > 0
    ? Math.round(readingProgressSum / readingBooks)
    : 0;

  return {
    totalBooks,
    completedBooks,
    readingBooks,
    wantToReadBooks,
    avgProgress
  };
};

/**
 * Initialize the database with some default tags if needed
 * @returns {Promise<void>}
 */
export const initializeDefaultTags = async () => {
  const existingTags = await db.tags.toArray();
  if (existingTags.length === 0) {
    const defaultTags = [
      'Fiction', 'Non-Fiction', 'Science Fiction', 'Fantasy',
      'Mystery', 'Thriller', 'Romance', 'Biography', 'History',
      'Self-Help', 'Technology', 'Programming', 'Science'
    ];

    await db.tags.bulkAdd(defaultTags.map(name => ({ name })));
  }
};

export default {
  addBook,
  getAllBooks,
  getBookById,
  getBookByIsbn,
  updateBook,
  deleteBook,
  searchBooks,
  getAllTags,
  getBooksByTag,
  getReadingStats,
  initializeDefaultTags
};