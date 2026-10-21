import { useMemo, useState } from 'react'
import type { ProjectFile } from '../data/projects'
import CodeBlock from './CodeBlock'

type FileProjectExplorerProps = {
  files: ProjectFile[]
  title?: string
}

function folderOf(name: string) {
  if (name.includes('/')) return name.split('/')[0] + '/'
  if (name.endsWith('.ini')) return 'config/'
  return 'root/'
}

function baseName(name: string) {
  return name.includes('/') ? name.split('/').pop()! : name
}

export default function FileProjectExplorer({
  files,
  title = 'SensorSketch',
}: FileProjectExplorerProps) {
  const [active, setActive] = useState(files[0]?.name ?? '')
  const [openTabs, setOpenTabs] = useState<string[]>(files[0] ? [files[0].name] : [])
  const current = files.find((f) => f.name === active) ?? files[0]

  const groups = useMemo(() => {
    const map = new Map<string, ProjectFile[]>()
    for (const f of files) {
      const key = folderOf(f.name)
      const list = map.get(key) ?? []
      list.push(f)
      map.set(key, list)
    }
    return [...map.entries()]
  }, [files])

  function openFile(name: string) {
    setActive(name)
    setOpenTabs((tabs) => (tabs.includes(name) ? tabs : [...tabs, name]))
  }

  if (!current) return null

  return (
    <div className="file-explorer">
      <div className="file-explorer__tree">
        <h3>{title}/</h3>
        {groups.map(([folder, groupFiles]) => (
          <div key={folder} className="file-explorer__group">
            <div className="file-explorer__group-label">{folder}</div>
            {groupFiles.map((f) => (
              <button
                key={f.name}
                type="button"
                className={f.name === current.name ? 'active' : undefined}
                onClick={() => openFile(f.name)}
                title={f.name}
              >
                {baseName(f.name)}
                {f.name.includes('/') ? (
                  <span className="file-explorer__path">{f.name}</span>
                ) : null}
              </button>
            ))}
          </div>
        ))}
      </div>
      <div className="file-explorer__pane" key={current.name}>
        <div className="file-explorer__tabs" role="tablist">
          {openTabs.map((name) => (
            <button
              key={name}
              type="button"
              role="tab"
              className={name === current.name ? 'file-explorer__tab active' : 'file-explorer__tab'}
              aria-selected={name === current.name}
              onClick={() => setActive(name)}
            >
              {baseName(name)}
            </button>
          ))}
        </div>
        <div className="file-explorer__meta">
          <strong>{current.name}</strong> — {current.role}
        </div>
        <CodeBlock language={current.language} filename={current.name}>
          {current.code}
        </CodeBlock>
      </div>
    </div>
  )
}
