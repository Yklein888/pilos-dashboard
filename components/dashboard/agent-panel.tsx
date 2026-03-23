'use client'

import { useEffect, useMemo, useState } from 'react'
import { Bot, Play } from 'lucide-react'

type AgentDefinition = {
  id: string
  name: string
  description?: string
  type?: string
  project?: string
}

export function AgentPanel({ activeProject }: { activeProject: string | null }) {
  const [agents, setAgents] = useState<AgentDefinition[]>([])
  const [runningId, setRunningId] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/agents/definitions')
      .then((r) => r.json())
      .then((data) => setAgents((data?.agents ?? []) as AgentDefinition[]))
      .catch(() => setAgents([]))
  }, [])

  const agentsView = useMemo(() => {
    return agents.map((a) => {
      const status = a.type === 'supervisor' ? 'ready' : 'ready'
      return { ...a, status }
    })
  }, [agents])

  async function onRun(agent: AgentDefinition) {
    const targetProjectId = agent.project ?? activeProject
    if (!targetProjectId) return

    setRunningId(agent.id)
    try {
      await fetch(`/api/projects/${encodeURIComponent(targetProjectId)}/log-activity`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          summary: `Run ${agent.name}`,
          details: agent.description,
          files_changed: [],
        }),
      })
    } finally {
      setRunningId(null)
    }
  }

  return (
    <div className="h-full overflow-auto p-6">
      <h2 className="text-lg font-semibold mb-6">Active Agents</h2>
      <div className="space-y-3">
        {agentsView.map((agent) => (
          <div
            key={agent.id}
            className="flex items-center gap-3 p-4 bg-card border border-border rounded-lg"
          >
            <Bot className="h-5 w-5 text-primary" />
            <div className="flex-1">
              <div className="font-medium text-sm">{agent.name}</div>
              <div
                className={`text-xs ${
                  agent.status === 'ready' ? 'text-green-500' : 'text-yellow-500'
                }`}
              >
                {agent.status} • {agent.type || 'agent'}
              </div>
            </div>
            <button
              onClick={() => onRun(agent)}
              disabled={!agent.project && !activeProject}
              className="px-3 py-2 text-sm rounded bg-primary text-primary-foreground hover:opacity-90 flex items-center gap-2 disabled:opacity-50 disabled:hover:opacity-50"
            >
              <Play className="h-4 w-4" />
              {runningId === agent.id ? 'Running...' : 'Run'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
