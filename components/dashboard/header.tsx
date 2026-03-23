'use client'

import { Settings, Plus } from 'lucide-react'

export function Header({ activeProject }: { activeProject: string | null }) {
  return (
    <header className="border-b border-border bg-card">
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
            P
          </div>
          <div>
            <h1 className="text-lg font-bold">PILOS Dashboard</h1>
            <p className="text-xs text-muted-foreground">
              {activeProject || 'No project selected'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-muted rounded-lg transition-colors">
            <Plus className="h-5 w-5" />
          </button>
          <button className="p-2 hover:bg-muted rounded-lg transition-colors">
            <Settings className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  )
}
