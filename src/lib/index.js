export { default as db } from './db.js';
export { default as bookService } from './bookService.js';
export { default as isbnLookup } from './isbnLookup.js';

// Expose ISBN lookup to window for use in components
if (typeof window !== 'undefined') {
  window.lookupByISBN = isbnLookup.lookupByISBN;
  window.fetchFromGoogleBooks = isbnLookup.fetchFromGoogleBooks;
  window.fetchFromOpenLibrary = isbnLookup.fetchFromOpenLibrary;
}