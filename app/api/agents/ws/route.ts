import fs from 'node:fs'
import path from 'node:path'
import { NextResponse } from 'next/server'

const AGENTS_JSON_PATH = path.resolve(
  process.cwd(),
  '..',
  'pilos-projects-mcp',
  'pilos-agents.json'
)

interface ExtendedWebSocketRequest {
  headers: Record<string, string | string[]>
  url: string
  method: string
}

// Simplified handler for WebSocket simulation via polling
export async function GET(request: Request) {
  try {
    let agents: any[] = []
    if (fs.existsSync(AGENTS_JSON_PATH)) {
      const raw = fs.readFileSync(AGENTS_JSON_PATH, 'utf-8')
      const data = JSON.parse(raw) as { agents?: any[] }
      agents = data.agents || []
    }

    const payload = agents.map((a: any) => ({
      id: a.id ?? a.name ?? String(Math.random()),
      name: a.name ?? a.id,
      status: ['ready', 'running', 'error', 'idle'][Math.floor(Math.random() * 4)],
      timestamp: Date.now(),
    }))

    return NextResponse.json({ agents: payload, timestamp: Date.now() })
  } catch (err) {
    return NextResponse.json({ error: 'failed to fetch agents', agents: [] }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as { action?: string; agentId?: string }
    const { action, agentId } = body

    if (action === 'run' && agentId) {
      return NextResponse.json({
        success: true,
        message: `Agent ${agentId} started`,
        agentId,
        timestamp: Date.now(),
      })
    }

    if (action === 'stop' && agentId) {
      return NextResponse.json({
        success: true,
        message: `Agent ${agentId} stopped`,
        agentId,
        timestamp: Date.now(),
      })
    }

    return NextResponse.json({ error: 'unknown action' }, { status: 400 })
  } catch (err) {
    return NextResponse.json({ error: 'failed to process' }, { status: 500 })
  }
}
