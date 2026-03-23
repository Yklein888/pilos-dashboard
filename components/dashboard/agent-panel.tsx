'use client'

import { Bot, Play } from 'lucide-react'

export function AgentPanel() {
  const agents = [
    { id: 1, name: 'Project Coordinator', status: 'ready', type: 'supervisor' },
    { id: 2, name: 'DealCellularyk Manager', status: 'idle', type: 'worker' },
    { id: 3, name: 'FinFamily Scraper Manager', status: 'ready', type: 'worker' },
    { id: 4, name: 'KleinKitch Manager', status: 'ready', type: 'worker' },
  ]

  return (
    <div className="h-full overflow-auto p-6">
      <h2 className="text-lg font-semibold mb-6">Active Agents</h2>
      <div className="space-y-3">
        {agents.map((agent) => (
          <div key={agent.id} className="flex items-center gap-3 p-4 bg-card border border-border rounded-lg">
            <Bot className="h-5 w-5 text-primary" />
            <div className="flex-1">
              <div className="font-medium text-sm">{agent.name}</div>
              <div className={`text-xs ${agent.status === 'ready' ? 'text-green-500' : 'text-yellow-500'}`}>
                {agent.status} • {agent.type}
              </div>
            </div>
            <button className="px-3 py-2 text-sm rounded bg-primary text-primary-foreground hover:opacity-90 flex items-center gap-2">
              <Play className="h-4 w-4" />
              Run
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
