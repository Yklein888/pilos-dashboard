import { NextResponse } from 'next/server'
import { callPilosProjectsMcpTool } from '@/lib/server/pilos-mcp'


export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id: projectId } = await context.params
  const body = await req.json().catch(() => null)
  const summary = body?.summary
  if (typeof summary !== 'string' || !summary.trim()) {
    return NextResponse.json({ error: 'Missing summary' }, { status: 400 })
  }

  const details =
    typeof body?.details === 'string' ? body.details : undefined
  const files_changed =
    Array.isArray(body?.files_changed) && body.files_changed.every((x: unknown) => typeof x === 'string')
      ? (body.files_changed as string[])
      : undefined

  const { json } = await callPilosProjectsMcpTool({
    toolName: 'memory_log_activity',
    args: {
      project: projectId,
      summary: summary.trim(),
      details,
      files_changed,
    },
  })

  return NextResponse.json(json ?? { success: true })
}

