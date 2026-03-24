'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Play, Terminal, Trash2 } from 'lucide-react'

const COMMON_COMMANDS = [
  'ls', 'cd', 'pwd', 'mkdir', 'rm', 'cp', 'mv', 'cat', 'grep', 'find',
  'npm install', 'npm run', 'npm start', 'npm build', 'git status', 'git add', 'git commit', 'git push', 'git pull',
  'python', 'node', 'echo', 'clear'
]

interface TerminalTab {
  id: string
  name: string
  history: string[]
  input: string
  isRunning: boolean
  suggestions: string[]
  selectedSuggestion: number
}

export function TerminalPanel({ projectPath }: { projectPath: string | null }) {
  const [tabs, setTabs] = useState<TerminalTab[]>([
    {
      id: '1',
      name: 'Terminal 1',
      history: ['$ Ready for input...'],
      input: '',
      isRunning: false,
      suggestions: [],
      selectedSuggestion: -1,
    },
  ])
  const [activeTabId, setActiveTabId] = useState('1')
  const inputRef = useRef<HTMLInputElement>(null)
  const historyRef = useRef<HTMLDivElement>(null)

  const mode = useMemo(() => process.env.NEXT_PUBLIC_TERMINAL_MODE || 'local-api', [])

  const activeTab = tabs.find(tab => tab.id === activeTabId)!

  useEffect(() => {
    setTabs(tabs => tabs.map(tab =>
      tab.id === activeTabId ? { ...tab, history: ['$ Ready for input...'] } : tab
    ))
  }, [projectPath, activeTabId])

  useEffect(() => {
    historyRef.current?.scrollTo({ top: historyRef.current.scrollHeight, behavior: 'smooth' })
  }, [activeTab.history, activeTab.isRunning])

  useEffect(() => {
    inputRef.current?.focus()
  }, [projectPath, activeTabId])

  useEffect(() => {
    if (activeTab.input.trim()) {
      const filtered = COMMON_COMMANDS.filter(cmd => cmd.startsWith(activeTab.input.toLowerCase()))
      setTabs(tabs => tabs.map(tab =>
        tab.id === activeTabId ? { ...tab, suggestions: filtered.slice(0, 5), selectedSuggestion: -1 } : tab
      ))
    } else {
      setTabs(tabs => tabs.map(tab =>
        tab.id === activeTabId ? { ...tab, suggestions: [] } : tab
      ))
    }
  }, [activeTab.input, activeTabId])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const cmd = activeTab.input.trim()
    if (!cmd) return
    setTabs(tabs => tabs.map(tab =>
      tab.id === activeTabId ? {
        ...tab,
        history: [...tab.history, `$ ${cmd}`],
        input: '',
        suggestions: [],
        isRunning: true
      } : tab
    ))

    try {
      const res = await fetch('/api/terminal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: cmd, cwd: projectPath || undefined }),
      })

      const data = (await res.json()) as {
        stdout?: string
        stderr?: string
        error?: string
        exitCode?: number
      }

      if (!res.ok) {
        setTabs(tabs => tabs.map(tab =>
          tab.id === activeTabId ? {
            ...tab,
            history: [...tab.history, `[error] ${data.error || 'Command failed'}`],
            isRunning: false
          } : tab
        ))
        return
      }

      const out = (data.stdout || '').trimEnd()
      const err = (data.stderr || '').trimEnd()
      const exitLine = `[exit ${data.exitCode ?? 0}]`

      setTabs(tabs => tabs.map(tab =>
        tab.id === activeTabId ? {
          ...tab,
          history: [
            ...tab.history,
            ...(out ? out.split('\n') : []),
            ...(err ? err.split('\n').map((line) => `[stderr] ${line}`) : []),
            exitLine,
          ],
          isRunning: false
        } : tab
      ))
    } catch {
      setTabs(tabs => tabs.map(tab =>
        tab.id === activeTabId ? {
          ...tab,
          history: [...tab.history, '[error] Network error while executing command'],
          isRunning: false
        } : tab
      ))
    } finally {
      inputRef.current?.focus()
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (activeTab.suggestions.length === 0) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setTabs(tabs => tabs.map(tab =>
        tab.id === activeTabId ? { ...tab, selectedSuggestion: (tab.selectedSuggestion + 1) % tab.suggestions.length } : tab
      ))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setTabs(tabs => tabs.map(tab =>
        tab.id === activeTabId ? { ...tab, selectedSuggestion: tab.selectedSuggestion <= 0 ? tab.suggestions.length - 1 : tab.selectedSuggestion - 1 } : tab
      ))
    } else if (e.key === 'Tab' || e.key === 'Enter') {
      if (activeTab.selectedSuggestion >= 0) {
        e.preventDefault()
        setTabs(tabs => tabs.map(tab =>
          tab.id === activeTabId ? {
            ...tab,
            input: tab.suggestions[tab.selectedSuggestion],
            suggestions: [],
            selectedSuggestion: -1
          } : tab
        ))
      }
    } else if (e.key === 'Escape') {
      setTabs(tabs => tabs.map(tab =>
        tab.id === activeTabId ? { ...tab, suggestions: [], selectedSuggestion: -1 } : tab
      ))
    }
  }

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'l') {
        e.preventDefault()
        setTabs(tabs => tabs.map(tab =>
          tab.id === activeTabId ? { ...tab, history: ['$ Ready for input...'], input: '', suggestions: [] } : tab
        ))
        inputRef.current?.focus()
      }
    }

    window.addEventListener('keydown', handleGlobalKeyDown)
    return () => window.removeEventListener('keydown', handleGlobalKeyDown)
  }, [activeTabId])

  return (
    <div
      className="h-full flex flex-col bg-gradient-to-b from-zinc-950 to-black"
      onClick={() => inputRef.current?.focus()}
    >
      <div className="border-b border-border p-4 flex items-center gap-2">
        <Terminal className="h-4 w-4" />
        <div className="flex items-center gap-1 flex-1 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTabId(tab.id)}
              className={`px-3 py-1 text-xs rounded-md whitespace-nowrap ${
                tab.id === activeTabId
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.name}
            </button>
          ))}
          <button
            onClick={() => {
              const newId = (tabs.length + 1).toString()
              setTabs(tabs => [...tabs, {
                id: newId,
                name: `Terminal ${tabs.length + 1}`,
                history: ['$ Ready for input...'],
                input: '',
                isRunning: false,
                suggestions: [],
                selectedSuggestion: -1,
              }])
              setActiveTabId(newId)
            }}
            className="px-2 py-1 text-xs text-muted-foreground hover:text-foreground"
          >
            +
          </button>
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            setTabs(tabs => tabs.map(tab =>
              tab.id === activeTabId ? { ...tab, history: ['$ Ready for input...'] } : tab
            ))
            inputRef.current?.focus()
          }}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border/60 px-2.5 py-1 text-xs text-muted-foreground hover:text-foreground hover:border-border transition-colors"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Clear
        </button>
      </div>
      <div ref={historyRef} className="flex-1 overflow-auto p-4 font-mono text-sm text-zinc-200">
        <div className="mb-3 text-xs text-muted-foreground">
          Mode: <span className="font-medium">{mode}</span>
        </div>
        {activeTab.isRunning && <div className="mb-2 text-xs text-sky-300">Running...</div>}
        {activeTab.history.map((line, idx) => (
          <div key={idx} className={`whitespace-pre-wrap break-words leading-6 ${line.startsWith('[stderr]') ? 'text-red-400' : line.startsWith('[error]') ? 'text-red-500' : line.startsWith('[exit') ? 'text-green-400' : ''}`}>
            {line}
          </div>
        ))}
      </div>
      <form
        onSubmit={onSubmit}
        className="border-t border-border/70 px-3 py-2 bg-zinc-950/95 backdrop-blur supports-[backdrop-filter]:bg-zinc-950/80 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-400 select-none">$</span>
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={activeTab.input}
              onChange={(e) => setTabs(tabs => tabs.map(tab =>
                tab.id === activeTabId ? { ...tab, input: e.target.value } : tab
              ))}
              onKeyDown={handleKeyDown}
              placeholder="Type command and press Enter (Tab for autocomplete)"
              className="w-full rounded-md border border-border/60 bg-zinc-900 px-3 py-2 text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary/60"
              aria-label="Terminal command input"
              disabled={activeTab.isRunning}
            />
            {activeTab.suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-zinc-800 border border-border rounded-md shadow-lg z-10 max-h-40 overflow-y-auto">
                {activeTab.suggestions.map((suggestion, index) => (
                  <div
                    key={suggestion}
                    className={`px-3 py-2 text-sm cursor-pointer hover:bg-zinc-700 ${
                      index === activeTab.selectedSuggestion ? 'bg-zinc-700' : ''
                    }`}
                    onClick={() => {
                      setTabs(tabs => tabs.map(tab =>
                        tab.id === activeTabId ? { ...tab, input: suggestion, suggestions: [], selectedSuggestion: -1 } : tab
                      ))
                      inputRef.current?.focus()
                    }}
                  >
                    {suggestion}
                  </div>
                ))}
              </div>
            )}
          </div>
          <button
            type="submit"
            disabled={activeTab.isRunning || !activeTab.input.trim()}
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-2 text-xs font-medium text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Play className="h-3.5 w-3.5" />
            Run
          </button>
        </div>
      </form>
    </div>
  )
}
