'use client'

interface McpCategoryFilterProps {
  categories: string[]
  selected: string
  onChange: (cat: string) => void
}

export function McpCategoryFilter({ categories, selected, onChange }: McpCategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onChange('')}
        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
          selected === ''
            ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md'
            : 'bg-muted hover:bg-muted/80 text-muted-foreground'
        }`}
      >
        All
      </button>
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
            selected === cat
              ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md'
              : 'bg-muted hover:bg-muted/80 text-muted-foreground'
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  )
}
