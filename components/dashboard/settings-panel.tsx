'use client'

export function SettingsPanel() {
  return (
    <div className="flex-1 overflow-auto p-6">
      <h2 className="text-lg font-semibold mb-6">Settings</h2>
      <div className="space-y-6 max-w-2xl">
        <div>
          <label className="block text-sm font-medium mb-2">API Key</label>
          <input type="password" className="w-full px-3 py-2 bg-card border border-border rounded-lg text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Model</label>
          <select className="w-full px-3 py-2 bg-card border border-border rounded-lg text-sm">
            <option>Claude 3.5 Sonnet</option>
            <option>Claude Opus</option>
            <option>Claude Haiku</option>
          </select>
        </div>
        <button className="px-6 py-2 bg-primary text-primary-foreground rounded-lg text-sm hover:opacity-90">
          Save Settings
        </button>
      </div>
    </div>
  )
}
