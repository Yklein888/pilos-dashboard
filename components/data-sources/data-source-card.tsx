'use client'

import { Trash2, TestTube2, Pencil } from 'lucide-react'

export type DataSource = {
  id: string
  name: string
  type: string
  icon: string
  connected: boolean
  host?: string
}

interface DataSourceCardProps {
  source: DataSource
  onTest: (id: string) => void
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

export function DataSourceCard({ source, onTest, onEdit, onDelete }: DataSourceCardProps) {
  return (
    <div className="group relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-accent-500/5 group-hover:from-primary-500/10 group-hover:to-accent-500/10 transition-all duration-300 rounded-xl" />
      <div className="relative p-6 border border-border/50 rounded-xl hover:border-primary-500/50 transition-all duration-300">
        {/* Icon + Name */}
        <div className="flex items-center gap-3 mb-4">
          <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-2xl">
            {source.icon}
          </div>
          <div>
            <h3 className="font-semibold">{source.name}</h3>
            <p className="text-xs text-muted-foreground">{source.type}</p>
            {source.host && (
              <p className="text-xs text-muted-foreground font-mono">{source.host}</p>
            )}
          </div>
        </div>

        {/* Status */}
        <div className="flex items-center gap-2 text-xs mb-4">
          <div
            className={`h-2 w-2 rounded-full ${source.connected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}
          />
          <span className={source.connected ? 'text-green-500' : 'text-red-500'}>
            {source.connected ? 'Connected' : 'Disconnected'}
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => onTest(source.id)}
            className="flex-1 px-3 py-2 bg-primary-500/10 hover:bg-primary-500/20 rounded-lg text-sm transition-all flex items-center justify-center gap-1"
          >
            <TestTube2 className="h-3.5 w-3.5" />
            Test
          </button>
          <button
            onClick={() => onEdit(source.id)}
            className="flex-1 px-3 py-2 bg-muted hover:bg-muted/80 rounded-lg text-sm transition-all flex items-center justify-center gap-1"
          >
            <Pencil className="h-3.5 w-3.5" />
            Edit
          </button>
          <button
            onClick={() => onDelete(source.id)}
            className="px-3 py-2 bg-destructive/10 hover:bg-destructive/20 text-destructive rounded-lg text-sm transition-all"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}
