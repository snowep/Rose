// Core enums and unions
export type UUID = string;

export type VerifiedStatus = 'verified' | 'unverified' | 'pending' | 'disputed';
export type OwnedStatus = 'owned' | 'wishlist' | 'on_order' | 'pre_ordered' | 'lost' | 'sold' | 'donated' | 'archived';
export type LoanedStatus = 'available' | 'loaned' | 'overdue' | 'lost' | 'reserved';
export type DigitalStatus = 'available' | 'downloading' | 'corrupted' | 'missing' | 'archived';
export type DRMStatus = 'none' | 'adobe' | 'kindle' | 'kobo' | 'nook' | 'apple' | 'google' | 'custom';
export type AwardResult = 'won' | 'nominated' | 'shortlisted' | 'longlisted' | 'honorable_mention';
export type RelationshipType = 'sequel' | 'prequel' | 'companion' | 'spin_off' | 'anthology_includes' | 'anthology_included_in' | 'omnibus_includes' | 'omnibus_included_in' | 'translation_of' | 'translated_as' | 'adaptation_of' | 'adapted_as' | 'inspired_by' | 'inspired' | 'shared_universe' | 'shared_characters' | 'shared_setting' | 'crossover' | 'reference' | 'other';
export type CoverImageType = 'cover' | 'spine' | 'back' | 'interior' | 'dust_jacket' | 'other';
export type FileFormat = 'epub' | 'pdf' | 'mobi' | 'azw' | 'azw3' | 'txt' | 'html' | 'cbz' | 'cbr' | 'djvu' | 'fb2' | 'lit' | 'pdb' | 'rtf' | 'doc' | 'docx' | 'other';
export type FileSizeUnit = 'B' | 'KB' | 'MB' | 'GB' | 'TB';
export type LicenseType = 'purchased' | 'free' | 'public_domain' | 'creative_commons' | 'library_loan' | 'subscription' | 'borrowed' | 'unknown';
export type AcquisitionMethod = 'purchased_new' | 'purchased_used' | 'gift' | 'inherited' | 'library_sale' | 'book_crossing' | 'free_download' | 'review_copy' | 'author_signed' | 'other';
export type Currency = 'USD' | 'EUR' | 'GBP' | 'CAD' | 'AUD' | 'JPY' | 'CNY' | 'INR' | 'BRL' | 'MXN' | 'KRW' | 'SGD' | 'HKD' | 'CHF' | 'NOK' | 'SEK' | 'DKK' | 'PLN' | 'CZK' | 'HUF' | 'RON' | 'BGN' | 'HRK' | 'RUB' | 'TRY' | 'ZAR' | 'THB' | 'IDR' | 'MYR' | 'PHP' | 'VND' | 'TWD' | 'ILS' | 'AED' | 'SAR' | 'QAR' | 'KWD' | 'BHD' | 'OMR' | 'JOD' | 'LBP' | 'EGP' | 'MAD' | 'TND' | 'DZD' | 'KES' | 'UGX' | 'TZS' | 'NGN' | 'GHS' | 'XOF' | 'XAF' | 'Other';
export type DistributorType = 'wholesaler' | 'distributor' | 'fulfillment' | 'print_on_demand' | 'direct' | 'library' | 'educational' | 'subscription' | 'other';
export type RetailerStockStatus = 'in_stock' | 'low_stock' | 'out_of_stock' | 'pre_order' | 'backorder' | 'discontinued' | 'unknown';
export type LanguageCode = 'en' | 'es' | 'fr' | 'de' | 'zh' | 'ja' | 'ko' | 'pt' | 'ru' | 'it' | 'ar' | 'hi' | 'bn' | 'pa' | 'jv' | 'te' | 'mr' | 'ta' | 'ur' | 'tr' | 'vi' | 'pl' | 'uk' | 'nl' | 'ro' | 'el' | 'cs' | 'hu' | 'sv' | 'da' | 'fi' | 'no' | 'sk' | 'hr' | 'sl' | 'et' | 'lv' | 'lt' | 'mt' | 'ga' | 'cy' | 'eu' | 'ca' | 'gl' | 'is' | 'mk' | 'sq' | 'bs' | 'sr' | 'me' | 'Other';
export type RoleType = 'author' | 'translator' | 'editor' | 'illustrator' | 'cover_artist' | 'photographer' | 'foreword_by' | 'afterword_by' | 'introduction_by' | 'preface_by' | 'contributor' | 'narrator' | 'producer' | 'director' | 'other';
export type ClassificationScheme = 'dewey_decimal' | 'library_of_congress' | 'bisac' | 'udc' | 'colon' | 'bliss' | 'custom';

