import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    platform: 'Nikah Muyassar',
    version: '1.0.0',
  })
}
