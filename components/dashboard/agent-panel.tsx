'use client'

import { useEffect, useMemo, useState } from 'react'
import { Bot, Play, Plus } from 'lucide-react'
import dynamic from 'next/dynamic'
import { AgentCreatorDialog } from '@/components/agents/agent-creator-dialog'

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
  const [showCreator, setShowCreator] = useState(false)
  const [showWorkflow, setShowWorkflow] = useState(false)

  const AgentWorkflow = dynamic(
    () => import('@/components/agents/agent-workflow').then((m) => m.AgentWorkflow),
    { ssr: false }
  )

  useEffect(() => {
    fetch('/api/agents/definitions')
      .then((r) => r.json())
      .then((data) => setAgents((data?.agents ?? []) as AgentDefinition[]))
      .catch(() => setAgents([]))
  }, [])

  // Subscribe to WebSocket polling for live agent status updates
  useEffect(() => {
    let pollInterval: NodeJS.Timeout | null = null
    const poll = async () => {
      try {
        const res = await fetch('/api/agents/ws')
        const data = await res.json()
        if (data?.agents) {
          setAgents((prev) => {
            const map = new Map(prev.map((a) => [a.id || a.name, a]))
            for (const s of data.agents) {
              const key = s.id || s.name
              const existing = map.get(key)
              if (existing) {
                map.set(key, { ...existing, status: s.status })
              } else {
                map.set(key, { id: s.id, name: s.name, type: 'remote', description: '', project: undefined })
              }
            }
            return Array.from(map.values())
          })
        }
      } catch (err) {
        // ignore
      }
    }

    poll()
    pollInterval = setInterval(poll, 3000)
    return () => {
      if (pollInterval) clearInterval(pollInterval)
    }
  }, [])

  const agentsView = useMemo(() => {
    return agents.map((a) => {
      const status = 'ready'
      return { ...a, status }
    })
  }, [agents])

  async function onRun(agent: AgentDefinition) {
    const targetProjectId = agent.project ?? activeProject
    if (!targetProjectId) return

    setRunningId(agent.id)
    try {
      // Send bi-directional run command via WebSocket API
      await fetch('/api/agents/ws', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'run', agentId: agent.id }),
      })

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

  async function onStop(agentId: string) {
    try {
      await fetch('/api/agents/ws', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'stop', agentId }),
      })
      setRunningId(null)
    } catch (err) {
      // ignore
    }
  }

  function handleSaveAgent(agentData: {
    name: string
    description: string
    model: string
    systemPrompt: string
    tools: string[]
  }) {
    const newAgent: AgentDefinition = {
      id: Date.now().toString(),
      name: agentData.name,
      description: agentData.description,
      type: 'custom',
    }
    setAgents((prev) => [...prev, newAgent])
    setShowCreator(false)
  }

  return (
    <div className="h-full overflow-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold" role="heading" aria-level={2}>Active Agents</h2>
        <div className="flex items-center gap-2" role="toolbar" aria-label="Agent controls">
          <button
            onClick={() => setShowCreator(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl hover:shadow-lg transition-all text-sm font-medium"
            aria-label="Create new agent"
          >
            <Plus className="h-4 w-4" />
            Create Agent
          </button>
          <button
            onClick={() => setShowWorkflow((v) => !v)}
            className="px-3 py-2 border border-border/50 rounded-xl text-sm text-muted-foreground hover:text-foreground"
            aria-label={showWorkflow ? 'Hide workflow builder' : 'Show workflow builder'}
            aria-pressed={showWorkflow}
          >
            Workflow
          </button>
        </div>
      </div>
      <div className="space-y-3">
        {agentsView.map((agent) => (
          <div
            key={agent.id}
            className="group relative flex items-center gap-3 p-4 bg-gradient-to-br from-card to-card/50 border border-border/50 rounded-xl hover:border-primary-500/50 hover:shadow-lg hover:shadow-primary-500/10 transition-all duration-300 cursor-pointer"
            role="article"
            aria-label={`Agent ${agent.name}, status: ${agent.status}`}
          >
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative flex items-center gap-3 flex-1">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <div className="font-medium text-sm">{agent.name}</div>
                <div className="text-xs text-green-500">
                  {agent.status} • {agent.type || 'agent'}
                </div>
              </div>
              <button
                onClick={() => onRun(agent)}
                disabled={!agent.project && !activeProject}
                className="relative px-3 py-2 text-sm rounded-lg bg-primary-500/10 hover:bg-primary-500/20 text-primary-500 flex items-center gap-2 disabled:opacity-50 disabled:hover:bg-primary-500/10 transition-all focus:outline-none focus:ring-2 focus:ring-primary-500/60"
                aria-label={`Run agent ${agent.name}`}
                aria-disabled={!agent.project && !activeProject}
              >
                <Play className="h-4 w-4" />
                {runningId === agent.id ? 'Running...' : 'Run'}
              </button>
            </div>
          </div>
        ))}

        {agentsView.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <Bot className="h-12 w-12 mx-auto mb-3 opacity-20" />
            <p className="text-sm">No agents yet. Create your first agent!</p>
          </div>
        )}
      </div>

      {showCreator && (
        <AgentCreatorDialog onClose={() => setShowCreator(false)} onSave={handleSaveAgent} />
      )}
      {showWorkflow && (
        <div className="mt-6">
          <AgentWorkflow />
        </div>
      )}
    </div>
  )
}
