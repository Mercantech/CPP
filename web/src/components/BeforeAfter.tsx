import { useState, type ReactNode } from 'react'
import CodeBlock from './CodeBlock'

type BeforeAfterProps = {
  before: string
  after: string
  language?: string
  beforeNotes?: ReactNode
  afterNotes?: ReactNode
}

export default function BeforeAfter({
  before,
  after,
  language = 'cpp',
  beforeNotes,
  afterNotes,
}: BeforeAfterProps) {
  const [mode, setMode] = useState<'before' | 'after'>('before')

  return (
    <div className="before-after">
      <div className="before-after__tabs" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={mode === 'before'}
          className={mode === 'before' ? 'active' : undefined}
          onClick={() => setMode('before')}
        >
          Før — ustruktureret
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mode === 'after'}
          className={mode === 'after' ? 'active' : undefined}
          onClick={() => setMode('after')}
        >
          Efter — struktureret
        </button>
      </div>
      <CodeBlock language={language}>{mode === 'before' ? before : after}</CodeBlock>
      {(mode === 'before' ? beforeNotes : afterNotes) ? (
        <div className="before-after__notes">
          {mode === 'before' ? beforeNotes : afterNotes}
        </div>
      ) : null}
    </div>
  )
}
