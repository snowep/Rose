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

export function isValidISBN13(isbn: string): boolean {
  const clean = normalizeISBN(isbn)
  if (clean.length !== 13) return false
  if (!/^\d{13}$/.test(clean)) return false
  // ISBN-13 checksum validation
  let sum = 0
  for (let i = 0; i < 12; i++) {
    sum += parseInt(clean[i]) * (i % 2 === 0 ? 1 : 3)
  }
  const check = (10 - (sum % 10)) % 10
  return check === parseInt(clean[12])
}

export function isValidISBN10(isbn: string): boolean {
  const clean = normalizeISBN(isbn)
  if (clean.length !== 10) return false
  if (!/^\d{9}[\dX]$/i.test(clean)) return false
  // ISBN-10 checksum validation
  let sum = 0
  for (let i = 0; i < 9; i++) {
    sum += parseInt(clean[i]) * (10 - i)
  }
  const checkChar = clean[9].toUpperCase()
  const check = checkChar === 'X' ? 10 : parseInt(checkChar)
  return (sum + check) % 11 === 0
}

export function isValidISBN(isbn: string): boolean {
  return isValidISBN13(isbn) || isValidISBN10(isbn)
}

export async function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}

export function base64ToBlob(base64: string, mime?: string): Blob {
  // Handle both data URL and raw base64
  let base64Data = base64
  let detectedMime = mime
  if (base64.startsWith('data:')) {
    const matches = base64.match(/^data:([^;]+);base64,(.+)$/)
    if (!matches) throw new Error('Invalid data URL format')
    detectedMime = detectedMime || matches[1]
    base64Data = matches[2]
  }
  const binary = atob(base64Data)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  return new Blob([bytes], { type: detectedMime })
}

export async function lookupISBN(isbn: string, options: { timeout?: number } = {}): Promise<{
  title: string
  subtitle?: string
  author?: string
  publisher?: string
  genre?: string
  pages?: number
  publicationYear?: number
} | null> {
  const clean = normalizeISBN(isbn)
  if (!isValidISBN(clean)) return null

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), options.timeout ?? 5000)

  try {
    const response = await fetch(`https://openlibrary.org/api/books?bibkeys=ISBN:${clean}&format=json&jscmd=data`, {
      signal: controller.signal,
    })
    if (!response.ok) return null
    const data = await response.json()
    const bookData = data[`ISBN:${clean}`]
    if (!bookData) return null

    return {
      title: bookData.title || '',
      subtitle: bookData.subtitle,
      author: bookData.authors?.[0]?.name,
      publisher: bookData.publishers?.[0]?.name,
      genre: bookData.subjects?.[0]?.name,
      pages: bookData.number_of_pages,
      publicationYear: bookData.publish_date ? new Date(bookData.publish_date).getFullYear() : undefined,
    }
  } catch {
    return null
  } finally {
    clearTimeout(timeoutId)
  }
}