// 1. Core Book
export interface Book {
  id: UUID;
  title: string;
  subtitle?: string;
  originalTitle?: string;
  isbn10?: string;
  isbn13?: string;
  barcode?: string;
  asin?: string;
  coverImage?: string;
  language: LanguageCode;
  edition?: string;
  volumeNumber?: number;
  description?: string;
  keywords?: string[];
  deweyDecimal?: string;
  libraryOfCongressClassification?: string;
  classificationScheme?: ClassificationScheme;
  classificationValue?: string;
  dataSource?: string;
  verifiedStatus: VerifiedStatus;
  notes?: string;
  dateAdded: string;
  dateModified: string;
  totalCopies: number;
  availableCopies: number;
  reservedCopies: number;
}

// 2. People & Roles
export interface Person {
  id: UUID;
  name: string;
  sortName?: string;
  birthDate?: string;
  deathDate?: string;
  nationality?: string;
  biography?: string;
  website?: string;
  photoUrl?: string;
  verifiedStatus: VerifiedStatus;
  dateAdded: string;
  dateModified: string;
}

export interface Role {
  id: UUID;
  name: RoleType;
  displayName: string;
  description?: string;
  sortOrder: number;
}

export interface BookPerson {
  id: UUID;
  bookId: UUID;
  personId: UUID;
  roleId: UUID;
  sortOrder: number;
  notes?: string;
}

// 3. Series
export interface Series {
  id: UUID;
  name: string;
  sortName?: string;
  description?: string;
  website?: string;
  verifiedStatus: VerifiedStatus;
  dateAdded: string;
  dateModified: string;
}

export interface BookSeries {
  id: UUID;
  bookId: UUID;
  seriesId: UUID;
  seriesNumber?: number;
  subSeries?: string;
  subSeriesNumber?: number;
  totalVolumes?: number;
  sortOrder: number;
  notes?: string;
}

// 4. Genres
export interface Genre {
  id: UUID;
  name: string;
  parentId?: UUID;
  description?: string;
  sortOrder: number;
  verifiedStatus: VerifiedStatus;
  dateAdded: string;
  dateModified: string;
}

export interface BookGenre {
  id: UUID;
  bookId: UUID;
  genreId: UUID;
  isPrimary: boolean;
  sortOrder: number;
}

// 5. Subjects
export interface Subject {
  id: UUID;
  name: string;
  authority?: string;
  authorityId?: string;
  parentId?: UUID;
  description?: string;
  sortOrder: number;
  verifiedStatus: VerifiedStatus;
  dateAdded: string;
  dateModified: string;
}

export interface BookSubject {
  id: UUID;
  bookId: UUID;
  subjectId: UUID;
  isPrimary: boolean;
  sortOrder: number;
}

// 6. Tags
export interface Tag {
  id: UUID;
  name: string;
  category?: string;
  description?: string;
  color?: string;
  sortOrder: number;
  dateAdded: string;
  dateModified: string;
}

export interface BookTag {
  id: UUID;
  bookId: UUID;
  tagId: UUID;
  sortOrder: number;
}

// 7. Content Warnings
export interface ContentWarning {
  id: UUID;
  name: string;
  category?: string;
  description?: string;
  severity: 'mild' | 'moderate' | 'severe';
  sortOrder: number;
  dateAdded: string;
  dateModified: string;
}

