import { db } from './db.js';

// Simple bcrypt-like hashing via Web Crypto
async function hashPassword(password) {
  const enc = new TextEncoder();
  const data = enc.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export const authService = {
  async register({ email, password, plan = 'free' }) {
    const existing = await db.users.where('email').equalsIgnoreCase(email).first();
    if (existing) throw new Error('Email already in use');
    const password_hash = await hashPassword(password);
    const created_at = new Date().toISOString();
    const id = await db.users.add({ email, password_hash, plan, created_at });
    return { id, email, plan, created_at };
  },

  async login({ email, password }) {
    const password_hash = await hashPassword(password);
    const user = await db.users.where('email').equalsIgnoreCase(email).first();
    if (!user || user.password_hash !== password_hash) {
      throw new Error('Invalid email or password');
    }
    // Return minimal user data
    const { password_hash: _, ...safe } = user;
    return safe;
  },

  async getUserById(id) {
    const user = await db.users.get(id);
    if (!user) return null;
    const { password_hash: _, ...safe } = user;
    return safe;
  },
};
