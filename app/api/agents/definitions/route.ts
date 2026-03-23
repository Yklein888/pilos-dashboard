import fs from 'node:fs'
import path from 'node:path'
import { NextResponse } from 'next/server'


const AGENTS_JSON_PATH = path.resolve(
  process.cwd(),
  '..',
  'pilos-projects-mcp',
  'pilos-agents.json'
)

export async function GET() {
  if (!fs.existsSync(AGENTS_JSON_PATH)) {
    return NextResponse.json({ agents: [] }, { status: 404 })
  }

  const raw = fs.readFileSync(AGENTS_JSON_PATH, 'utf-8')
  const data = JSON.parse(raw) as { agents: unknown[] }
  return NextResponse.json(data.agents ?? [])
}

