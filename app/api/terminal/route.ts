import path from 'node:path'
import { exec } from 'node:child_process'
import { NextResponse } from 'next/server'

const ALLOWED_ROOT = '/workspaces'
const MAX_OUTPUT_CHARS = 200_000

function resolveSafeCwd(input?: string) {
  const cwd = path.resolve(input || process.cwd())
  if (!cwd.startsWith(ALLOWED_ROOT)) {
    throw new Error(`cwd must be inside ${ALLOWED_ROOT}`)
  }
  return cwd
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { command?: string; cwd?: string }
    const command = (body.command || '').trim()

    if (!command) {
      return NextResponse.json({ error: 'command is required' }, { status: 400 })
    }

    if (command.length > 2000) {
      return NextResponse.json({ error: 'command is too long' }, { status: 400 })
    }

    const cwd = resolveSafeCwd(body.cwd)

    const result = await new Promise<{
      stdout: string
      stderr: string
      exitCode: number
    }>((resolve) => {
      exec(
        command,
        {
          cwd,
          timeout: 60_000,
          maxBuffer: 2 * 1024 * 1024,
          env: process.env,
        },
        (error, stdout, stderr) => {
          const rawCode = (error as NodeJS.ErrnoException | null)?.code
          const exitCode = typeof rawCode === 'number' ? rawCode : error ? 1 : 0

          resolve({
            stdout,
            stderr,
            exitCode,
          })
        }
      )
    })

    const stdout = result.stdout.slice(0, MAX_OUTPUT_CHARS)
    const stderr = result.stderr.slice(0, MAX_OUTPUT_CHARS)

    return NextResponse.json({
      cwd,
      command,
      stdout,
      stderr,
      exitCode: result.exitCode,
      truncated:
        result.stdout.length > MAX_OUTPUT_CHARS || result.stderr.length > MAX_OUTPUT_CHARS,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'terminal command failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
