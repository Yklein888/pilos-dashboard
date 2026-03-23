'use client'

import { DollarSign } from 'lucide-react'

export function CostTracker() {
  return (
    <div className="flex-1 overflow-auto p-6 bg-card rounded-lg border border-border">
      <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
        <DollarSign className="h-5 w-5" />
        Cost Tracking
      </h2>
      <div className="space-y-4">
        <div>
          <div className="text-xs text-muted-foreground mb-1">This Month</div>
          <div className="text-2xl font-bold">$0.00</div>
        </div>
        <div className="pt-4 border-t border-border">
          <div className="text-xs text-muted-foreground mb-2">Tokens Used</div>
          <div className="text-xl font-semibold">0 / 1M</div>
        </div>
      </div>
    </div>
  )
}
