'use client'

import Dexie, { Table } from 'dexie'

export interface Book {
  id?: string
  title: string
  author: string
  status: 'reading' | 'read' | 'want-to-read'
  genre?: string
  rating?: number
  pages?: number
  startedAt?: string
  finishedAt?: string
  coverImage?: string
  notes?: string
  tags?: string[]
  progress?: number
  dailyLog?: { date: string; pagesRead: number }[]
  createdAt: string
  updatedAt: string

  // Core Book Identity
  subtitle?: string
  originalTitle?: string
  isbn10?: string
  isbn13?: string
  barcode?: string
  asin?: string
  coverThumbnail?: string
  language?: string
  edition?: string
  volumeNumber?: number

  // Authors and Contributors
  authorRole?: string
  contributorName?: string
  contributorRole?: string
  translator?: string
  editor?: string
  illustrator?: string
  coverArtist?: string

  // Series
  seriesName?: string
  seriesNumber?: number
  totalVolumes?: number
  subSeries?: string

  // Publisher
  publisherName?: string
  imprint?: string
  publisherWebsite?: string
  publisherEmail?: string
  publisherPhone?: string
  publisherCity?: string
  publisherCountry?: string

  // Publication
  publicationDate?: string
  publicationYear?: number
  firstPublishedDate?: string
  publicationCountry?: string
  publicationCity?: string
  copyrightYear?: number

  // Retail and Purchase
  purchaseSource?: string
  purchasePrice?: number
  purchaseDate?: string
  currency?: string
  msrp?: number
  discountedPrice?: number
  retailerName?: string
  retailerUrl?: string
  stockStatus?: string

  // Format and Physical Details
  format?: string
  binding?: string
  width?: number
  height?: number
  depth?: number
  weight?: number
  coverType?: string
  paperType?: string
  dustJacket?: boolean
  signed?: boolean
  firstEdition?: boolean
  rareBook?: boolean
  condition?: string
  conditionNotes?: string

  // Content and Organization
  description?: string
  summary?: string
  subjects?: string[]
  keywords?: string[]
  ageRange?: string
  readingLevel?: string
  contentWarnings?: string[]
  tableOfContents?: string

  // Classification
  deweyDecimal?: string
  libraryOfCongressClassification?: string
  collectionName?: string
  readingCategory?: string

  // Library Location
  room?: string
  shelf?: string
  section?: string
  row?: string
  bin?: string
  position?: string
  locationNotes?: string

  // Inventory
  inventoryStatus?: string
  totalCopies?: number
  availableCopies?: number
  reservedCopies?: number
  lostStatus?: boolean
  damagedStatus?: boolean
  withdrawnStatus?: boolean
  dateAdded?: string
  lastCheckedDate?: string

  // Ownership
  ownedStatus?: boolean
  ownerName?: string
  acquiredBy?: string
  gift?: boolean
  donation?: boolean
  inherited?: boolean
  provenance?: string
  ownershipNotes?: string

  // Reading Status
  progressPage?: number
  lastReadDate?: string
  review?: string
  readingNotes?: string
  favorite?: boolean
  recommendedBy?: string

  // Lending
  loanedStatus?: boolean
  borrowerName?: string
  borrowerContact?: string
  borrowerEmail?: string
  borrowerPhone?: string
  loanDate?: string
  dueDate?: string
  returnDate?: string
  loanNotes?: string

  // Digital Book
  digitalStatus?: boolean
  fileFormat?: string
  fileSize?: number
  drmStatus?: boolean
  storageLocation?: string
  deviceApp?: string
  downloadUrl?: string
  license?: string

  // Related Works
  relatedTitle?: string
  relationshipType?: string
  relatedIsbn?: string
  relatedNotes?: string

  // Extra Details
  awards?: string[]
  adaptations?: string[]
  citations?: string[]

  // Metadata
  dataSource?: string
  verifiedStatus?: boolean
  recordVersion?: number
}

class RoseDB extends Dexie {
  books!: Table<Book, string>

  constructor() {
    super('rose')
    this.version(2).stores({
      books: 'id, title, author, status, genre, rating, createdAt, isbn13, isbn10, seriesName, publisherName, publicationYear'
    })
    this.books.hook('creating', (primKey, obj) => {
      obj.createdAt = new Date().toISOString()
      obj.updatedAt = new Date().toISOString()
      if (!obj.id) obj.id = crypto.randomUUID()
    })
    this.books.hook('updating', (modifications, primKey, obj, transaction) => {
      ;(modifications as any).updatedAt = new Date().toISOString()
    })
  }
}

export const db = new RoseDB()
