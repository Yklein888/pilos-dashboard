 'use client'

import React, { useCallback, useEffect, useState } from 'react'
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  Connection,
  useNodesState,
  useEdgesState,
} from 'reactflow'
import 'reactflow/dist/style.css'

export function AgentWorkflow() {
  const initialNodes: Node[] = [
    {
      id: '1',
      position: { x: 0, y: 0 },
      data: { label: 'Agent A' },
      type: 'default',
    },
    {
      id: '2',
      position: { x: 250, y: 0 },
      data: { label: 'Agent B' },
    },
  ]

  const initialEdges: Edge[] = [{ id: 'e1-2', source: '1', target: '2', animated: true }]

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [count, setCount] = useState(3)
  const [savedWorkflows, setSavedWorkflows] = useState<Array<{ id: string; name: string }>>([])
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle')
  const [currentWorkflowId, setCurrentWorkflowId] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/workflows')
      .then((r) => r.json())
      .then((data) => setSavedWorkflows(data?.workflows?.map((w: any) => ({ id: w.id, name: w.name })) || []))
      .catch(() => setSavedWorkflows([]))
  }, [])

  // Auto-save with debounce
  useEffect(() => {
    if (!currentWorkflowId) return
    setSaveStatus('saving')
    const timer = setTimeout(async () => {
      try {
        const res = await fetch('/api/workflows', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: currentWorkflowId, name: `workflow-${currentWorkflowId}`, nodes, edges }),
        })
        if (res.ok) setSaveStatus('saved')
      } catch (err) {
        setSaveStatus('idle')
      }
    }, 1500)
    return () => clearTimeout(timer)
  }, [nodes, edges, currentWorkflowId])

  const onConnect = useCallback((params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)), [])

  const addNode = useCallback(() => {
    const id = String(count)
    const newNode: Node = {
      id,
      position: { x: Math.random() * 300, y: Math.random() * 200 },
      data: { label: `Agent ${id}` },
    }
    setNodes((nds) => nds.concat(newNode))
    setCount((c) => c + 1)
  }, [count, setNodes])

  async function saveWorkflow() {
    const name = window.prompt('Save workflow as', `workflow-${Date.now()}`)
    if (!name) return
    const payload = { name, nodes, edges }
    try {
      const res = await fetch('/api/workflows', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (data?.workflow) {
        setSavedWorkflows((s) => [...s, { id: data.workflow.id, name: data.workflow.name }])
        alert('Saved')
      }
    } catch (err) {
      alert('Save failed')
    }
  }

  async function loadWorkflow(id?: string) {
    try {
      const url = id ? `/api/workflows?id=${encodeURIComponent(id)}` : '/api/workflows'
      const res = await fetch(url)
      const data = await res.json()
      const wf = id ? data : data?.workflows?.[0]
      if (!wf) return alert('No workflow')
      setNodes(wf.nodes || [])
      setEdges(wf.edges || [])
      if (wf.id) setCurrentWorkflowId(wf.id)
      alert('Loaded')
    } catch (err) {
      alert('Load failed')
    }
  }

  return (
    <div className="h-[600px] rounded-xl border border-border bg-card p-2">
      <div className="flex items-center justify-between p-2">
        <div className="text-sm font-medium flex items-center gap-2">
          Agent Workflow
          {saveStatus === 'saving' && <span className="text-xs text-yellow-500">Saving...</span>}
          {saveStatus === 'saved' && <span className="text-xs text-green-500">✓ Saved</span>}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={addNode}
            className="px-3 py-1 text-xs rounded-md bg-primary text-primary-foreground"
          >
            Add Node
          </button>
          <button onClick={saveWorkflow} className="px-3 py-1 text-xs rounded-md border border-border/50">
            Save
          </button>
          <select
            onChange={(e) => loadWorkflow(e.target.value)}
            className="text-sm rounded-md bg-transparent border border-border/30 px-2 py-1"
            aria-label="Load saved workflow">
            <option value="">Load...</option>
            {savedWorkflows.map((w) => (
              <option key={w.id} value={w.id}>
                {w.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="h-[540px]">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
        >
          <Background />
          <MiniMap />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  )
}

export default AgentWorkflow
