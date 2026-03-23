'use client'

import { useEffect, useMemo, useState } from 'react'
import { Terminal } from 'lucide-react'

export function TerminalPanel({ projectPath }: { projectPath: string | null }) {
  const [history, setHistory] = useState<string[]>([])
  const [input, setInput] = useState('')

  const mode = useMemo(() => {
    // For now, we do NOT execute commands from the browser.
    // This panel is UI-only until we add a safe local runner.
    return process.env.NEXT_PUBLIC_TERMINAL_MODE || 'disabled'
  }, [])

  useEffect(() => {
    setHistory(['$ Ready for input...'])
  }, [projectPath])

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const cmd = input.trim()
    if (!cmd) return
    setHistory((h) => [...h, `$ ${cmd}`, `[${mode}] Command execution is not enabled yet.`])
    setInput('')
  }

  return (
    <div className="h-full flex flex-col bg-black/50">
      <div className="border-b border-border p-4 flex items-center gap-2">
        <Terminal className="h-4 w-4" />
        <span className="text-sm font-medium">{projectPath || 'Terminal'}</span>
      </div>
      <div className="flex-1 overflow-auto p-4 font-mono text-sm text-muted-foreground">
        <div className="mb-3 text-xs text-muted-foreground">
          Mode: <span className="font-medium">{mode}</span>
        </div>
        {history.map((line, idx) => (
          <div key={idx}>{line}</div>
        ))}
      </div>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter command..."
          className="w-full border-t border-border px-4 py-2 bg-background text-foreground text-sm focus:outline-none"
        />
      </form>
    </div>
  )
}
