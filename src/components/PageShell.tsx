import type { ReactNode } from 'react'

export function PageShell({ children, compact = false }: { children: ReactNode; compact?: boolean }) {
  return (
    <main className="app-shell">
      <div className="stars stars-a" />
      <div className="stars stars-b" />
      <section className={compact ? 'panel panel-compact' : 'panel'}>{children}</section>
    </main>
  )
}
