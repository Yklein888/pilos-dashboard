'use client'

import { useEffect, useMemo, useState } from 'react'
import { Github, Bell, FileText } from 'lucide-react'

type McpServer = {
  id?: string
  name?: string
  description?: string
  transport?: string
  command?: string
  args?: string[]
}

export function IntegrationsPanel() {
  const [mcpServers, setMcpServers] = useState<McpServer[]>([])
  const [connected, setConnected] = useState<Record<string, boolean>>({})

  useEffect(() => {
    // Local connected state (UI only for now)
    try {
      const raw = window.localStorage.getItem('pilos.connectedIntegrations')
      if (raw) setConnected(JSON.parse(raw))
    } catch {}
  }, [])

  useEffect(() => {
    try {
      window.localStorage.setItem('pilos.connectedIntegrations', JSON.stringify(connected))
    } catch {}
  }, [connected])

  useEffect(() => {
    fetch('/api/mcp/servers')
      .then((r) => r.json())
      .then((data) => {
        const list = (data?.mcp_servers ?? data?.mcpServers ?? []) as unknown
        if (Array.isArray(list)) setMcpServers(list as McpServer[])
        else setMcpServers([])
      })
      .catch(() => setMcpServers([]))
  }, [])

  const staticIntegrations = useMemo(
    () => [
      { name: 'GitHub', icon: Github, connected: true },
      { name: 'Slack', icon: Bell, connected: false },
      { name: 'Notion', icon: FileText, connected: true },
    ],
    []
  )

  return (
    <div className="h-full overflow-auto p-6">
      <h2 className="text-lg font-semibold mb-6">Integrations</h2>
      <div className="space-y-3 max-w-2xl mb-10">
        {staticIntegrations.map((int) => (
          <div key={int.name} className="flex items-center justify-between p-4 bg-card border border-border rounded-lg">
            <div className="flex items-center gap-3">
              <int.icon className="h-5 w-5" />
              <span className="font-medium text-sm">{int.name}</span>
            </div>
            <button className={`px-3 py-1 text-sm rounded ${
              int.connected
                ? 'bg-green-500/20 text-green-500'
                : 'bg-muted text-muted-foreground'
            }`}>
              {int.connected ? 'Connected' : 'Connect'}
            </button>
          </div>
        ))}
      </div>

      <h3 className="text-sm font-semibold mb-4 text-muted-foreground">MCP REGISTRY</h3>
      <div className="space-y-3 max-w-2xl">
        {mcpServers.length === 0 ? (
          <div className="text-sm text-muted-foreground">No MCP servers found.</div>
        ) : (
          mcpServers.map((srv, idx) => {
            const key = srv.id || srv.name || `mcp-${idx}`
            const isConnected = !!connected[key]
            return (
              <div
                key={key}
                className="flex items-center justify-between p-4 bg-card border border-border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <span className="font-medium text-sm">{srv.name || srv.id || 'MCP Server'}</span>
                  <span className="text-xs text-muted-foreground">
                    {srv.transport || '—'}
                    {srv.command ? ` • ${srv.command}` : ''}
                  </span>
                </div>
                <button
                  onClick={() => setConnected((prev) => ({ ...prev, [key]: !prev[key] }))}
                  className={`px-3 py-1 text-sm rounded ${
                    isConnected ? 'bg-green-500/20 text-green-500' : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {isConnected ? 'Connected' : 'Connect'}
                </button>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
