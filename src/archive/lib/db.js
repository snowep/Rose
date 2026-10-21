import Dexie from 'dexie';

export const db = new Dexie('LibraryDB');

db.version(1).stores({
  books: '++id, isbn, title, author, publisher, publishedDate, pageCount, coverUrl, tags, status, progress, dateAdded, dateModified',
  tags: '++id, name',
  loans: '++id, bookId, borrowerName, borrowerEmail, dateLoaned, dateDue, dateReturned, notes'
});

db.version(2).stores({
  books: '++id, isbn, title, author, publisher, publishedDate, pageCount, coverUrl, tags, status, progress, dateAdded, dateModified, subtitle, edition, format, language, description, seriesName, seriesNumber, rating, review, startedAt, finishedAt, currentPage, acquiredAt, notes, coverUrl'
});

// We'll also create a table for settings if needed (e.g., theme preference)
// db.version(1).stores({ ... }); // already defined above

// We can also add indexes for querying
// Dexie automatically indexes the primary key (id) and we've indexed isbn in books.

// Export the db instance for use in other files
export default db;