import { NextResponse } from 'next/server'
import { callPilosProjectsMcpTool } from '@/lib/server/pilos-mcp'

export async function GET() {
  try {
    const { json } = await callPilosProjectsMcpTool({ toolName: 'list_projects' })
    if (!json) return NextResponse.json({ projects: [] })
    return NextResponse.json(json)
  } catch {
    return NextResponse.json({ projects: [] })
  }
}