export interface BookContentWarning {
  id: UUID;
  bookId: UUID;
  contentWarningId: UUID;
  notes?: string;
  sortOrder: number;
}

// 8. Publishers
export interface Publisher {
  id: UUID;
  name: string;
  imprint?: string;
  website?: string;
  city?: string;
  country?: string;
  foundedYear?: number;
  parentCompany?: string;
  verifiedStatus: VerifiedStatus;
  dateAdded: string;
  dateModified: string;
}

export interface BookPublisher {
  id: UUID;
  bookId: UUID;
  publisherId: UUID;
  imprint?: string;
  publicationDate?: string;
  publicationCity?: string;
  publicationCountry?: string;
  isPrimary: boolean;
  sortOrder: number;
}

// 9. Distributors
export interface DistributorTypeDef {
  id: UUID;
  name: DistributorType;
  displayName: string;
  description?: string;
  sortOrder: number;
}

export interface Distributor {
  id: UUID;
  name: string;
  distributorTypeId: UUID;
  website?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  verifiedStatus: VerifiedStatus;
  dateAdded: string;
  dateModified: string;
}

export interface BookDistributor {
  id: UUID;
  bookId: UUID;
  distributorId: UUID;
  distributionDate?: string;
  territory?: string;
  isPrimary: boolean;
  sortOrder: number;
}

// 10. Retailers
export interface Retailer {
  id: UUID;
  name: string;
  website?: string;
  affiliateUrl?: string;
  logoUrl?: string;
  verifiedStatus: VerifiedStatus;
  dateAdded: string;
  dateModified: string;
}

export interface BookRetailer {
  id: UUID;
  bookId: UUID;
  retailerId: UUID;
  retailerUrl?: string;
  retailerPrice?: number;
  retailerCurrency?: Currency;
  retailerStockStatus?: RetailerStockStatus;
  retailerNotes?: string;
  lastChecked: string;
  sortOrder: number;
}

// 11. Rooms & Shelves
export interface Room {
  id: UUID;
  name: string;
  description?: string;
  floor?: number;
  building?: string;
  sortOrder: number;
  dateAdded: string;
  dateModified: string;
}

export interface Shelf {
  id: UUID;
  roomId: UUID;
  name: string;
  label?: string;
  description?: string;
  capacity?: number;
  sortOrder: number;
  dateAdded: string;
  dateModified: string;
}

// 12. Book Copies
export interface BookCopy {
  id: UUID;
  bookId: UUID;
  shelfId?: UUID;
  copyNumber: number;
  condition?: 'new' | 'like_new' | 'very_good' | 'good' | 'acceptable' | 'poor' | 'damaged';
  conditionNotes?: string;
  signed: boolean;
  firstEdition: boolean;
  rareBook: boolean;
  provenance?: string;
  acquisitionPrice?: number;
  acquisitionCurrency?: Currency;
  acquisitionDate?: string;
  locationNotes?: string;
  dateAdded: string;
  dateModified: string;
}

// 13. Ownership
export interface Owner {
  id: UUID;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  notes?: string;
  dateAdded: string;
  dateModified: string;
}

export interface AcquisitionSource {
  id: UUID;
  name: string;
  website?: string;
  type?: 'online' | 'physical' | 'library' | 'personal' | 'other';
  notes?: string;
  dateAdded: string;
  dateModified: string;
}

export interface AcquisitionMethodDef {
  id: UUID;
  name: AcquisitionMethod;
  displayName: string;
  description?: string;
  sortOrder: number;
}

