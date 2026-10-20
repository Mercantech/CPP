import { useState } from 'react'
import type { ProjectFile } from '../data/projects'
import CodeBlock from './CodeBlock'

type FileProjectExplorerProps = {
  files: ProjectFile[]
  title?: string
}

export default function FileProjectExplorer({
  files,
  title = 'SensorSketch',
}: FileProjectExplorerProps) {
  const [active, setActive] = useState(files[0]?.name ?? '')
  const current = files.find((f) => f.name === active) ?? files[0]

  if (!current) return null

  return (
    <div className="file-explorer">
      <div className="file-explorer__tree">
        <h3>{title}/</h3>
        {files.map((f) => (
          <button
            key={f.name}
            type="button"
            className={f.name === current.name ? 'active' : undefined}
            onClick={() => setActive(f.name)}
            title={f.name}
          >
            {f.name.includes('/') ? f.name.split('/').pop() : f.name}
            {f.name.includes('/') ? (
              <span className="file-explorer__path">{f.name}</span>
            ) : null}
          </button>
        ))}
      </div>
      <div className="file-explorer__pane">
        <div className="file-explorer__meta">
          <strong>{current.name}</strong> — {current.role}
        </div>
        <CodeBlock language={current.language}>{current.code}</CodeBlock>
      </div>
    </div>
  )
}
