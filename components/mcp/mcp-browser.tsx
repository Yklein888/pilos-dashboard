'use client'

import { useState, useMemo } from 'react'
import { Search } from 'lucide-react'
import { MCP_CATALOG, MCP_CATEGORIES, type McpCatalogEntry } from '@/lib/mcp-catalog'
import { McpCard } from './mcp-card'
import { McpCategoryFilter } from './mcp-category-filter'

export function McpBrowser() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [installed, setInstalled] = useState<Set<string>>(new Set())

  const filtered = useMemo(() => {
    return MCP_CATALOG.filter((s) => {
      const matchesSearch =
        !search ||
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.description.toLowerCase().includes(search.toLowerCase())
      const matchesCategory = !category || s.category === category
      return matchesSearch && matchesCategory
    })
  }, [search, category])

  function onInstall(server: McpCatalogEntry) {
    setInstalled((prev) => new Set([...prev, server.name]))
  }

  return (
    <div className="h-full overflow-auto p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-1">MCP Server Browser</h2>
        <p className="text-sm text-muted-foreground">
          Discover and install {MCP_CATALOG.length}+ MCP servers to extend your agents
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search servers..."
          className="w-full pl-10 pr-4 py-2.5 bg-muted border border-border rounded-xl focus:ring-2 focus:ring-primary-500/50 focus:outline-none text-sm"
        />
      </div>

      {/* Category Filters */}
      <div className="mb-6">
        <McpCategoryFilter
          categories={MCP_CATEGORIES}
          selected={category}
          onChange={setCategory}
        />
      </div>

      {/* Results count */}
      <p className="text-xs text-muted-foreground mb-4">
        Showing {filtered.length} of {MCP_CATALOG.length} servers
        {installed.size > 0 && ` • ${installed.size} installed`}
      </p>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((server) => (
          <McpCard
            key={server.name}
            server={server}
            isInstalled={installed.has(server.name)}
            onInstall={onInstall}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-lg mb-2">No servers found</p>
          <p className="text-sm">Try a different search term or category</p>
        </div>
      )}
    </div>
  )
}
