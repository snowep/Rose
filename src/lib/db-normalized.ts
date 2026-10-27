import Dexie, { Table } from 'dexie';

export class RoseNormalizedDB extends Dexie {
  books!: Table<{ id: string; title: string; subtitle?: string; original_title?: string; isbn10?: string; isbn13?: string; barcode?: string; asin?: string; cover_thumbnail?: string; language?: string; edition?: string; volume_number?: number; format?: string; publication_year?: number; publication_date?: Date; pages?: number; data_source?: string; verified_status?: boolean; record_version?: number; created_at: Date; updated_at: Date; deleted_at?: Date }>;
  people!: Table<{ id: string; first_name?: string; last_name?: string; middle_name?: string; full_name?: string; birth_year?: number; death_year?: number; nationality?: string; biography?: string; created_at: Date; updated_at: Date }>;
  roles!: Table<{ id: string; name: string; description?: string; created_at: Date }>;
  book_people!: Table<{ book_id: string; person_id: string; role_id: string; primary_sequence?: number; is_primary?: boolean; created_at: Date }>;
  publishers!: Table<{ id: string; name: string; created_at: Date; updated_at: Date }>;
  book_publishers!: Table<{ book_id: string; publisher_id: string; is_primary?: boolean; created_at?: Date }>;
  user_books!: Table<{ id: string; user_id: string; book_id: string; read_count?: number; status: string; progress?: number; rating?: number; cover_image?: string; notes?: string; tags?: string[]; added_at: Date; updated_at: Date }>;
  reading_logs!: Table<{ id: string; user_id: string; book_id: string; log_date: Date; logged_at?: Date; pages_read?: number; status?: string; created_at: Date; updated_at: Date }>;

  constructor() {
    super('RoseNormalizedDB');
    this.version(1).stores({
      books: 'id, title, isbn13, isbn10, asin, language, format, publication_year, created_at, updated_at',
      people: 'id, first_name, last_name, full_name, nationality, created_at',
      roles: 'id, name, created_at',
      book_people: '[book_id+person_id+role_id], book_id, person_id, role_id',
      publishers: 'id, name, created_at',
      book_publishers: '[book_id+publisher_id], book_id, publisher_id',
      user_books: '[user_id+book_id], user_id, book_id, status, created_at',
      reading_logs: '[user_id+book_id+log_date], user_id, book_id, log_date, created_at'
    });

    const timestampTables = [
      'books','people','publishers','user_books','reading_logs'
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
