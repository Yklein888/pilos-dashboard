import fs from 'node:fs'
import path from 'node:path'

const AGENTS_JSON_PATH = path.resolve(
  process.cwd(),
  '..',
  'pilos-projects-mcp',
  'pilos-agents.json'
)

function randStatus() {
  const arr = ['ready', 'running', 'error', 'idle']
  return arr[Math.floor(Math.random() * arr.length)]
}

export async function GET() {
  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    start(controller) {
      let closed = false

      const send = async () => {
        try {
          let agents = []
          if (fs.existsSync(AGENTS_JSON_PATH)) {
            const raw = fs.readFileSync(AGENTS_JSON_PATH, 'utf-8')
            const data = JSON.parse(raw) as { agents?: any[] }
            agents = data.agents || []
          }

          const payload = agents.map((a: any) => ({
            id: a.id ?? a.name ?? String(Math.random()),
            name: a.name ?? a.id,
            status: randStatus(),
            timestamp: Date.now(),
          }))

          const sse = `data: ${JSON.stringify({ agents: payload })}\n\n`
          controller.enqueue(encoder.encode(sse))
        } catch (err) {
          const sse = `data: ${JSON.stringify({ error: 'stream error' })}\n\n`
          controller.enqueue(encoder.encode(sse))
        }
      }

      // send immediately and then every 3s
      send()
      const id = setInterval(() => {
        if (closed) return
        send()
      }, 3000)

      controller.byobRequest?.respond(0)

      return () => {
        closed = true
        clearInterval(id)
      }
    },
    cancel() {
      // noop
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  })
}
