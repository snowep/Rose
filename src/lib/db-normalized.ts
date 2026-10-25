import Dexie, { Table } from 'dexie';

export class RoseNormalizedDB extends Dexie {
  books!: Table<{ id: string; title: string; subtitle?: string; original_title?: string; isbn10?: string; isbn13?: string; barcode?: string; asin?: string; cover_thumbnail?: string; language?: string; edition?: string; volume_number?: number; format?: string; publication_year?: number; publication_date?: Date; pages?: number; data_source?: string; verified_status?: boolean; record_version?: number; created_at: Date; updated_at: Date; deleted_at?: Date }>;
  people!: Table<{ id: string; first_name?: string; last_name?: string; middle_name?: string; full_name?: string; birth_year?: number; death_year?: number; nationality?: string; biography?: string; created_at: Date; updated_at: Date }>;
  roles!: Table<{ id: string; name: string; description?: string; created_at: Date }>;
  book_people!: Table<{ book_id: string; person_id: string; role_id: string; primary_sequence?: number; is_primary?: boolean; created_at: Date }>;
  series!: Table<{ id: string; name: string; description?: string; total_volumes?: number; start_year?: number; end_year?: number; created_at: Date; updated_at: Date }>;
  book_series!: Table<{ book_id: string; series_id: string; volume_number?: number; is_main_volume?: boolean; created_at?: Date }>;
  genres!: Table<{ id: string; name: string; description?: string; parent_id?: string; created_at: Date; updated_at: Date }>;
  book_genres!: Table<{ book_id: string; genre_id: string; is_primary?: boolean; created_at?: Date }>;
  subjects!: Table<{ id: string; name: string; description?: string; created_at: Date }>;
  book_subjects!: Table<{ book_id: string; subject_id: string; is_primary?: boolean; created_at?: Date }>;
  tags!: Table<{ id: string; name: string; category?: string; created_at: Date }>;
  book_tags!: Table<{ book_id: string; tag_id: string; is_primary?: boolean; created_at?: Date }>;
  content_warnings!: Table<{ id: string; title: string; description?: string; level?: string; category?: string; created_at: Date }>;
  book_content_warnings!: Table<{ book_id: string; warning_type: string; severity?: number; notes?: string }>;
  publishers!: Table<{ id: string; name: string; imprint?: string; website?: string; email?: string; phone?: string; city?: string; country?: string; created_at: Date; updated_at: Date }>;
  book_publishers!: Table<{ book_id: string; publisher_id: string; published_date?: Date; is_first_edition?: boolean; created_at?: Date }>;
  distributor_types!: Table<{ id: string; name: string; description?: string; created_at: Date }>;
  distributors!: Table<{ id: string; name: string; type_id?: string; website?: string; contact_email?: string; contact_phone?: string; created_at: Date; updated_at: Date }>;
  book_distributors!: Table<{ book_id: string; distributor_id: string; retailer_price?: number; retailer_currency?: string; stock_status?: string; url?: string; notes?: string; created_at?: Date; updated_at?: Date }>;
  retailers!: Table<{ id: string; name: string; url?: string; country?: string; created_at: Date; updated_at: Date }>;
  book_retailers!: Table<{ book_id: string; retailer_id: string; price?: number; purchase_date?: Date; currency?: string; stock_status?: string; acquired_at?: Date }>;
  rooms!: Table<{ id: string; name: string; description?: string; building?: string; floor?: number; created_at: Date; updated_at: Date }>;
  shelves!: Table<{ id: string; name: string; room_id?: string; capacity?: number; current_count?: number; position?: number; created_at: Date; updated_at: Date }>;
  book_copies!: Table<{ id: string; book_id: string; copy_number: number; condition?: string; location_id?: string; status?: string; acquired_method?: string; acquired_source?: string; acquired_at?: Date; purchased_price?: number; purchased_currency?: string; msrp?: number; notes?: string; created_at: Date; updated_at: Date }>;
  owners!: Table<{ id: string; first_name?: string; last_name?: string; email?: string; phone?: string; created_at: Date; updated_at: Date }>;
  acquisition_sources!: Table<{ id: string; name: string; type?: string; contact_info?: string; created_at: Date; updated_at: Date }>;
  acquisition_methods!: Table<{ id: string; name: string; description?: string; created_at: Date }>;
  book_ownership_records!: Table<{ id: string; book_copy_id?: string; owner_id?: string; acquired_method_id?: string; acquired_at?: Date; source_id?: string; gift_donor?: string; inheritance_from?: string; notes?: string; created_at: Date }>;
  reading_statuses!: Table<{ id: string; book_id: string; user_id?: string; status: string; started_at?: Date; completed_at?: Date; progress_page?: number; rating?: number; review?: string; read_date?: Date; notes?: string; created_at: Date; updated_at: Date }>;
  borrowers!: Table<{ id: string; first_name: string; last_name: string; email?: string; phone?: string; address?: string; created_at: Date; updated_at: Date }>;
  loans!: Table<{ id: string; book_copy_id?: string; borrower_id: string; loan_date?: Date; due_date: Date; return_date?: Date; status?: string; renewal_count?: number; notes?: string; created_at: Date; updated_at: Date }>;
  file_formats!: Table<{ id: string; name: string; description?: string; created_at: Date }>;
  file_size_units!: Table<{ id: string; name: string; created_at: Date }>;
  license_types!: Table<{ id: string; name: string; description?: string; created_at: Date }>;
  digital_files!: Table<{ id: string; book_id: string; file_format_id?: string; license_type_id?: string; file_size?: number; storage_location?: string; device_app?: string; download_url?: string; drm_status?: string; last_opened_at?: Date; times_opened?: number; notes?: string; created_at: Date; updated_at: Date }>;
  book_images!: Table<{ id: string; book_id: string; image_url: string; image_type?: string; description?: string; resolution?: string; source?: string; is_primary?: boolean; created_at: Date }>;
  awards!: Table<{ id: string; name: string; description?: string; year?: number; category?: string; organization?: string; created_at: Date }>;
  book_awards!: Table<{ book_id: string; award_id: string; received?: boolean; notes?: string }>;
  relationship_types!: Table<{ id: string; name: string; description?: string; created_at: Date }>;
  book_related_works!: Table<{ book_id: string; related_book_id: string; relationship_type_id?: string }>;
  classification_schemes!: Table<{ id: string; name: string; description?: string; created_at: Date }>;
  classifications!: Table<{ id: string; scheme_id?: string; code: string; description?: string; valid_from?: Date; valid_to?: Date; created_at: Date }>;

