'use client'

interface ModelSelectorProps {
  value: string
  onChange: (model: string) => void
}

const MODELS = [
  { id: 'claude-opus-4-5', name: 'Claude Opus', description: 'Most capable, best for complex tasks' },
  { id: 'claude-sonnet-4-5', name: 'Claude Sonnet', description: 'Balanced performance and speed' },
  { id: 'claude-haiku-4-5', name: 'Claude Haiku', description: 'Fast and efficient for simple tasks' },
  { id: 'gpt-4o', name: 'GPT-4o', description: "OpenAI's latest flagship model" },
  { id: 'gpt-4o-mini', name: 'GPT-4o Mini', description: 'Fast and cost-effective' },
]

export function ModelSelector({ value, onChange }: ModelSelectorProps) {
  return (
    <div className="space-y-2">
      {MODELS.map((model) => (
        <label
          key={model.id}
          className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition-all ${
            value === model.id
              ? 'border-primary-500 bg-primary-500/10'
              : 'border-border hover:border-primary-500/50'
          }`}
        >
          <input
            type="radio"
            name="model"
            value={model.id}
            checked={value === model.id}
            onChange={() => onChange(model.id)}
            className="accent-primary-500"
          />
          <div>
            <p className="text-sm font-medium">{model.name}</p>
            <p className="text-xs text-muted-foreground">{model.description}</p>
          </div>
        </label>
      ))}
    </div>
  )
}
