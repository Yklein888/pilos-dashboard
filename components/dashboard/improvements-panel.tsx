'use client'

const priorities = {
  High: 'bg-red-500/15 text-red-400 border border-red-500/30',
  Medium: 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/30',
  Low: 'bg-muted text-muted-foreground border border-border',
}

type Improvement = {
  id: string
  title: string
  category: string
  description: string
  impact: string
  priority: keyof typeof priorities
  horizon: 'Now' | 'Next' | 'Later'
  benchmark: string
}

const improvements: Improvement[] = [
  {
    id: 'rbac',
    title: 'Role-based access + SSO',
    category: 'Security',
    description:
      'Workspace roles, team provisioning (SCIM), and SSO/SAML onboarding for enterprise accounts.',
    impact: 'Unlocks regulated customers and reduces IT onboarding friction.',
    priority: 'High',
    horizon: 'Now',
    benchmark: 'Enterprise AI platforms highlight SSO + RBAC as table stakes.',
  },
  {
    id: 'audit-log',
    title: 'Audit log + compliance exports',
    category: 'Governance',
    description:
      'Immutable activity log with exportable reports for SOC 2/ISO evidence and incident response.',
    impact: 'Accelerates compliance readiness and builds customer trust.',
    priority: 'High',
    horizon: 'Now',
    benchmark: 'Competitors emphasize compliance dashboards and audit trails.',
  },
  {
    id: 'observability',
    title: 'System observability & SLIs',
    category: 'Reliability',
    description:
      'Latency/availability tracking per agent, alerting, and incident timelines.',
    impact: 'Supports SLAs and gives operators early warning signals.',
    priority: 'High',
    horizon: 'Next',
    benchmark: 'Top dashboards expose health metrics and real-time status.',
  },
  {
    id: 'usage-analytics',
    title: 'Usage analytics + budgets',
    category: 'FinOps',
    description:
      'Token spend by project/team, budget thresholds, and proactive cost alerts.',
    impact: 'Keeps costs predictable and highlights optimization opportunities.',
    priority: 'Medium',
    horizon: 'Next',
    benchmark: 'Leaders provide cost dashboards and budget guardrails.',
  },
  {
    id: 'automation',
    title: 'Workflow automation',
    category: 'Automation',
    description:
      'Scheduled runs, triggers from GitHub/Slack, and reusable runbooks.',
    impact: 'Turns the dashboard into an operational control plane.',
    priority: 'Medium',
    horizon: 'Next',
    benchmark: 'Competitors promote no-code workflows and scheduled jobs.',
  },
  {
    id: 'evaluations',
    title: 'Model registry + evaluations',
    category: 'Quality',
    description:
      'Track models per project, evaluation scores, and regression comparisons.',
    impact: 'Ensures output quality and speeds experimentation.',
    priority: 'Medium',
    horizon: 'Later',
    benchmark: 'Large platforms differentiate with evaluation suites.',
  },
  {
    id: 'marketplace',
    title: 'Integration marketplace',
    category: 'Ecosystem',
    description:
      'Curated MCP integrations, templates, and verified partner connectors.',
    impact: 'Boosts adoption and shortens time-to-value.',
    priority: 'Low',
    horizon: 'Later',
    benchmark: 'Market leaders showcase marketplaces and templates.',
  },
]

const groupedImprovements = {
  Now: improvements.filter((item) => item.horizon === 'Now'),
  Next: improvements.filter((item) => item.horizon === 'Next'),
  Later: improvements.filter((item) => item.horizon === 'Later'),
}

const highlights = [
  {
    title: 'Enterprise readiness',
    description: 'SSO, RBAC, audit logs, and compliance exports.',
  },
  {
    title: 'Operational control',
    description: 'Runbooks, scheduling, and incident visibility.',
  },
  {
    title: 'Cost governance',
    description: 'Budget guardrails and spend attribution.',
  },
]

export function ImprovementsPanel() {
  return (
    <div className="h-full overflow-auto p-6">
      <div className="flex flex-wrap items-start justify-between gap-6 mb-6">
        <div>
          <h2 className="text-lg font-semibold">Competitive Improvements</h2>
          <p className="text-sm text-muted-foreground">
            System-level upgrades and market features commonly shipped by leading platforms.
          </p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4 text-sm min-w-[220px]">
          <div className="text-xs text-muted-foreground">Current focus</div>
          <div className="font-medium">Security • Reliability • Automation</div>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-3 mb-8">
        {highlights.map((item) => (
          <div key={item.title} className="p-4 bg-card border border-border rounded-lg">
            <div className="text-sm font-medium">{item.title}</div>
            <div className="text-xs text-muted-foreground mt-1">{item.description}</div>
          </div>
        ))}
      </div>

      {(['Now', 'Next', 'Later'] as const).map((horizon) => (
        <div key={horizon} className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-muted-foreground">{horizon} horizon</h3>
            <div className="text-xs text-muted-foreground">
              {groupedImprovements[horizon].length} initiatives
            </div>
          </div>
          <div className="space-y-3">
            {groupedImprovements[horizon].map((item) => (
              <div
                key={item.id}
                className="p-4 bg-card border border-border rounded-lg flex flex-col gap-3"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold">{item.title}</div>
                    <div className="text-xs text-muted-foreground">{item.category}</div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${priorities[item.priority]}`}>
                    {item.priority} priority
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">{item.description}</div>
                <div className="text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">Impact:</span> {item.impact}
                </div>
                <div className="text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">Benchmark:</span> {item.benchmark}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
