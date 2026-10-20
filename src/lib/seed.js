import { db } from './db.js';
import { authService } from './auth.js';

// Auto seed on first load
export async function seedUsers() {
  const count = await db.users.count();
  if (count > 0) return;
  
  const password = '12345678';
  await authService.register({ email: 'admin@rose.local', password, plan: 'premium' });
  await authService.register({ email: 'user@rose.local', password, plan: 'free' });
  console.log('Seeded admin@rose.local and user@rose.local with password 12345678');
}
