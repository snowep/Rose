Use relational tables for anything that can repeat. Do not store repeated names as plain text inside the `books` table.

## Updated Categories

### 1. Core Book

Table: `books`

Fields:
- id
- title
- subtitle
- original_title
- isbn10
- isbn13
- barcode
- asin
- publication_year
- edition
- volume_number
- pages
- description
- summary
- format_id
- binding_id
- language_id
- original_language_id
- reading_status_id
- publisher_id
- created_at
- updated_at

Form:
- Title: required text input
- Subtitle: text input
- ISBN: text input with validation
- Publication year: number input
- Format: lookup dropdown
- Binding: lookup dropdown
- Language: searchable dropdown
- Reading status: lookup dropdown or segmented control

---

### 2. Authors / Contributors

Recommended tables:
- `people`
- `roles`
- `book_people`

`people` fields:
- id
- name
- sort_name
- birth_date
- death_date
- nationality
- website
- notes

`roles` fields:
- id
- name

Example roles:
- Author
- Co-author
- Editor
- Translator
- Illustrator
- Cover artist
- Narrator
- Foreword
- Introduction

`book_people` fields:
- book_id
- person_id
- role_id
- is_primary
- position

Form:
- Author search: searchable multi-select dropdown
- Add new author: inline modal or quick-create form
- Role: dropdown from `roles`
- Primary author: toggle or checkbox
- Order/position: number input

If you want a literal author table:
- `authors`
- `book_authors`

But using `people` + `roles` is cleaner because the same person can be author, editor, or translator without duplicate records.

---

### 3. Series

Tables:
- `series`
- `book_series`

`series` fields:
- id
- name
- notes

`book_series` fields:
- book_id
- series_id
- book_number
- sub_series
- notes

Form:
- Series name: searchable dropdown
- Add new series: inline modal
- Series number: number input
- Sub-series: text input

---

### 4. Genres

Tables:
- `genres`
- `book_genres`

`genres` fields:
- id
- name
- slug
- parent_genre_id
- notes

`book_genres` fields:
- book_id
- genre_id

Form:
- Genre: multi-select autocomplete
- Add new genre: inline modal or quick-create

---

### 5. Subjects

Tables:
- `subjects`
- `book_subjects`

`subjects` fields:
- id
- name
- slug
- notes

`book_subjects` fields:
- book_id
- subject_id

Form:
- Subjects: multi-select autocomplete or tag input backed by database

---

### 6. Tags

Tables:
- `tags`
- `book_tags`

`tags` fields:
- id
- name
- slug
- color
- notes

`book_tags` fields:
- book_id
- tag_id

Form:
- Tags: tag input with database search
- Add new tag: quick-create inside tag input

---

### 7. Content Warnings

Tables:
- `content_warnings`
- `book_content_warnings`

`content_warnings` fields:
- id
- name
- severity
- notes

`book_content_warnings` fields:
- book_id
- content_warning_id

Form:
- Content warnings: multi-select autocomplete
- Add new warning: inline modal or quick-create

---

### 8. Publishers

Tables:
- `publishers`
- `book_publishers`

`publishers` fields:
- id
- name
- website
- email
- phone
- city
- country_id
- notes

`book_publishers` fields:
- book_id
- publisher_id
- publisher_role
- imprint
- publication_date
- first_published_date
- copyright_year
- notes

Recommended publisher roles:
- Publisher
- Imprint
- Co-publisher
- Original publisher
- International publisher

Form:
- Publisher: searchable dropdown
- Add new publisher: inline modal
- Publisher role: dropdown
- Imprint: text input
- Publication date: date picker
- Copyright year: number input

---

### 9. Distributors

Tables:
- `distributors`
- `distributor_types`
- `book_distributors`

`distributors` fields:
- id
- name
- distributor_type_id
- country_id
- region
- website
- email
- phone
- notes

`distributor_types` fields:
- id
- name

Example distributor types:
- Wholesaler
- Exclusive distributor
- Regional distributor
- Online distributor
- Print-on-demand
- Ebook distributor
- Audiobook distributor

`book_distributors` fields:
- book_id
- distributor_id
- notes

Form:
- Distributor: searchable multi-select dropdown
- Add new distributor: inline modal
- Distributor type: lookup dropdown
- Country: searchable dropdown
- Notes: textarea

---

### 10. Retailers and Purchase Links

Tables:
- `retailers`
- `book_retailers`

`retailers` fields:
- id
- name
- website
- notes

`book_retailers` fields:
- book_id
- retailer_id
- url
- price
- currency_id
- stock_status
- notes

Form:
- Retailer: searchable dropdown
- Add new retailer: inline modal
- URL: URL input
- Price: number input
- Currency: lookup dropdown
- Stock status: dropdown

---

### 11. Rooms and Shelves

Tables:
- `rooms`
- `shelves`

`rooms` fields:
- id
- name
- notes

`shelves` fields:
- id
- room_id
- name
- section
- row
- bin
- notes

Form:
- Room: searchable dropdown
- Shelf: searchable dropdown filtered by room
- Add new room: inline modal
- Add new shelf: inline modal
- Section/row/bin: text inputs

For single-copy books:
- Add `shelf_id` to `books`

For multiple copies:
- Use `book_copies`

---

### 12. Book Copies / Inventory

Table:
- `book_copies`

Fields:
- id
- book_id
- copy_number
- barcode
- inventory_status_id
- condition_id
- shelf_id
- date_added
- last_checked
- notes

Form:
- Copies: repeater/table
- Copy number: number input
- Barcode: text input
- Inventory status: lookup dropdown
- Condition: lookup dropdown
- Shelf: searchable dropdown
- Date added: date picker
- Last checked: date picker

