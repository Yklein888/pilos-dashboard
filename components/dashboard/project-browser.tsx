'use client'

import { useEffect, useState } from 'react'
import { Folder, FolderOpen } from 'lucide-react'

type Project = {
  id: string
  name: string
  status?: string
  type?: string
  last_updated?: string | null
  recent_activity?: string | null
}

export function ProjectBrowser({
  activeProject,
  onSelectProject,
}: {
  activeProject: string | null
  onSelectProject: (id: string) => void
}) {
  const [projects, setProjects] = useState<Project[]>([])

  useEffect(() => {
    fetch('/api/projects')
      .then((r) => r.json())
      .then((data) => setProjects((data?.projects ?? []) as Project[]))
      .catch(() => setProjects([]))
  }, [])

  return (
    <div className="h-full overflow-auto p-6">
      <h2 className="text-sm font-semibold mb-4 text-muted-foreground">YOUR PROJECTS</h2>
      <div className="space-y-2">
        {projects.map((project) => (
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
              <div className="text-xs text-muted-foreground">
                {project.type || project.status || '—'}
                {project.recent_activity ? ` • ${project.recent_activity}` : ''}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
