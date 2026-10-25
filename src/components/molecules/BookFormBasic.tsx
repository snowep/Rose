'use client'

import { BookFormTitleSubtitle } from './BookFormTitleSubtitle'
import { BookFormMetadata } from './BookFormMetadata'

interface BookFormBasicProps {
  book: any
  onChange: (field: string, value: any) => void
}

export function BookFormBasic({ book, onChange }: BookFormBasicProps) {
  return (
    <>
      <BookFormTitleSubtitle book={book} onChange={onChange} />
      <BookFormMetadata book={book} onChange={onChange} />
    </>
  )
}