/**
 * ISBN Lookup Service - Fetches book metadata from Google Books API
 * Falls back to Open Library if Google Books fails
 */

/**
 * Fetch book details from Google Books API using an ISBN
 * @param {string} isbn - The ISBN-13 or ISBN-10 number
 * @returns {Promise<Object>} - Book metadata (title, author, publisher, cover, etc.)
 */
export const fetchFromGoogleBooks = async (isbn) => {
  try {
    // Clean the ISBN - remove hyphens and spaces
    const cleanIsbn = isbn.replace(/[\s-]+/g, '');

    // Try Google Books API first
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=isbn:${cleanIsbn}`
    );

    if (!response.ok) {
      throw new Error('Google Books API request failed');
    }

    const data = await response.json();

    if (data.totalItems === 0 || !data.items) {
      throw new Error('No results found in Google Books');
    }

    const volume = data.items[0].volumeInfo;

    return {
      title: volume.title || 'Unknown Title',
      author: volume.authors ? volume.authors.join(', ') : 'Unknown Author',
      publisher: volume.publisher || '',
      publishedDate: volume.publishedDate || new Date().getFullYear(),
      pageCount: volume.pageCount,
      coverUrl: volume.imageLinks
        ? volume.imageLinks.thumbnail
          ? `http://books.google.com/books/content?id=${data.items[0].id}&printsec=frontcover&img=1`
          : null
        : null,
    };
  } catch (error) {
    console.error('Google Books API error:', error.message);
    throw error;
  }
};

/**
 * Fetch book details from Open Library API using an ISBN
 * @param {string} isbn - The ISBN-13 or ISBN-10 number
 * @returns {Promise<Object>} - Book metadata
 */
export const fetchFromOpenLibrary = async (isbn) => {
  try {
    const cleanIsbn = isbn.replace(/[\s-]+/g, '');

    const response = await fetch(
      `https://openlibrary.org/api/books?bibkeys=ISBN:${cleanIsbn}&format=json&jscmd=data`
    );

    if (!response.ok) {
      throw new Error('Open Library API request failed');
    }

    const data = await response.json();
    const key = `ISBN:${cleanIsbn}`;
    const bookData = data[key];

    if (!bookData) {
      throw new Error('No results found in Open Library');
    }

    const authors = bookData.authors
      ? bookData.authors.map((a) => a.name).join(', ')
      : 'Unknown Author';

    return {
      title: bookData.title || 'Unknown Title',
      author: authors,
      publisher: bookData.publishers?.[0] || '',
      publishedDate: bookData.publish_date || new Date().getFullYear(),
      pageCount: bookData.number_of_pages,
      coverUrl: null, // Open Library cover API call would go here
    };
  } catch (error) {
    console.error('Open Library API error:', error.message);
    throw error;
  }
};

/**
 * Main lookup function - tries Google Books first, then Open Library
 * @param {string} isbn - The ISBN number
 * @returns {Promise<Object>} - Book metadata
 */
export const lookupByISBN = async (isbn) => {
  try {
    return await fetchFromGoogleBooks(isbn);
  } catch (googleError) {
    try {
      return await fetchFromOpenLibrary(isbn);
    } catch (openLibraryError) {
      // If both fail, re-throw the last error
      throw new Error(
        `Could not find book with ISBN ${isbn}. Both Google Books and Open Library failed.`
      );
    }
  }
};

export default { lookupByISBN, fetchFromGoogleBooks, fetchFromOpenLibrary };