---

### 13. Ownership and Acquisition

Tables:
- `owners`
- `acquisition_sources`
- `acquisition_methods`
- `book_ownership_records`

`owners` fields:
- id
- name
- notes

`acquisition_sources` fields:
- id
- name
- website
- notes

`acquisition_methods` fields:
- id
- name

Example acquisition methods:
- Purchase
- Gift
- Donation
- Inherited
- Swap
- Library discard

`book_ownership_records` fields:
- book_id
- owner_id
- acquisition_source_id
- acquisition_method_id
- purchase_price
- currency_id
- purchase_date
- provenance
- notes

Form:
- Owner: searchable dropdown
- Acquisition source: searchable dropdown
- Acquisition method: lookup dropdown
- Purchase price: number input
- Currency: lookup dropdown
- Purchase date: date picker
- Provenance: textarea

---

### 14. Reading History

Tables:
- `reading_statuses`
- `reading_logs`

`reading_statuses` fields:
- id
- name

Example statuses:
- Unread
- Reading
- Finished
- On Hold
- DNF

`reading_logs` fields:
- id
- book_id
- reading_status_id
- progress_page
- progress_percent
- started_at
- finished_at
- rating
- review
- notes
- favorite
- created_at

Form:
- Reading status: dropdown or segmented control
- Progress page: number input
- Progress percent: slider
- Start date: date picker
- Finish date: date picker
- Rating: star rating
- Review: textarea
- Notes: textarea
- Favorite: toggle

---

### 15. Lending

Tables:
- `borrowers`
- `loans`

`borrowers` fields:
- id
- name
- email
- phone
- contact_notes

`loans` fields:
- id
- book_id
- copy_id
- borrower_id
- loan_date
- due_date
- return_date
- notes

Form:
- Loaned toggle: toggle
- Borrower: searchable dropdown
- Add new borrower: inline modal
- Loan date: date picker
- Due date: date picker
- Return date: date picker
- Notes: textarea

Show lending fields only when loaned toggle is active.

---

### 16. Digital Files

Tables:
- `digital_files`
- `file_formats`
- `file_size_units`
- `license_types`

`digital_files` fields:
- id
- book_id
- file_format_id
- file_size
- file_size_unit_id
- drm
- storage_location
- download_url
- checksum
- license_type_id
- notes

Form:
- Digital status: toggle
- File format: lookup dropdown
- File size: number input
- File size unit: dropdown
- DRM: toggle
- Storage location: text input
- Download URL: URL input
- Checksum: text input
- License: dropdown

Show digital fields only when digital status is active.

---

### 17. Cover Images

Table:
- `book_images`

Fields:
- id
- book_id
- file_path
- url
- image_type
- is_primary
- notes

Form:
- Cover upload: file upload button + drag-and-drop
- Cover preview: image preview
- Primary cover: toggle or radio button
- Remove image: button
- Cover type: dropdown

Recommended image types:
- Front cover
- Back cover
- Spine
- Dust jacket
- Interior scan
- Other

---

### 18. Awards

Tables:
- `awards`
- `book_awards`

`awards` fields:
- id
- name
- organization
- notes

`book_awards` fields:
- book_id
- award_id
- year
- result
- notes

Form:
- Award: searchable dropdown
- Add new award: inline modal
- Year: number input
- Result: dropdown
- Notes: textarea

Recommended result options:
- Winner
- Finalist
- Shortlisted
- Longlisted
- Nominee
- Honor

---

### 19. Related Works

Tables:
- `related_works`
- `relationship_types`
- `book_related_works`

`related_works` fields:
- id
- title
- isbn10
- isbn13
- external_url
- notes

`relationship_types` fields:
- id
- name

Example relationship types:
- Sequel
- Prequel
- Companion book
- Translation
- Adaptation
- Same series
- Same universe

`book_related_works` fields:
- book_id
- related_work_id
- relationship_type_id
- notes

Form:
- Related work: searchable dropdown
- Add new related work: inline modal
- Relationship type: dropdown
- Notes: textarea

---

### 20. Classifications

Tables:
- `classification_schemes`
- `classifications`

`classification_schemes` fields:
- id
- name

Example schemes:
- Dewey Decimal
- Library of Congress Classification
- BISAC
- Thema
- UDC

`classifications` fields:
- book_id
- classification_scheme_id
- value

Form:
- Classification scheme: dropdown
- Classification value: text input
- Multiple classifications: repeater

---

### 21. Lookup Tables

Use lookup tables for all repeated dropdown values.

Lookup tables:
- `reading_statuses`
- `roles`
- `formats`
- `bindings`
- `languages`
- `age_ranges`
- `reading_levels`
- `content_warnings`
- `conditions`
- `inventory_statuses`
- `acquisition_methods`
- `distributor_types`
- `publisher_roles`
- `relationship_types`
- `file_formats`
- `file_size_units`
- `license_types`
- `award_results`
- `currencies`
- `countries`
- `image_types`
- `classification_schemes`

Form:
- Lookup values: dropdown or searchable dropdown
- Admin-managed lookup values: settings page or modal manager
- Do not hardcode repeated dropdown options in the form if they can grow over time

---

## Updated Add Book Tabs

1. Basic
2. Authors & Contributors
3. Details
4. Series
5. Publisher & Distributors
6. Retailers
7. Reading
8. Ownership & Purchase
9. Location & Copies
10. Lending
11. Digital
12. Images
13. Awards
14. Related Works
15. Classification & Metadata
