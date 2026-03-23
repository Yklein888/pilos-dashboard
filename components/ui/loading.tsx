export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="relative">
        <div className="h-12 w-12 rounded-full border-4 border-primary-500/20 border-t-primary-500 animate-spin" />
        <div className="absolute inset-0 h-12 w-12 rounded-full border-4 border-transparent border-t-accent-500 animate-spin opacity-50" style={{ animationDelay: '150ms' }} />
      </div>
    </div>
  )
}

export function LoadingCard() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="h-20 bg-gradient-to-r from-muted via-muted/50 to-muted rounded-xl animate-pulse"
        />
      ))}
    </div>
  )
}
