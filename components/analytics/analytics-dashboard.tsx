'use client'

import { UsageStats } from './usage-stats'
import { CostChart } from './cost-chart'

export function AnalyticsDashboard({ activeProject }: { activeProject: string | null }) {
  return (
    <div className="h-full overflow-auto p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold">Analytics</h2>
        <p className="text-sm text-muted-foreground mt-1">
          {activeProject ? `Stats for project: ${activeProject}` : 'All projects — last 7 days'}
        </p>
      </div>

      <div className="space-y-6 max-w-5xl">
        <UsageStats />
        <CostChart />
      </div>
    </div>
  )
}
