import { useState, type ReactNode } from 'react'
import CodeBlock from './CodeBlock'

type BeforeAfterProps = {
  before: string
  after: string
  language?: string
  beforeNotes?: ReactNode
  afterNotes?: ReactNode
  beforeFilename?: string
  afterFilename?: string
  split?: boolean
}

export default function BeforeAfter({
  before,
  after,
  language = 'cpp',
  beforeNotes,
  afterNotes,
  beforeFilename = 'before.cpp',
  afterFilename = 'after.cpp',
  split = false,
}: BeforeAfterProps) {
  const [mode, setMode] = useState<'before' | 'after'>('before')

  if (split) {
    return (
      <div className="before-after before-after--split">
        <div className="before-after__pane">
          <div className="before-after__pane-label">Før — ustruktureret</div>
          <CodeBlock language={language} filename={beforeFilename}>
            {before}
          </CodeBlock>
          {beforeNotes ? <div className="before-after__notes">{beforeNotes}</div> : null}
        </div>
        <div className="before-after__pane">
          <div className="before-after__pane-label">Efter — struktureret</div>
          <CodeBlock language={language} filename={afterFilename}>
            {after}
          </CodeBlock>
          {afterNotes ? <div className="before-after__notes">{afterNotes}</div> : null}
        </div>
      </div>
    )
  }

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
      <CodeBlock
        language={language}
        filename={mode === 'before' ? beforeFilename : afterFilename}
      >
        {mode === 'before' ? before : after}
      </CodeBlock>
      {(mode === 'before' ? beforeNotes : afterNotes) ? (
        <div className="before-after__notes">
          {mode === 'before' ? beforeNotes : afterNotes}
        </div>
      ) : null}
    </div>
  )
}
