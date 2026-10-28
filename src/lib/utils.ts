export function generateId(): string {
  return crypto.randomUUID()
}

export function nowISO(): string {
  return new Date().toISOString()
}

export function todayISO(): string {
  return nowISO().split('T')[0]
}

export function normalizeISBN(isbn: string): string {
  return isbn.replace(/[-\s]/g, '')
}