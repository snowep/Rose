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

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

function isOptionalString(value: unknown): boolean {
  return value === undefined || typeof value === 'string'
}

function isOptionalNumber(value: unknown): boolean {
  return value === undefined || (typeof value === 'number' && Number.isFinite(value))
}

function hasSafeKeys(value: unknown): boolean {
  if (Array.isArray(value)) return value.every(hasSafeKeys)
  if (!isRecord(value)) return true

  return Object.entries(value).every(([key, child]) =>
    key !== '__proto__' &&
    key !== 'prototype' &&
    key !== 'constructor' &&
    hasSafeKeys(child)
  )
}

function isLocalBackupBook(value: unknown): value is LocalBackupBook {
  if (
    !isRecord(value) ||
    !isNonEmptyString(value.id) ||
    !isNonEmptyString(value.title)
  ) {
    return false
  }

  const stringFields = [
    'author', 'genre', 'coverImage', 'subtitle', 'isbn10', 'isbn13',
    'language', 'created_at', 'updated_at',
  ]
  if (!stringFields.every((field) => isOptionalString(value[field]))) return false

  if (
    value.status !== undefined &&
    value.status !== 'want-to-read' &&
    value.status !== 'reading' &&
    value.status !== 'read' &&
    value.status !== 'on-hold' &&
    value.status !== 'dnf'
  ) {
    return false
  }

  if (
    !isOptionalNumber(value.rating) ||
    !isOptionalNumber(value.pages) ||
    !isOptionalNumber(value.progress)
  ) {
    return false
  }

  if (
    value.publicationYear !== undefined &&
    typeof value.publicationYear !== 'number' &&
    typeof value.publicationYear !== 'string'
  ) {
    return false
  }

  if (
    value.tags !== undefined &&
    (!Array.isArray(value.tags) || !value.tags.every((tag) => typeof tag === 'string'))
  ) {
    return false
  }

  return value.dailyLog === undefined || (
    Array.isArray(value.dailyLog) &&
    value.dailyLog.every((entry: unknown) =>
      isRecord(entry) &&
      typeof entry.date === 'string' &&
      (
        entry.pagesRead === undefined ||
        (typeof entry.pagesRead === 'number' && Number.isFinite(entry.pagesRead))
      )
    )
  )
}

function isLocalBackupPerson(value: unknown): value is LocalBackupPerson {
  if (!isRecord(value) || !isNonEmptyString(value.id)) return false

  const stringFields = [
    'first_name', 'last_name', 'sort_name', 'first_name_original',
    'last_name_original', 'nationality', 'biography', 'website', 'photo_url',
    'created_at', 'updated_at',
  ]
  return stringFields.every((field) => isOptionalString(value[field])) &&
    isOptionalNumber(value.birth_year) &&
    isOptionalNumber(value.death_year)
}

function isLocalBackupUserBook(value: unknown): value is LocalBackupUserBook {
  return isRecord(value) &&
    isNonEmptyString(value.id) &&
    isNonEmptyString(value.user_id) &&
    isNonEmptyString(value.book_id) &&
    isOptionalNumber(value.read_count) &&
    isOptionalString(value.added_at)
}

function isReadingSession(
  value: unknown
): value is NonNullable<LocalBackup['data']['readingSessions']>[number] {
  if (!isRecord(value)) return false

  return isNonEmptyString(value.bookId) &&
    isNonEmptyString(value.date) &&
    isNonEmptyString(value.startTime) &&
    (value.endTime === undefined || typeof value.endTime === 'string') &&
    typeof value.pagesRead === 'number' &&
    Number.isFinite(value.pagesRead)
}

function isLocalBackup(value: unknown): value is LocalBackup {
  if (
    !isRecord(value) ||
    value.format !== LOCAL_BACKUP_FORMAT ||
    value.version !== LOCAL_BACKUP_VERSION ||
    !isNonEmptyString(value.createdAt) ||
    (value.ownerUserId !== undefined && typeof value.ownerUserId !== 'string') ||
    !isRecord(value.data)
  ) {
    return false
  }

  const data = value.data
  return Array.isArray(data.books) &&
    data.books.every(isLocalBackupBook) &&
    Array.isArray(data.people) &&
    data.people.every(isLocalBackupPerson) &&
    Array.isArray(data.userBooks) &&
    data.userBooks.every(isLocalBackupUserBook) &&
    (
      data.readingSessions === undefined ||
      (
        Array.isArray(data.readingSessions) &&
        data.readingSessions.every(isReadingSession)
      )
    )
}

