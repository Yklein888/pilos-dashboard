import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'PILOS Dashboard',
  description: 'Agent System Management Dashboard',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="antialiased bg-background text-foreground">
        <div className="min-h-screen">
          {children}
        </div>
      </body>
    </html>
  )
}
