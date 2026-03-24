import { NextResponse } from 'next/server'
import { callPilosProjectsMcpTool } from '@/lib/server/pilos-mcp'
import path from 'node:path'

export async function GET() {
  try {
    const { json } = await callPilosProjectsMcpTool({ toolName: 'list_projects' })
    if (!json) return NextResponse.json({ projects: [] })
    return NextResponse.json(json)
  } catch {
    const cwd = process.cwd()
    return NextResponse.json({
      projects: [
        {
          id: cwd,
          name: path.basename(cwd),
          status: 'local',
          type: 'workspace',
          recent_activity: 'Fallback project (MCP offline)',
        },
      ],
    })
  }
}