export interface BookOwnershipRecord {
  id: UUID;
  bookId: UUID;
  copyId?: UUID;
  ownerId?: UUID;
  acquiredBy?: UUID;
  acquisitionSourceId?: UUID;
  acquisitionMethodId?: UUID;
  purchasePrice?: number;
  purchaseCurrency?: Currency;
  purchaseDate?: string;
  condition?: 'new' | 'like_new' | 'very_good' | 'good' | 'acceptable' | 'poor' | 'damaged';
  conditionNotes?: string;
  signed: boolean;
  firstEdition: boolean;
  rareBook: boolean;
  provenance?: string;
  ownedStatus: OwnedStatus;
  dateAdded: string;
  dateModified: string;
}

// 14. Reading History
export interface ReadingStatus {
  id: UUID;
  name: string;
  displayName: string;
  description?: string;
  sortOrder: number;
  isActive: boolean;
  color?: string;
}

export interface ReadingLog {
  id: UUID;
  bookId: UUID;
  copyId?: UUID;
  readingStatusId: UUID;
  progressPage?: number;
  progressPercent?: number;
  startDate?: string;
  finishDate?: string;
  rating?: number;
  review?: string;
  isPrivate: boolean;
  dateAdded: string;
  dateModified: string;
}

// 15. Lending
export interface Borrower {
  id: UUID;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  notes?: string;
  dateAdded: string;
  dateModified: string;
}

export interface Loan {
  id: UUID;
  bookId: UUID;
  copyId?: UUID;
  borrowerId: UUID;
  loanedStatus: LoanedStatus;
  loanDate: string;
  dueDate?: string;
  returnDate?: string;
  loanNotes?: string;
  reminderSent: boolean;
  reminderDate?: string;
  dateAdded: string;
  dateModified: string;
}

// 16. Digital Files
export interface FileFormatDef {
  id: UUID;
  name: FileFormat;
  displayName: string;
  mimeType: string;
  extensions: string[];
  supportsDRM: boolean;
  sortOrder: number;
}

export interface FileSizeUnitDef {
  id: UUID;
  name: FileSizeUnit;
  displayName: string;
  bytesMultiplier: number;
}

export interface LicenseTypeDef {
  id: UUID;
  name: LicenseType;
  displayName: string;
  description?: string;
  sortOrder: number;
}

export interface DigitalFile {
  id: UUID;
  bookId: UUID;
  fileFormatId: UUID;
  fileSize?: number;
  fileSizeUnitId?: UUID;
  drmStatus: DRMStatus;
  storageLocation?: string;
  downloadUrl?: string;
  licenseId?: UUID;
  checksum?: string;
  verifiedStatus: VerifiedStatus;
  digitalStatus: DigitalStatus;
  dateAdded: string;
  dateModified: string;
}

// 17. Cover Images
export interface BookImage {
  id: UUID;
  bookId: UUID;
  imageType: CoverImageType;
  imageUrl: string;
  thumbnailUrl?: string;
  isPrimary: boolean;
  sortOrder: number;
  imageNotes?: string;
  width?: number;
  height?: number;
  fileSize?: number;
  dateAdded: string;
  dateModified: string;
}

// 18. Awards
export interface Award {
  id: UUID;
  name: string;
  description?: string;
  website?: string;
  category?: string;
  verifiedStatus: VerifiedStatus;
  dateAdded: string;
  dateModified: string;
}

export interface BookAward {
  id: UUID;
  bookId: UUID;
  awardId: UUID;
  awardYear: number;
  awardResult: AwardResult;
  awardNotes?: string;
  sortOrder: number;
}

// 19. Related Works
export interface RelatedWork {
  id: UUID;
  title: string;
  author?: string;
  isbn13?: string;
  asin?: string;
  publicationYear?: number;
  publisher?: string;
  description?: string;
  verifiedStatus: VerifiedStatus;
  dateAdded: string;
  dateModified: string;
}

export interface RelationshipTypeDef {
  id: UUID;
  name: RelationshipType;
  displayName: string;
  description?: string;
  isDirectional: boolean;
  inverseTypeId?: UUID;
  sortOrder: number;
}

export interface BookRelatedWork {
  id: UUID;
  bookId: UUID;
  relatedWorkId: UUID;
  relationshipTypeId: UUID;
  relatedNotes?: string;
  sortOrder: number;
}

