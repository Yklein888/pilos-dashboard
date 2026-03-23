'use client'

import { Terminal } from 'lucide-react'

export function TerminalPanel({ projectPath }: { projectPath: string | null }) {
  return (
    <div className="h-full flex flex-col bg-black/50">
      <div className="border-b border-border p-4 flex items-center gap-2">
        <Terminal className="h-4 w-4" />
        <span className="text-sm font-medium">{projectPath || 'Terminal'}</span>
      </div>
      <div className="flex-1 overflow-auto p-4 font-mono text-sm text-muted-foreground">
        <p>$ Ready for input...</p>
      </div>
      <input
        type="text"
        placeholder="Enter command..."
        className="border-t border-border px-4 py-2 bg-background text-foreground text-sm focus:outline-none"
      />
    </div>
  )
}
