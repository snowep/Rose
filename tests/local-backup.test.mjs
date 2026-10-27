import assert from 'node:assert/strict'
import test from 'node:test'
import { performance } from 'node:perf_hooks'
import {
  getBackupDuplicateReport,
  LOCAL_BACKUP_FORMAT,
  LOCAL_BACKUP_VERSION,
  MAX_LOCAL_BACKUP_BYTES,
  parseLocalBackup,
} from '../src/lib/local-backup.ts'

const createdAt = '2026-10-27T00:00:00.000Z'

function createBackup(overrides = {}) {
  return {
    format: LOCAL_BACKUP_FORMAT,
    version: LOCAL_BACKUP_VERSION,
    createdAt,
    ownerUserId: 'user-1',
    data: {
      books: [{
        id: 'book-1',
        title: 'A Book',
        author: 'An Author',
        status: 'reading',
        createdAt,
        updatedAt: createdAt,
        tags: ['fiction'],
        dailyLog: [{ date: '2026-10-27', pagesRead: 10 }],
      }],
      people: [{ id: 'person-1', first_name: 'An', last_name: 'Author' }],
      userBooks: [{ id: 'shelf-1', user_id: 'user-1', book_id: 'book-1' }],
    },
    ...overrides,
  }
}

test('parses valid backup records while preserving data and IDs', () => {
  const parsed = parseLocalBackup(JSON.stringify(createBackup()))

  assert.equal(parsed.data.books[0].id, 'book-1')
  assert.deepEqual(parsed.data.books[0].dailyLog, [{ date: '2026-10-27', pagesRead: 10 }])
  assert.equal(parsed.data.people[0].id, 'person-1')
  assert.equal(parsed.data.userBooks[0].id, 'shelf-1')
})

test('rejects invalid JSON and unsupported backup versions', () => {
  assert.throws(() => parseLocalBackup('{'), /not valid JSON/)
  assert.throws(
    () => parseLocalBackup(JSON.stringify(createBackup({ version: 99 }))),
    /format or version is not supported/,
  )
})

test('rejects invalid book fields and duplicate record IDs', () => {
  const invalidBook = createBackup()
  invalidBook.data.books[0].status = 'unknown'
  assert.throws(() => parseLocalBackup(JSON.stringify(invalidBook)), /invalid book/)

  const duplicateBooks = createBackup()
  duplicateBooks.data.books.push({ ...duplicateBooks.data.books[0] })
  assert.throws(() => parseLocalBackup(JSON.stringify(duplicateBooks)), /duplicate IDs/)
})

test('rejects shelf entries with mismatched ownership or missing book references', () => {
  const wrongOwner = createBackup()
  wrongOwner.data.userBooks[0].user_id = 'user-2'
  assert.throws(() => parseLocalBackup(JSON.stringify(wrongOwner)), /ownership or book references/)

  const missingBook = createBackup()
  missingBook.data.userBooks[0].book_id = 'missing-book'
  assert.throws(() => parseLocalBackup(JSON.stringify(missingBook)), /ownership or book references/)
})

test('rejects unsafe object keys and oversized backup files', () => {
  const unsafeKeys = `{"format":"${LOCAL_BACKUP_FORMAT}","version":${LOCAL_BACKUP_VERSION},"createdAt":"${createdAt}","ownerUserId":null,"data":{"books":[],"people":[],"userBooks":[]},"__proto__":{}}`
  assert.throws(() => parseLocalBackup(unsafeKeys), /unsupported object keys/)
  assert.throws(
    () => parseLocalBackup(' '.repeat(MAX_LOCAL_BACKUP_BYTES + 1)),
    /25 MB size limit/,
  )
})

test('reports existing IDs and possible ISBN duplicates separately', () => {
  const backup = createBackup({
    data: {
      books: [
        { id: 'book-1', title: 'Existing ID', author: 'Author', status: 'reading', createdAt, updatedAt: createdAt },
        { id: 'book-2', title: 'Same ISBN', author: 'Author', status: 'read', isbn13: '9781234567890', createdAt, updatedAt: createdAt },
      ],
      people: [{ id: 'person-1', first_name: 'An', last_name: 'Author' }],
      userBooks: [{ id: 'shelf-1', user_id: 'user-1', book_id: 'book-1' }],
    },
  })

  const report = getBackupDuplicateReport(backup, {
    books: [{ id: 'book-1', title: 'Existing ID' }, { id: 'other', title: 'Matching ISBN', isbn13: '9781234567890' }],
    people: [{ id: 'person-1' }],
    userBooks: [{ id: 'shelf-1' }],
  })

  assert.deepEqual(report.duplicateIds, { books: 1, people: 1, userBooks: 1 })
  assert.deepEqual(report.possibleBookDuplicates, [{ id: 'book-2', title: 'Same ISBN' }])
})

test('validates a realistic library-sized backup within the import budget', () => {
  const count = 10_000
  const books = Array.from({ length: count }, (_, index) => ({
    id: `book-${index}`,
    title: `Book ${index}`,
    author: 'Author',
    status: 'read',
    createdAt,
    updatedAt: createdAt,
  }))
  const lastBookId = books[count - 1].id
  const userBooks = Array.from({ length: count }, (_, index) => ({
    id: `shelf-${index}`,
    user_id: 'user-1',
    book_id: lastBookId,
  }))
  const contents = JSON.stringify(createBackup({
    data: { books, people: [], userBooks },
  }))

  const startedAt = performance.now()
  const parsed = parseLocalBackup(contents)
  const elapsedMs = performance.now() - startedAt

  assert.equal(parsed.data.books.length, count)
  assert.equal(parsed.data.userBooks.length, count)
  assert.ok(elapsedMs < 5_000, `10,000-book backup validation took ${elapsedMs.toFixed(0)}ms`)
})