// 20. Classifications
export interface ClassificationSchemeDef {
  id: UUID;
  name: ClassificationScheme;
  displayName: string;
  description?: string;
  authority?: string;
  website?: string;
  sortOrder: number;
}

export interface Classification {
  id: UUID;
  schemeId: UUID;
  code: string;
  name: string;
  parentId?: UUID;
  description?: string;
  level: number;
  sortOrder: number;
  verifiedStatus: VerifiedStatus;
  dateAdded: string;
  dateModified: string;
}

// 21. Lookup Tables
export interface LookupValue {
  id: UUID;
  tableName: string;
  value: string;
  displayName: string;
  description?: string;
  sortOrder: number;
  isActive: boolean;
  parentId?: UUID;
  metadata?: Record<string, unknown>;
  dateAdded: string;
  dateModified: string;
}

// Full book with all relations
export interface BookWithRelations extends Book {
  people: (BookPerson & { person: Person; role: Role })[];
  series: (BookSeries & { series: Series })[];
  genres: (BookGenre & { genre: Genre })[];
  subjects: (BookSubject & { subject: Subject })[];
  tags: (BookTag & { tag: Tag })[];
  contentWarnings: (BookContentWarning & { contentWarning: ContentWarning })[];
  publishers: (BookPublisher & { publisher: Publisher })[];
  distributors: (BookDistributor & { distributor: Distributor; distributorType: DistributorTypeDef })[];
  retailers: (BookRetailer & { retailer: Retailer })[];
  copies: BookCopy[];
  ownership: (BookOwnershipRecord & { owner?: Owner; acquiredBy?: Person; acquisitionSource?: AcquisitionSource; acquisitionMethod?: AcquisitionMethodDef })[];
  readingLogs: (ReadingLog & { readingStatus: ReadingStatus })[];
  loans: (Loan & { borrower: Borrower })[];
  digitalFiles: (DigitalFile & { fileFormat: FileFormatDef; fileSizeUnit?: FileSizeUnitDef; license?: LicenseTypeDef })[];
  images: BookImage[];
  awards: (BookAward & { award: Award })[];
  relatedWorks: (BookRelatedWork & { relatedWork: RelatedWork; relationshipType: RelationshipTypeDef })[];
  shelf?: Shelf & { room: Room };
}

// DTOs
export interface BookCreateInput {
  title: string;
  subtitle?: string;
  originalTitle?: string;
  isbn10?: string;
  isbn13?: string;
  barcode?: string;
  asin?: string;
  coverImage?: string;
  language?: LanguageCode;
  edition?: string;
  volumeNumber?: number;
  description?: string;
  keywords?: string[];
  deweyDecimal?: string;
  libraryOfCongressClassification?: string;
  classificationScheme?: ClassificationScheme;
  classificationValue?: string;
  dataSource?: string;
  verifiedStatus?: VerifiedStatus;
  notes?: string;
  totalCopies?: number;
}

export interface BookUpdateInput extends Partial<BookCreateInput> {
  id: UUID;
}

export interface BookFilter {
  query?: string;
  authorIds?: UUID[];
  seriesIds?: UUID[];
  genreIds?: UUID[];
  subjectIds?: UUID[];
  tagIds?: UUID[];
  publisherIds?: UUID[];
  ownerIds?: UUID[];
  readingStatusIds?: UUID[];
  ownedStatuses?: OwnedStatus[];
  loanedStatuses?: LoanedStatus[];
  digitalStatuses?: DigitalStatus[];
  dateAddedFrom?: string;
  dateAddedTo?: string;
  publicationYearFrom?: number;
  publicationYearTo?: number;
  ratingMin?: number;
  ratingMax?: number;
  hasCopies?: boolean;
  hasDigitalFiles?: boolean;
  isSigned?: boolean;
  isFirstEdition?: boolean;
  isRareBook?: boolean;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
