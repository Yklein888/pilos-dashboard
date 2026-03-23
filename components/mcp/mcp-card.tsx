'use client'

import { useState } from 'react'
import { Check, Download } from 'lucide-react'
import type { McpCatalogEntry } from '@/lib/mcp-catalog'

interface McpCardProps {
  server: McpCatalogEntry
  isInstalled: boolean
  onInstall: (server: McpCatalogEntry) => void
}

export function McpCard({ server, isInstalled, onInstall }: McpCardProps) {
  const [installing, setInstalling] = useState(false)

  async function handleInstall() {
    setInstalling(true)
    await new Promise((r) => setTimeout(r, 800))
    onInstall(server)
    setInstalling(false)
  }

  return (
    <div className="group relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-accent-500/5 group-hover:from-primary-500/10 group-hover:to-accent-500/10 transition-all duration-300 rounded-xl" />
      <div className="relative p-5 border border-border/50 rounded-xl hover:border-primary-500/50 transition-all duration-300">
        <div className="flex items-start gap-3 mb-3">
          <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-2xl flex-shrink-0">
            {server.icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-sm truncate">{server.name}</h3>
              {server.popular && (
                <span className="text-xs px-1.5 py-0.5 bg-warning/20 text-warning rounded font-medium shrink-0">
                  Popular
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground">{server.category}</p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mb-4 line-clamp-2">{server.description}</p>
        {server.env_vars && server.env_vars.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {server.env_vars.map((v) => (
              <span key={v} className="text-xs px-1.5 py-0.5 bg-muted rounded font-mono">
                {v}
              </span>
            ))}
          </div>
        )}
        <button
          onClick={handleInstall}
          disabled={isInstalled || installing}
          className={`w-full py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
            isInstalled
              ? 'bg-green-500/20 text-green-500 cursor-default'
              : 'bg-primary-500/10 hover:bg-primary-500/20 text-primary-500 hover:shadow-md'
          }`}
        >
          {isInstalled ? (
            <>
              <Check className="h-4 w-4" />
              Installed
            </>
          ) : installing ? (
            <span className="animate-pulse">Installing...</span>
          ) : (
            <>
              <Download className="h-4 w-4" />
              Install
            </>
          )}
        </button>
      </div>
    </div>
  )
}
