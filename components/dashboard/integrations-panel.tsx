'use client'

import { Github, Bell, FileText } from 'lucide-react'

export function IntegrationsPanel() {
  const integrations = [
    { name: 'GitHub', icon: Github, connected: true },
    { name: 'Slack', icon: Bell, connected: false },
    { name: 'Notion', icon: FileText, connected: true },
  ]

  return (
    <div className="h-full overflow-auto p-6">
      <h2 className="text-lg font-semibold mb-6">Integrations</h2>
      <div className="space-y-3 max-w-2xl">
        {integrations.map((int) => (
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
    </div>
  )
}
