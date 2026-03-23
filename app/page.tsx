'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ProjectBrowser } from '@/components/dashboard/project-browser'
import { AgentPanel } from '@/components/dashboard/agent-panel'
import { TerminalPanel } from '@/components/dashboard/terminal-panel'
import { SettingsPanel } from '@/components/dashboard/settings-panel'
import { IntegrationsPanel } from '@/components/dashboard/integrations-panel'
import { CostTracker } from '@/components/dashboard/cost-tracker'
import { Header } from '@/components/dashboard/header'
import { ImprovementsPanel } from '@/components/dashboard/improvements-panel'

export default function Home() {
  const [activeProject, setActiveProject] = useState<string | null>(null)

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <Header activeProject={activeProject} />

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <Tabs defaultValue="projects" className="h-full flex flex-col">
          {/* Navigation Tabs */}
          <div className="border-b border-border px-6 pt-4">
            <TabsList className="grid w-full max-w-2xl grid-cols-6">
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="agents">Agents</TabsTrigger>
              <TabsTrigger value="terminal">Terminal</TabsTrigger>
              <TabsTrigger value="integrations">Integrations</TabsTrigger>
              <TabsTrigger value="improvements">Improvements</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-hidden">
            {/* Projects Tab */}
            <TabsContent value="projects" className="h-full m-0">
              <ProjectBrowser activeProject={activeProject} onSelectProject={setActiveProject} />
            </TabsContent>

            {/* Agents Tab */}
            <TabsContent value="agents" className="h-full m-0">
              <AgentPanel activeProject={activeProject} />
            </TabsContent>

            {/* Terminal Tab */}
            <TabsContent value="terminal" className="h-full m-0">
              <TerminalPanel projectPath={activeProject} />
            </TabsContent>

            {/* Integrations Tab */}
            <TabsContent value="integrations" className="h-full m-0">
              <IntegrationsPanel />
            </TabsContent>

            {/* Improvements Tab */}
            <TabsContent value="improvements" className="h-full m-0">
              <ImprovementsPanel />
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="h-full m-0">
              <div className="flex h-full gap-6">
                <SettingsPanel />
                <CostTracker activeProject={activeProject} />
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  )
}
