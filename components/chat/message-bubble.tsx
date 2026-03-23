'use client'

import { cn } from '@/lib/utils'

export type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === 'user'

  return (
    <div className={cn('flex gap-3 animate-fade-in', isUser && 'flex-row-reverse')}>
      {/* Avatar */}
      <div
        className={cn(
          'h-8 w-8 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0',
          isUser
            ? 'bg-gradient-to-br from-primary-500 to-primary-600'
            : 'bg-gradient-to-br from-accent-500 to-primary-500'
        )}
      >
        {isUser ? 'You' : 'AI'}
      </div>

      {/* Message */}
      <div className={cn('flex flex-col max-w-2xl', isUser && 'items-end')}>
        <div
          className={cn(
            'px-4 py-3 rounded-2xl text-sm transition-all',
            isUser
              ? 'bg-gradient-to-br from-primary-500 to-primary-600 text-white rounded-tr-sm'
              : 'bg-muted/50 border border-border/50 rounded-tl-sm hover:border-primary-500/30'
          )}
        >
          <p className="whitespace-pre-wrap">{message.content}</p>
        </div>
        <p className="text-xs text-muted-foreground mt-1 mx-1">
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  )
}
