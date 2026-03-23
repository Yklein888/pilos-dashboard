'use client'

import { useState, useRef, useEffect } from 'react'
import { Bot } from 'lucide-react'
import { MessageBubble, type Message } from './message-bubble'
import { MessageInput } from './message-input'

const DEMO_MESSAGES: Message[] = [
  {
    id: '1',
    role: 'assistant',
    content: "Hello! I'm your PILOS AI assistant. How can I help you today?",
    timestamp: new Date(Date.now() - 60000),
  },
]

export function ChatInterface({ activeProject }: { activeProject: string | null }) {
  const [messages, setMessages] = useState<Message[]>(DEMO_MESSAGES)
  const [isTyping, setIsTyping] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function handleSend(text: string) {
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMsg])
    setIsTyping(true)

    // Simulate AI response
    await new Promise((r) => setTimeout(r, 1000 + Math.random() * 1000))

    const aiMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: activeProject
        ? `I'm analyzing your project "${activeProject}". ${getSimulatedResponse(text)}`
        : getSimulatedResponse(text),
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, aiMsg])
    setIsTyping(false)
  }

  return (
    <div className="h-full flex flex-col">
      {/* Chat Header */}
      <div className="flex items-center gap-3 p-4 border-b border-border">
        <div className="h-9 w-9 rounded-full bg-gradient-to-br from-accent-500 to-primary-500 flex items-center justify-center">
          <Bot className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="font-semibold text-sm">PILOS Assistant</p>
          <div className="flex items-center gap-1.5">
            <div className="h-1.5 w-1.5 bg-green-500 rounded-full animate-pulse" />
            <p className="text-xs text-muted-foreground">Online</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        {isTyping && (
          <div className="flex gap-3 animate-fade-in">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-accent-500 to-primary-500 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
              AI
            </div>
            <div className="px-4 py-3 bg-muted/50 border border-border/50 rounded-2xl rounded-tl-sm">
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <MessageInput onSend={handleSend} disabled={isTyping} />
    </div>
  )
}

function getSimulatedResponse(_input: string): string {
  const responses = [
    "That's a great question! I'm currently in demo mode. Connect your AI API key in settings to enable real responses.",
    "I understand what you're asking. In a full deployment, I would process this with Claude or GPT-4.",
    "Interesting! I can help with code review, debugging, and project management once fully configured.",
    "I see you want to work on that. Let me know how I can assist once the AI backend is connected.",
  ]
  return responses[Math.floor(Math.random() * responses.length)]
}