export function parseLocalBackup(contents: string): LocalBackup {
  if (new TextEncoder().encode(contents).byteLength > MAX_LOCAL_BACKUP_BYTES) {
    throw new Error('25 MB size limit')
  }

  let parsed: unknown
  try {
    parsed = JSON.parse(contents)
  } catch {
    throw new Error('not valid JSON')
  }

  if (!isRecord(parsed) || parsed.format !== LOCAL_BACKUP_FORMAT) {
    throw new Error('format is not supported')
  }

  if (parsed.version !== LOCAL_BACKUP_VERSION) {
    throw new Error('format or version is not supported')
  }

  if (!hasSafeKeys(parsed)) {
    throw new Error('unsupported object keys')
  }

  if (
    !isRecord(parsed.data) ||
    !Array.isArray(parsed.data.books) ||
    !Array.isArray(parsed.data.people) ||
    !Array.isArray(parsed.data.userBooks)
  ) {
    throw new Error('Invalid backup structure')
  }
  if (!parsed.data.books.every(isLocalBackupBook)) {
    throw new Error('invalid book')
  }
  if (!parsed.data.people.every(isLocalBackupPerson)) {
    throw new Error('Invalid backup structure')
  }
  if (!parsed.data.userBooks.every(isLocalBackupUserBook)) {
    throw new Error('ownership or book references')
  }
  if (
    parsed.data.readingSessions !== undefined &&
    (
      !Array.isArray(parsed.data.readingSessions) ||
      !parsed.data.readingSessions.every(isReadingSession)
    )
  ) {
    throw new Error('Invalid backup structure')
  }

  if (!isLocalBackup(parsed)) {
    throw new Error('Invalid backup structure')
  }

  // Validate book records - check for duplicate IDs within backup
  const bookIdCounts: Record<string, number> = {}
  for (const book of parsed.data.books) {
    bookIdCounts[book.id] = (bookIdCounts[book.id] || 0) + 1
  }
  for (const [id, count] of Object.entries(bookIdCounts)) {
    if (count > 1) {
      throw new Error('duplicate IDs')
    }
  }

  // Validate people records - check for duplicate IDs
  const peopleIdCounts: Record<string, number> = {}
  for (const person of parsed.data.people) {
    peopleIdCounts[person.id] = (peopleIdCounts[person.id] || 0) + 1
  }
  for (const [id, count] of Object.entries(peopleIdCounts)) {
    if (count > 1) {
      throw new Error('duplicate IDs')
    }
  }

  // Validate userBooks records - check for duplicate IDs and ownership/book references
  const userBookIdCounts: Record<string, number> = {}
  for (const entry of parsed.data.userBooks) {
    // Check ownership matches
    if (parsed.ownerUserId && entry.user_id !== parsed.ownerUserId) {
      throw new Error('ownership or book references')
    }
    userBookIdCounts[entry.id] = (userBookIdCounts[entry.id] || 0) + 1
  }
  for (const [id, count] of Object.entries(userBookIdCounts)) {
    if (count > 1) {
      throw new Error('duplicate IDs')
    }
  }

  // Validate book references exist
  const bookIds = new Set(parsed.data.books.map((book) => book.id))
  for (const entry of parsed.data.userBooks) {
    if (!bookIds.has(entry.book_id)) {
      throw new Error('ownership or book references')
    }
  }

  if (parsed.data.readingSessions?.some((session) => !bookIds.has(session.bookId))) {
    throw new Error('Invalid reading session book reference')
  }

  return parsed
}

function countDuplicates<T extends { id: string }>(
  backupItems: T[],
  existingIds: Set<string>,
  getBackupCounts: (items: T[]) => Record<string, number>
): { vsExisting: number; withinBackup: number } {
  let vsExisting = 0
  const counts = getBackupCounts(backupItems)
  for (const [id, count] of Object.entries(counts)) {
    if (existingIds.has(id)) vsExisting++
    else if (count > 1) vsExisting += count // All duplicates count
  }
  return { vsExisting, withinBackup: 0 }
}

export function getBackupDuplicateReport(
  backup: LocalBackup,
  existing: {
    books: { id: string; isbn13?: string; title?: string }[]
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

  // Count duplicate IDs (vs existing + within backup) for each type
  const countIds = (items: { id: string }[], existingIds: Set<string>) => {
    const counts: Record<string, number> = {}
    for (const item of items) counts[item.id] = (counts[item.id] || 0) + 1
    let total = 0
    for (const [id, count] of Object.entries(counts)) {
      if (existingIds.has(id)) total += count
      else if (count > 1) total += 1 // Count each duplicate group once, not all occurrences
    }
    return total
  }

  report.duplicateIds.books = countIds(backup.data.books, existingBookIds)
  report.duplicateIds.people = countIds(backup.data.people, existingPeopleIds)
  report.duplicateIds.userBooks = countIds(backup.data.userBooks, existingUserBookIds)

  // Check for possible duplicates by ISBN
  const isbnIndex: Record<string, { id: string; title: string }[]> = {}
  // First index existing books by ISBN
  const existingIsbnMap: Record<string, { id: string; title: string }[]> = {}
  for (const book of existing.books) {
    if (book.isbn13) {
      if (!existingIsbnMap[book.isbn13]) {
        existingIsbnMap[book.isbn13] = []
      }
      existingIsbnMap[book.isbn13].push({ id: book.id, title: book.title || '' })
    }
  }

  // Then index backup books by ISBN
  for (const book of backup.data.books) {
    if (book.isbn13) {
      if (!isbnIndex[book.isbn13]) {
        isbnIndex[book.isbn13] = []
      }
      isbnIndex[book.isbn13].push({ id: book.id, title: book.title })
    }
  }

  // Check for duplicates within backup
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

  // Check for duplicates between backup and existing
  for (const isbn of Object.keys(isbnIndex)) {
    const backupBooks = isbnIndex[isbn]
    const existingBooksWithSameIsbn = existingIsbnMap[isbn] || []
    if (existingBooksWithSameIsbn.length > 0) {
      for (const b of backupBooks) {
        if (!existingBookIds.has(b.id)) {
          report.possibleBookDuplicates.push(b)
        }
      }
    }
  }

  return report
}