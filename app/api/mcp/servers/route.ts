import fs from 'node:fs'
import path from 'node:path'
import { NextResponse } from 'next/server'


const MCP_CONFIG_PATH = path.resolve(
  process.cwd(),
  '..',
  'pilos-projects-mcp',
  'pilos-mcp-config.json'
)

export async function GET() {
  if (!fs.existsSync(MCP_CONFIG_PATH)) {
    return NextResponse.json({ mcpServers: {} }, { status: 404 })
  }

  const raw = fs.readFileSync(MCP_CONFIG_PATH, 'utf-8')
  const data = JSON.parse(raw) as { mcpServers?: unknown }

  return NextResponse.json(data ?? {})
}

