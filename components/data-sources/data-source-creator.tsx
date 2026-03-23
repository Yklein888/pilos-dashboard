'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import type { DataSource } from './data-source-card'

const DB_TYPES = [
  { value: 'PostgreSQL', icon: '🐘' },
  { value: 'MySQL', icon: '🐬' },
  { value: 'SQLite', icon: '🗃️' },
  { value: 'MongoDB', icon: '🍃' },
  { value: 'Redis', icon: '🔴' },
  { value: 'REST API', icon: '🌐' },
  { value: 'GraphQL', icon: '◈' },
  { value: 'Pinecone', icon: '🌲' },
]

interface DataSourceCreatorProps {
  onSave: (source: DataSource) => void
  onClose: () => void
}

export function DataSourceCreator({ onSave, onClose }: DataSourceCreatorProps) {
  const [name, setName] = useState('')
  const [type, setType] = useState(DB_TYPES[0].value)
  const [host, setHost] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    const selectedType = DB_TYPES.find((t) => t.value === type)
    onSave({
      id: Date.now().toString(),
      name: name.trim(),
      type,
      icon: selectedType?.icon ?? '🗄️',
      connected: false,
      host: host.trim() || undefined,
    })
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-background border border-border rounded-2xl w-full max-w-md shadow-2xl animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-lg font-bold">Connect New Data Source</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Production DB"
              className="w-full px-3 py-2 bg-muted border border-border rounded-lg focus:ring-2 focus:ring-primary-500/50 focus:outline-none text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-3 py-2 bg-muted border border-border rounded-lg focus:ring-2 focus:ring-primary-500/50 focus:outline-none text-sm"
            >
              {DB_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.icon} {t.value}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Host / URL</label>
            <input
              type="text"
              value={host}
              onChange={(e) => setHost(e.target.value)}
              placeholder="e.g. localhost:5432 or https://api.example.com"
              className="w-full px-3 py-2 bg-muted border border-border rounded-lg focus:ring-2 focus:ring-primary-500/50 focus:outline-none text-sm font-mono"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 text-sm hover:bg-muted rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 text-sm bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg hover:shadow-lg transition-all font-medium"
            >
              Connect
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
