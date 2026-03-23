'use client'

import { Folder, FolderOpen } from 'lucide-react'

const PROJECTS = [
  { id: 'dealcellularyk', name: 'DealCellularyk', path: 'SIM/modem rental SaaS' },
  { id: 'kleinkitch', name: 'KleinKitch', path: 'E-commerce platform' },
  { id: 'finfamily-bank-scraper', name: 'FinFamily Scraper', path: 'Bank transaction sync' },
  { id: 'real-estate', name: 'Real Estate', path: 'Real estate tools' },
  { id: 'domain-flipper', name: 'Domain Flipper', path: 'Domain management' },
]

export function ProjectBrowser({
  activeProject,
  onSelectProject,
}: {
  activeProject: string | null
  onSelectProject: (id: string) => void
}) {
  return (
    <div className="h-full overflow-auto p-6">
      <h2 className="text-sm font-semibold mb-4 text-muted-foreground">YOUR PROJECTS</h2>
      <div className="space-y-2">
        {PROJECTS.map((project) => (
          <button
            key={project.id}
            onClick={() => onSelectProject(project.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeProject === project.id
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-muted text-foreground'
            }`}
          >
            {activeProject === project.id ? (
              <FolderOpen className="h-5 w-5 flex-shrink-0" />
            ) : (
              <Folder className="h-5 w-5 flex-shrink-0" />
            )}
            <div className="text-left flex-1">
              <div className="font-medium text-sm">{project.name}</div>
              <div className="text-xs text-muted-foreground">{project.path}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
