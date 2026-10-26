/*
 * Database entry point providing the flat Book interface (backward compatible)
 * and the normalized database instance.
 *
 * The original Book interface and db are preserved for existing code.
 * For the full 21-category normalized schema across Supabase and IndexedDB,
 * import NormalizedBook from ./db-types and normalizedDb from ./db-normalized.
 */

import { normalizedDb } from './db-normalized'

// Original flat Book interface preserved for backward compatibility
export interface Book {
  id?: string
  title: string
  author: string
  status: 'reading' | 'read' | 'want-to-read' | 'on-hold' | 'dnf'
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
  narrator?: string

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

// Export normalized database instance
export { normalizedDb }