import db from './db.js';

/**
 * Loan Service - Handles all loan-related database operations
 */

/**
 * Add a new loan record
 * @param {Object} loanData - The loan data to add
 * @returns {Promise<number>} - The ID of the newly added loan
 */
export const addLoan = async (loanData) => {
  const loanToAdd = {
    ...loanData,
    dateLoaned: loanData.dateLoaned || new Date().toISOString(),
  };

  return await db.loans.add(loanToAdd);
};

/**
 * Get all loans from the library
 * @returns {Promise<Array>} - Array of loan objects
 */
export const getAllLoans = async () => {
  return await db.loans.toArray();
};

/**
 * Get a loan by its ID
 * @param {number|string} id - The loan ID
 * @returns {Promise<Object|null>} - The loan object or null if not found
 */
export const getLoanById = async (id) => {
  return await db.loans.get(id);
};

/**
 * Get loans by book ID
 * @param {number|string} bookId - The book ID
 * @returns {Promise<Array>} - Array of loan objects for the given book
 */
export const getLoansByBookId = async (bookId) => {
  return await db.loans.where('bookId').equals(parseInt(bookId)).toArray();
};

/**
 * Get active loans (not returned)
 * @returns {Promise<Array>} - Array of active loan objects
 */
export const getActiveLoans = async () => {
  return await db.loans.where('dateReturned').equals(null).toArray();
};

/**
 * Update a loan
 * @param {number|string} id - The loan ID
 * @param {Object} updates - The fields to update
 * @returns {Promise<boolean>} - True if updated, false if not found
 */
export const updateLoan = async (id, updates) => {
  const count = await db.loans.update(id, updates);
  return count > 0;
};

/**
 * Delete a loan
 * @param {number|string} id - The loan ID
 * @returns {Promise<boolean>} - True if deleted, false if not found
 */
export const deleteLoan = async (id) => {
  const count = await db.loans.delete(id);
  return count > 0;
};

/**
 * Mark a loan as returned
 * @param {number|string} id - The loan ID
 * @param {string} returnDate - The return date (ISO string)
 * @returns {Promise<boolean>} - True if updated, false if not found
 */
export const returnLoan = async (id, returnDate = new Date().toISOString()) => {
  return await updateLoan(id, { dateReturned: returnDate });
};

export default {
  addLoan,
  getAllLoans,
  getLoanById,
  getLoansByBookId,
  getActiveLoans,
  updateLoan,
  deleteLoan,
  returnLoan
};