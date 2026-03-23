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
import { DataSourceBrowser } from '@/components/data-sources/data-source-browser'
import { McpBrowser } from '@/components/mcp/mcp-browser'
import { ChatInterface } from '@/components/chat/chat-interface'
import { AnalyticsDashboard } from '@/components/analytics/analytics-dashboard'

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
          <div className="border-b border-border px-6 pt-4 overflow-x-auto">
            <TabsList className="inline-flex w-auto max-w-none grid-cols-none gap-1">
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="agents">Agents</TabsTrigger>
              <TabsTrigger value="chat">Chat</TabsTrigger>
              <TabsTrigger value="data-sources">Data Sources</TabsTrigger>
              <TabsTrigger value="mcp">MCP Browser</TabsTrigger>
              <TabsTrigger value="terminal">Terminal</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="integrations">Integrations</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-hidden">
            <TabsContent value="projects" className="h-full m-0">
              <ProjectBrowser activeProject={activeProject} onSelectProject={setActiveProject} />
            </TabsContent>

            <TabsContent value="agents" className="h-full m-0">
              <AgentPanel activeProject={activeProject} />
            </TabsContent>

            <TabsContent value="chat" className="h-full m-0">
              <ChatInterface activeProject={activeProject} />
            </TabsContent>

            <TabsContent value="data-sources" className="h-full m-0">
              <DataSourceBrowser />
            </TabsContent>

            <TabsContent value="mcp" className="h-full m-0">
              <McpBrowser />
            </TabsContent>

            <TabsContent value="terminal" className="h-full m-0">
              <TerminalPanel projectPath={activeProject} />
            </TabsContent>

            <TabsContent value="analytics" className="h-full m-0">
              <AnalyticsDashboard activeProject={activeProject} />
            </TabsContent>

            <TabsContent value="integrations" className="h-full m-0">
              <IntegrationsPanel />
            </TabsContent>

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