  constructor() {
    super('RoseNormalizedDB');
    this.version(1).stores({
      books: 'id, title, isbn13, isbn10, asin, language, format, publication_year, created_at, updated_at',
      people: 'id, first_name, last_name, full_name, nationality, created_at',
      roles: 'id, name, created_at',
      book_people: '[book_id+person_id+role_id], book_id, person_id, role_id',
      series: 'id, name, total_volumes, created_at',
      book_series: '[book_id+series_id], book_id, series_id, volume_number',
      genres: 'id, name, parent_id, created_at',
      book_genres: '[book_id+genre_id], book_id, genre_id',
      subjects: 'id, name, created_at',
      book_subjects: '[book_id+subject_id], book_id, subject_id',
      tags: 'id, name, category, created_at',
      book_tags: '[book_id+tag_id], book_id, tag_id',
      content_warnings: 'id, title, level, category, created_at',
      book_content_warnings: '[book_id+warning_type], book_id, warning_type',
      publishers: 'id, name, city, country, created_at',
      book_publishers: '[book_id+publisher_id], book_id, publisher_id',
      distributor_types: 'id, name, created_at',
      distributors: 'id, name, type_id, created_at',
      book_distributors: '[book_id+distributor_id], book_id, distributor_id',
      retailers: 'id, name, country, created_at',
      book_retailers: '[book_id+retailer_id], book_id, retailer_id, stock_status',
      rooms: 'id, name, building, created_at',
      shelves: 'id, name, room_id, position, created_at',
      book_copies: 'id, book_id, copy_number, status, location_id, created_at',
      owners: 'id, first_name, last_name, created_at',
      acquisition_sources: 'id, name, type, created_at',
      acquisition_methods: 'id, name, created_at',
      book_ownership_records: 'id, book_copy_id, owner_id, acquired_at, created_at',
      reading_statuses: 'id, book_id, status, started_at, completed_at, created_at',
      borrowers: 'id, first_name, last_name, email, created_at',
      loans: 'id, book_copy_id, borrower_id, due_date, status, created_at',
      file_formats: 'id, name, created_at',
      file_size_units: 'id, name, created_at',
      license_types: 'id, name, created_at',
      digital_files: 'id, book_id, file_format_id, drm_status, created_at',
      book_images: 'id, book_id, image_type, is_primary, created_at',
      awards: 'id, name, year, category, created_at',
      book_awards: '[book_id+award_id], book_id, award_id',
      relationship_types: 'id, name, created_at',
      book_related_works: '[book_id+related_book_id], book_id, related_book_id',
      classification_schemes: 'id, name, created_at',
      classifications: 'id, scheme_id, code, created_at'
    });

    const timestampTables = [
      'books','people','series','publishers','distributors','retailers',
      'rooms','shelves','book_copies','owners','acquisition_sources',
      'reading_statuses','borrowers','loans','digital_files','awards'
    ] as const;

    timestampTables.forEach(name => {
      const table = (this as any)[name] as Table<any>;
      table.hook('creating', (primKey, obj) => {
        const now = new Date();
        if (!obj.created_at) obj.created_at = now;
        obj.updated_at = now;
        return true;
      });
      table.hook('updating', (mods, primKey, obj) => {
        if (mods && typeof mods === 'object') {
          ;(mods as any).updated_at = new Date();
        }
        return true;
      });
    });
  }
}

export const normalizedDb = new RoseNormalizedDB();
