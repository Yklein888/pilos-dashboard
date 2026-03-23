'use client'

export function UsageStats() {
  const stats = [
    {
      label: 'Total Cost',
      value: '$24.50',
      change: '↓ 12% from last week',
      positive: true,
      gradient: 'from-primary-500/10',
    },
    {
      label: 'Tokens Used',
      value: '245K',
      change: 'of 1M limit',
      positive: null,
      gradient: 'from-accent-500/10',
    },
    {
      label: 'Active Agents',
      value: '12',
      change: '3 running now',
      positive: true,
      gradient: 'from-green-500/10',
    },
    {
      label: 'API Calls Today',
      value: '1,847',
      change: '↑ 5% from yesterday',
      positive: false,
      gradient: 'from-warning/10',
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className={`p-5 bg-gradient-to-br ${stat.gradient} to-transparent border border-border/50 rounded-xl hover:border-primary-500/30 transition-all duration-300`}
        >
          <p className="text-xs text-muted-foreground">{stat.label}</p>
          <p className="text-3xl font-bold mt-2">{stat.value}</p>
          <p
            className={`text-xs mt-1 ${
              stat.positive === true
                ? 'text-green-500'
                : stat.positive === false
                ? 'text-red-500'
                : 'text-muted-foreground'
            }`}
          >
            {stat.change}
          </p>
        </div>
      ))}
    </div>
  )
}
