# Personal Shelf Design

## Intent
Allow users to have a personal library that references a shared global book catalog. Creating a book adds it to the global catalog and auto-claims it to creator's shelf. Other users can add the same book to their shelf without duplicating catalog data.

## Goals
- Global book catalog with strict ISBN dedupe
- Per-user shelf via user_books join
- Per-user reading logs separate from global data
- Creator auto-claim on book creation
- Discovery page for all books

## Non-goals
- Social features, reviews, ratings aggregation
- Copy management / physical location tracking

## Schema
books, people, roles, book_people, publishers, series, book_series, genres, book_genres, user_books, reading_logs

## Constraints
- ISBN13 unique, ISBN10 unique where present
- No duplicate books
- Personal data isolated

## Decisions
- Dedupe strict by ISBN
- Separate reading_logs table
- Auto-claim on create
