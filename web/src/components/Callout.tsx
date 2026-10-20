import type { ReactNode } from 'react'

export type CalloutType = 'info' | 'warn' | 'tip' | 'danger'

const labels: Record<CalloutType, string> = {
  info: 'Info',
  warn: 'Advarsel',
  tip: 'Tip',
  danger: 'Pas på',
}

type CalloutProps = {
  type?: CalloutType
  children: ReactNode
}

export default function Callout({ type = 'info', children }: CalloutProps) {
  return (
    <aside className={`callout callout--${type}`} role="note">
      <span className="callout__label">{labels[type]}</span>
      <div>{children}</div>
    </aside>
  )
}
