## Book Model Fields

Based on the current Book interface in `src/lib/db.ts`, here are all available fields:

### Required Fields
- **id** (string, optional) - Unique identifier (auto-generated if not provided)
- **title** (string, required) - Book title
- **author** (string, required) - Author name
- **status** (enum: 'reading' | 'read' | 'want-to-read', required) - Reading status
- **createdAt** (string, auto-generated) - Creation timestamp
- **updatedAt** (string, auto-generated) - Last update timestamp

### Optional Fields
- **genre** (string) - Book genre/category
- **rating** (number) - Rating from 0-5
- **pages** (number) - Total number of pages
- **startedAt** (string) - Date when reading started (ISO date string)
- **finishedAt** (string) - Date when reading finished (ISO date string)
- **coverImage** (string) - URL to book cover image
- **notes** (string) - Personal notes about the book
- **tags** (string[]) - Array of tags
- **progress** (number) - Reading progress percentage (0-100)
- **dailyLog** (array) - Daily reading log with date and pages read

### Current Modal Fields
The current BookModal includes:
1. Title
2. Author
3. Status
4. Genre
5. Rating
6. Total Pages
7. Progress %
8. Tags
9. Notes

### Missing Fields to Add
1. **Cover Image URL** - For book cover
2. **Started At** - Date picker for when reading started
3. **Finished At** - Date picker for when reading finished
4. **Created At** - Timestamp (system field)
5. **Updated At** - Timestamp (system field)
6. **Daily Log** - Reading history (complex field)

Would you like me to:
1. Add all missing fields to the modal?
2. Create a field selection UI where you can choose which fields to show?
3. Keep it simple with just the essential fields?
