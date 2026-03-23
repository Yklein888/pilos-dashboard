import { NextResponse } from 'next/server'
import { callPilosProjectsMcpTool } from '@/lib/server/pilos-mcp'

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id: projectId } = await context.params
  const { json } = await callPilosProjectsMcpTool({
    toolName: 'memory_get_changelog',
    args: { project: projectId, limit: 20 },
  })

  return NextResponse.json(json ?? [])
}

