import { NextResponse } from 'next/server'
import { callPilosProjectsMcpTool } from '@/lib/server/pilos-mcp'

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id: projectId } = await context.params
  const { json } = await callPilosProjectsMcpTool({
    toolName: 'get_project_info',
    args: { project_name: projectId },
  })

  return NextResponse.json(json ?? null)
}

