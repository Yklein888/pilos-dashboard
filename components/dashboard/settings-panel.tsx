'use client'

import { useEffect, useState } from 'react'

export function SettingsPanel() {
  const [apiKey, setApiKey] = useState('')
  const [model, setModel] = useState('Claude 3.5 Sonnet')
  const [savedAt, setSavedAt] = useState<string | null>(null)

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem('pilos.settings')
      if (!raw) return
      const parsed = JSON.parse(raw)
      if (typeof parsed.apiKey === 'string') setApiKey(parsed.apiKey)
      if (typeof parsed.model === 'string') setModel(parsed.model)
    } catch {}
  }, [])

  function save() {
    try {
      window.localStorage.setItem('pilos.settings', JSON.stringify({ apiKey, model }))
      setSavedAt(new Date().toISOString())
    } catch {
      setSavedAt(null)
    }
  }

  return (
    <div className="flex-1 overflow-auto p-6">
      <h2 className="text-lg font-semibold mb-6">Settings</h2>
      <div className="space-y-6 max-w-2xl">
        <div>
          <label className="block text-sm font-medium mb-2">API Key</label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="w-full px-3 py-2 bg-card border border-border rounded-lg text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Model</label>
          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="w-full px-3 py-2 bg-card border border-border rounded-lg text-sm"
          >
            <option>Claude 3.5 Sonnet</option>
            <option>Claude Opus</option>
            <option>Claude Haiku</option>
          </select>
        </div>
        <button
          onClick={save}
          className="px-6 py-2 bg-primary text-primary-foreground rounded-lg text-sm hover:opacity-90"
        >
          Save Settings
        </button>
        {savedAt ? (
          <div className="text-xs text-muted-foreground">Saved: {savedAt}</div>
        ) : null}
      </div>
    </div>
  )
}
