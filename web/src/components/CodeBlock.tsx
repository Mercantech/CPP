import { useMemo, useState } from 'react'
import { highlightCode } from '../lib/highlight'

type CodeBlockProps = {
  language?: string
  children: string
}

export default function CodeBlock({ language = 'cpp', children }: CodeBlockProps) {
  const [copyState, setCopyState] = useState('Kopiér kode')
  const { html, language: label } = useMemo(
    () => highlightCode(children, language),
    [children, language],
  )

  async function copy() {
    try {
      await navigator.clipboard.writeText(children)
      setCopyState('Kopieret ✓')
    } catch {
      setCopyState('Markér og kopiér manuelt')
    }
  }

  return (
    <div className="code-block-wrap">
      <div className="code-block__bar">
        <span className="code-block__lang">{label === 'cpp' ? 'C++' : label || 'Kode'}</span>
        <button type="button" onClick={copy} aria-label="Kopiér kodeeksempel">{copyState}</button>
      </div>
      <pre className="code-block">
        <code
          className={label ? `hljs language-${label}` : 'hljs'}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </pre>
    </div>
  )
}
