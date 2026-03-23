import { NextResponse } from 'next/server'
import { callPilosProjectsMcpTool } from '@/lib/server/pilos-mcp'

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id: projectId } = await context.params
  const body = await req.json().catch(() => null)
  const note = body?.note
  if (typeof note !== 'string' || !note.trim()) {
    return NextResponse.json({ error: 'Missing note' }, { status: 400 })
  }

  const { json } = await callPilosProjectsMcpTool({
    toolName: 'memory_add_note',
    args: { project_name: projectId, note: note.trim() },
  })

  return NextResponse.json(json ?? { success: true })
}

