import { NextResponse } from 'next/server'

const unavailableResponse = () =>
  NextResponse.json(
    { success: false, error: 'The remote catalog is unavailable until its schema and access policies are verified.' },
    { status: 503 },
  )

export async function GET() {
  return unavailableResponse()
}

export async function PUT() {
  return unavailableResponse()
}

export async function DELETE() {
  return unavailableResponse()
}
