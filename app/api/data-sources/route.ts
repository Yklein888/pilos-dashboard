import { NextResponse } from 'next/server'


const DATA_SOURCES = [
  { id: '1', name: 'Production DB', type: 'PostgreSQL', connected: true },
  { id: '2', name: 'Analytics', type: 'MySQL', connected: false },
]

export async function GET() {
  return NextResponse.json({ data_sources: DATA_SOURCES })
}

export async function POST(request: Request) {
  const body = await request.json()
  const newSource = { id: Date.now().toString(), connected: false, ...body }
  return NextResponse.json({ data_source: newSource }, { status: 201 })
}
