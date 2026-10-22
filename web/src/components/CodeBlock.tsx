import { useMemo, useState } from 'react'
import { highlightCode } from '../lib/highlight'

type CodeBlockProps = {
  language?: string
  children: string
  filename?: string
  showLineNumbers?: boolean
  highlightLines?: number[]
}

export default function CodeBlock({
  language = 'cpp',
  children,
  filename,
  showLineNumbers = true,
  highlightLines = [],
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false)
  const code = children.replace(/^\n/, '').replace(/\n$/, '')
  const lines = useMemo(() => code.split('\n'), [code])
  const highlightSet = useMemo(() => new Set(highlightLines), [highlightLines])
  const { language: label } = useMemo(() => highlightCode(code, language), [code, language])
  const lineHtml = useMemo(
    () => lines.map((line) => highlightCode(line.length ? line : ' ', language).html),
    [lines, language],
  )

  async function copy() {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="code-block-wrap">
      <div className="code-block__chrome">
        <div className="code-block__dots" aria-hidden>
          <span />
          <span />
          <span />
        </div>
        <span className="code-block__title">{filename ?? label ?? 'code'}</span>
        <div className="code-block__actions">
          {label ? <span className="code-block__lang">{label}</span> : null}
          <button type="button" className="code-block__copy" onClick={copy}>
            {copied ? 'Kopieret' : 'Kopiér'}
          </button>
        </div>
      </div>
      <pre className="code-block" tabIndex={0}>
        <code className={label ? `code-block__source language-${label}` : 'code-block__source'}>
          {lines.map((_, i) => {
            const n = i + 1
            const active = highlightSet.has(n)
            return (
              <span key={i} className={active ? 'code-block__line is-active' : 'code-block__line'}>
                {showLineNumbers ? (
                  <span className="code-block__gutter" aria-hidden>
                    {n}
                  </span>
                ) : null}
                <span
                  className="code-block__content hljs"
                  dangerouslySetInnerHTML={{ __html: lineHtml[i] || '&nbsp;' }}
                />
              </span>
            )
          })}
        </code>
      </pre>
    </div>
  )
}
