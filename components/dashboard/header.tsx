'use client'

import { Bot, Settings } from 'lucide-react'

export function Header({ activeProject }: { activeProject: string | null }) {
  return (
    <header className="border-b border-border/50 bg-gradient-to-r from-background via-background to-primary-500/5 backdrop-blur-sm">
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Logo */}
          <div className="relative">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-glow">
              <Bot className="h-6 w-6 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full border-2 border-background animate-pulse" />
          </div>

          {/* Title */}
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              PILOS Dashboard
            </h1>
            <p className="text-xs text-muted-foreground">
              {activeProject || 'Select a project'}
            </p>
          </div>
        </div>

        {/* Status & Actions */}
        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 text-xs bg-green-500/10 text-green-500 rounded-full border border-green-500/20 flex items-center gap-2">
            <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
            <span className="font-medium">MCP Connected</span>
          </div>
          <button className="p-2 hover:bg-primary-500/10 rounded-lg transition-all duration-200">
            <Settings className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  )
}
