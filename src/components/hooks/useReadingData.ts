'use client'

import { useEffect, useState } from 'react'
import { BookService } from '@/lib/book-service'

export function useReadingData() {
  const [readingMap, setReadingMap] = useState<Map<string, number>>(new Map())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadReadingData = async () => {
      try {
        const books = await BookService.getAll()
        const readingMap = aggregateReadingData(books)
        setReadingMap(readingMap)
      } catch (err) {
        console.error('Failed to load reading data for heatmap:', err)
      } finally {
        setLoading(false)
      }
    }
    loadReadingData()
  }, [])

  return { readingMap, loading }
}

function aggregateReadingData(books: any[]): Map<string, number> {
  const readingMap = new Map<string, number>()

  books.forEach(book => {
    if (book.dailyLog && Array.isArray(book.dailyLog)) {
      book.dailyLog.forEach((log: any) => {
        if (log.date && log.pagesRead) {
          const current = readingMap.get(log.date) || 0
          readingMap.set(log.date, current + log.pagesRead)
        }
      })
    }
  })

  return readingMap
}
