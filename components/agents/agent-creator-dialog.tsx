'use client'

import { useState } from 'react'
import { X, ChevronRight, ChevronLeft } from 'lucide-react'
import { ModelSelector } from './model-selector'

interface AgentCreatorDialogProps {
  onClose: () => void
  onSave: (agent: {
    name: string
    description: string
    model: string
    systemPrompt: string
    tools: string[]
  }) => void
}

const AVAILABLE_TOOLS = [
  'web_search', 'code_execution', 'file_read', 'file_write',
  'database_query', 'api_call', 'send_email', 'browser_control',
]

const STEPS = ['Basic Info', 'Model & Prompt', 'Tools']

export function AgentCreatorDialog({ onClose, onSave }: AgentCreatorDialogProps) {
  const [step, setStep] = useState(0)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [model, setModel] = useState('claude-sonnet-4-5')
  const [systemPrompt, setSystemPrompt] = useState('')
  const [tools, setTools] = useState<string[]>([])

  function toggleTool(tool: string) {
    setTools((prev) =>
      prev.includes(tool) ? prev.filter((t) => t !== tool) : [...prev, tool]
    )
  }

  function handleFinish() {
    if (!name.trim()) return
    onSave({ name: name.trim(), description, model, systemPrompt, tools })
  }

  const progress = ((step + 1) / STEPS.length) * 100

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-background border border-border rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl animate-slide-up">
        {/* Progress bar */}
        <div className="h-1 bg-muted">
          <div
            className="h-full bg-gradient-to-r from-primary-500 to-accent-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-bold">Create New Agent</h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              Step {step + 1} of {STEPS.length}: {STEPS[step]}
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-auto max-h-[55vh]">
          {step === 0 && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <label className="block text-sm font-medium mb-1.5">Agent Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Research Assistant"
                  className="w-full px-3 py-2 bg-muted border border-border rounded-lg focus:ring-2 focus:ring-primary-500/50 focus:outline-none text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What does this agent do?"
                  rows={3}
                  className="w-full px-3 py-2 bg-muted border border-border rounded-lg focus:ring-2 focus:ring-primary-500/50 focus:outline-none text-sm resize-none"
                />
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <label className="block text-sm font-medium mb-3">Select Model</label>
                <ModelSelector value={model} onChange={setModel} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">System Prompt</label>
                <textarea
                  value={systemPrompt}
                  onChange={(e) => setSystemPrompt(e.target.value)}
                  placeholder="You are a helpful AI assistant..."
                  rows={6}
                  className="w-full px-3 py-2 bg-muted border border-border rounded-lg focus:ring-2 focus:ring-primary-500/50 focus:outline-none text-sm resize-none font-mono"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-fade-in">
              <p className="text-sm text-muted-foreground mb-4">
                Select the tools this agent can use:
              </p>
              <div className="grid grid-cols-2 gap-2">
                {AVAILABLE_TOOLS.map((tool) => (
                  <label
                    key={tool}
                    className={`flex items-center gap-2 p-3 border rounded-xl cursor-pointer transition-all ${
                      tools.includes(tool)
                        ? 'border-primary-500 bg-primary-500/10'
                        : 'border-border hover:border-primary-500/50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={tools.includes(tool)}
                      onChange={() => toggleTool(tool)}
                      className="accent-primary-500"
                    />
                    <span className="text-sm font-mono">{tool}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-border">
          <button
            onClick={() => setStep((s) => s - 1)}
            disabled={step === 0}
            className="flex items-center gap-1 px-4 py-2 text-sm hover:bg-muted rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </button>
          {step < STEPS.length - 1 ? (
            <button
              onClick={() => setStep((s) => s + 1)}
              disabled={step === 0 && !name.trim()}
              className="flex items-center gap-1 px-6 py-2 text-sm bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              disabled={!name.trim()}
              className="px-6 py-2 text-sm bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              Create Agent
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
