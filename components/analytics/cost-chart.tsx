'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from 'recharts'

const COST_DATA = [
  { day: 'Mon', cost: 3.2, tokens: 45000 },
  { day: 'Tue', cost: 4.1, tokens: 58000 },
  { day: 'Wed', cost: 3.8, tokens: 52000 },
  { day: 'Thu', cost: 5.2, tokens: 72000 },
  { day: 'Fri', cost: 4.7, tokens: 65000 },
  { day: 'Sat', cost: 2.1, tokens: 30000 },
  { day: 'Sun', cost: 1.4, tokens: 19000 },
]

const AGENT_USAGE = [
  { name: 'Research', calls: 450, cost: 8.2 },
  { name: 'Coder', calls: 320, cost: 6.4 },
  { name: 'Reviewer', calls: 210, cost: 4.1 },
  { name: 'Planner', calls: 180, cost: 3.6 },
  { name: 'Writer', calls: 120, cost: 2.2 },
]

export function CostChart() {
  return (
    <div className="space-y-8">
      {/* Daily Cost Trend */}
      <div className="p-6 bg-card border border-border/50 rounded-xl">
        <h3 className="font-semibold mb-1">Daily Cost (7 days)</h3>
        <p className="text-xs text-muted-foreground mb-4">API costs in USD</p>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={COST_DATA}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#6b7280' }} />
            <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} />
            <Tooltip
              contentStyle={{
                background: '#1f2937',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                fontSize: '12px',
              }}
              formatter={(value) => [`$${value}`, 'Cost']}
            />
            <Line
              type="monotone"
              dataKey="cost"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ fill: '#3b82f6', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Agent Usage */}
      <div className="p-6 bg-card border border-border/50 rounded-xl">
        <h3 className="font-semibold mb-1">Agent Usage</h3>
        <p className="text-xs text-muted-foreground mb-4">API calls and cost per agent</p>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={AGENT_USAGE}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#6b7280' }} />
            <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} />
            <Tooltip
              contentStyle={{
                background: '#1f2937',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                fontSize: '12px',
              }}
            />
            <Legend />
            <Bar dataKey="calls" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            <Bar dataKey="cost" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
