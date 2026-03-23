'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { DataSourceCard, type DataSource } from './data-source-card'
import { DataSourceCreator } from './data-source-creator'

const DEMO_SOURCES: DataSource[] = [
  { id: '1', name: 'Production DB', type: 'PostgreSQL', icon: '🐘', connected: true, host: 'localhost:5432' },
  { id: '2', name: 'Analytics', type: 'MySQL', icon: '🐬', connected: false, host: 'analytics.example.com' },
  { id: '3', name: 'Vector Store', type: 'Pinecone', icon: '🌲', connected: true },
]

export function DataSourceBrowser() {
  const [sources, setSources] = useState<DataSource[]>(DEMO_SOURCES)
  const [showCreator, setShowCreator] = useState(false)
  const [testingId, setTestingId] = useState<string | null>(null)

  async function handleTest(id: string) {
    setTestingId(id)
    await new Promise((r) => setTimeout(r, 1000))
    setSources((prev) =>
      prev.map((s) => (s.id === id ? { ...s, connected: true } : s))
    )
    setTestingId(null)
  }

  function handleDelete(id: string) {
    setSources((prev) => prev.filter((s) => s.id !== id))
  }

  function handleEdit(id: string) {
    console.log('Edit', id)
  }

  function handleSave(source: DataSource) {
    setSources((prev) => [...prev, source])
    setShowCreator(false)
  }

  return (
    <div className="h-full overflow-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold">Data Sources</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Manage connections to databases and APIs
          </p>
        </div>
        <button
          onClick={() => setShowCreator(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl hover:shadow-lg transition-all text-sm font-medium"
        >
          <Plus className="h-4 w-4" />
          Connect New Source
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-gradient-to-br from-primary-500/10 to-transparent border border-border/50 rounded-xl">
          <p className="text-xs text-muted-foreground">Total Sources</p>
          <p className="text-2xl font-bold mt-1">{sources.length}</p>
        </div>
        <div className="p-4 bg-gradient-to-br from-green-500/10 to-transparent border border-border/50 rounded-xl">
          <p className="text-xs text-muted-foreground">Connected</p>
          <p className="text-2xl font-bold mt-1 text-green-500">
            {sources.filter((s) => s.connected).length}
          </p>
        </div>
        <div className="p-4 bg-gradient-to-br from-red-500/10 to-transparent border border-border/50 rounded-xl">
          <p className="text-xs text-muted-foreground">Disconnected</p>
          <p className="text-2xl font-bold mt-1 text-red-500">
            {sources.filter((s) => !s.connected).length}
          </p>
        </div>
      </div>

      {/* Cards Grid */}
      {testingId && (
        <div className="mb-4 px-4 py-2 bg-primary-500/10 border border-primary-500/20 rounded-lg text-sm text-primary-500">
          Testing connection...
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sources.map((source) => (
          <DataSourceCard
            key={source.id}
            source={source}
            onTest={handleTest}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {sources.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-lg mb-2">No data sources yet</p>
          <p className="text-sm mb-4">Connect your first database or API</p>
          <button
            onClick={() => setShowCreator(true)}
            className="px-4 py-2 bg-primary-500/10 hover:bg-primary-500/20 text-primary-500 rounded-lg text-sm transition-all"
          >
            Connect Now
          </button>
        </div>
      )}

      {showCreator && (
        <DataSourceCreator onSave={handleSave} onClose={() => setShowCreator(false)} />
      )}
    </div>
  )
}
