import fs from 'node:fs'
import path from 'node:path'
import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js'

const DEFAULT_MCP_SERVER_PATH = path.resolve(
  process.cwd(),
  '..',
  'pilos-projects-mcp',
  'server.js'
)

function resolveMcpServerPath() {
  const configured = process.env.PILOS_PROJECTS_MCP_SERVER_PATH
  const serverPath = configured ? path.resolve(configured) : DEFAULT_MCP_SERVER_PATH

  if (!fs.existsSync(serverPath)) {
    throw new Error(
      `MCP server.js not found at "${serverPath}". Set PILOS_PROJECTS_MCP_SERVER_PATH to override.`
    )
  }

  return serverPath
}

function safeJsonParse(input: string) {
  try {
    return JSON.parse(input)
  } catch {
    return null
  }
}

export async function callPilosProjectsMcpTool(params: {
  toolName: string
  args?: Record<string, unknown>
}) {
  const serverPath = resolveMcpServerPath()

  const notionToken = process.env.NOTION_TOKEN

  const transport = new StdioClientTransport({
    command: 'node',
    args: [serverPath],
    env: {
      ...process.env,
      ...(notionToken ? { NOTION_TOKEN: notionToken } : {}),
    },
  })

  const client = new Client(
    { name: 'pilos-dashboard', version: '1.0.0' },
    { capabilities: {} }
  )

  try {
    await client.connect(transport)

    const result = await client.callTool({
      name: params.toolName,
      arguments: (params.args ?? {}) as Record<string, unknown>,
    })

    const anyResult = result as any
    if (anyResult?.isError) {
      throw new Error(
        typeof anyResult?.content?.[0]?.text === 'string'
          ? anyResult.content[0].text
          : 'MCP tool error'
      )
    }

    const text = anyResult?.content?.[0]?.text
    if (typeof text !== 'string') throw new Error('MCP returned no text content')

    return {
      rawText: text,
      json: safeJsonParse(text),
    }
  } finally {
    await transport.close().catch(() => {})
  }
}

