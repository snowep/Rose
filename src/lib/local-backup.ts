'use client'

export const LOCAL_BACKUP_FORMAT = '1.0.0'
export const LOCAL_BACKUP_VERSION = 1
export const MAX_LOCAL_BACKUP_BYTES = 25 * 1024 * 1024 // 25 MB

export interface LocalBackupPerson {
  id: string
  first_name?: string
  last_name?: string
  sort_name?: string
  first_name_original?: string
  last_name_original?: string
  nationality?: string
  birth_year?: number
  death_year?: number
  biography?: string
  website?: string
  photo_url?: string
  created_at?: string
  updated_at?: string
}

export interface LocalBackupUserBook {
  id: string
  user_id: string
  book_id: string
  read_count?: number
  added_at?: string
}

export interface LocalBackupBook {
  id: string
  title: string
  author?: string
  status?: 'want-to-read' | 'reading' | 'read' | 'on-hold' | 'dnf'
  genre?: string
  rating?: number
  pages?: number
  progress?: number
  coverImage?: string
  subtitle?: string
  isbn10?: string
  isbn13?: string
  publicationYear?: number | string
  language?: string
  tags?: string[]
  created_at?: string
  updated_at?: string
  dailyLog?: Array<{ date: string; pagesRead?: number }>
}

export interface LocalBackup {
  format: string
  version: number
  createdAt: string
  ownerUserId?: string
  data: {
    books: LocalBackupBook[]
    people: LocalBackupPerson[]
    userBooks: LocalBackupUserBook[]
    readingSessions?: Array<{
      bookId: string
      date: string
      startTime: string
      endTime?: string
      pagesRead: number
    }>
  }
}

export function parseLocalBackup(contents: string): LocalBackup {
  const data = JSON.parse(contents)

  // Validate format
  if (data.format !== LOCAL_BACKUP_FORMAT) {
    throw new Error('format is not supported')
  }

  if (data.version !== LOCAL_BACKUP_VERSION) {
    throw new Error('format or version is not supported')
  }

  // Sanitize proto-chain and unsafe keys
  const cleaned = JSON.parse(JSON.stringify(data))

  // Remove unsafe prototype keys
  delete (cleaned as any).__proto__
  delete (cleaned as any).constructor

  // Validate required fields
  if (!cleaned.data || !cleaned.data.books) {
    throw new Error('Invalid backup structure')
  }

  // Validate book records
  for (const book of cleaned.data.books) {
    if (!book.id || !book.title) {
      throw new Error('invalid book')
    }
    // Validate status if present
    if (book.status && !['want-to-read', 'reading', 'read', 'on-hold', 'dnf'].includes(book.status)) {
      throw new Error('invalid book')
    }
  }

  // Validate people records
  for (const person of cleaned.data.people) {
    if (!person.id) {
      throw new Error('Invalid backup structure')
    }
  }

  // Validate userBooks records
  for (const entry of cleaned.data.userBooks) {
    if (!entry.id || !entry.user_id || !entry.book_id) {
      throw new Error('ownership or book references')
    }
  }

  return cleaned as LocalBackup
}

export function getBackupDuplicateReport(
  backup: LocalBackup,
  existing: {
    books: { id: string; isbn13?: string }[]
    people: { id: string }[]
    userBooks: { id: string }[]
  }
) {
  const report = {
    duplicateIds: { books: 0, people: 0, userBooks: 0 },
    possibleBookDuplicates: [] as { id: string; title: string }[],
  }

  const existingBookIds = new Set(existing.books.map((b) => b.id))
  const existingPeopleIds = new Set(existing.people.map((p) => p.id))
  const existingUserBookIds = new Set(existing.userBooks.map((e) => e.id))

  // Check duplicate IDs in backup
  const bookIdCounts: Record<string, number> = {}
  for (const book of backup.data.books) {
    bookIdCounts[book.id] = (bookIdCounts[book.id] || 0) + 1
  }
  for (const [id, count] of Object.entries(bookIdCounts)) {
    if (count > 1) {
      report.duplicateIds.books++
    }
  }

  const peopleIdCounts: Record<string, number> = {}
  for (const person of backup.data.people) {
    peopleIdCounts[person.id] = (peopleIdCounts[person.id] || 0) + 1
  }
  for (const [id, count] of Object.entries(peopleIdCounts)) {
    if (count > 1) {
      report.duplicateIds.people++
    }
  }

  const userBookIdCounts: Record<string, number> = {}
  for (const entry of backup.data.userBooks) {
    userBookIdCounts[entry.id] = (userBookIdCounts[entry.id] || 0) + 1
  }
  for (const [id, count] of Object.entries(userBookIdCounts)) {
    if (count > 1) {
      report.duplicateIds.userBooks++
    }
  }

  // Check for possible duplicates by ISBN
  const isbnIndex: Record<string, { id: string; title: string }[]> = {}
  for (const book of backup.data.books) {
    if (book.isbn13) {
      if (!isbnIndex[book.isbn13]) {
        isbnIndex[book.isbn13] = []
      }
      isbnIndex[book.isbn13].push({ id: book.id, title: book.title })
    }
  }
  for (const isbn of Object.keys(isbnIndex)) {
    const booksWithSameIsbn = isbnIndex[isbn]
    if (booksWithSameIsbn.length > 1) {
      // Only report if not already in existing
      for (const b of booksWithSameIsbn) {
        if (!existingBookIds.has(b.id)) {
          report.possibleBookDuplicates.push(b)
        }
      }
    }
  }

  return report
}