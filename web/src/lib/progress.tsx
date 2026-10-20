import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import { lessonModules } from '../data/lessons'

const key = 'cpp-course-progress-v1'
const validPaths = new Set(lessonModules.flatMap((module) => module.items.map((item) => item.path)))
type Progress = { completed: string[]; lastPath?: string }

function read(): Progress {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(key) ?? '{}')
    if (!value || typeof value !== 'object') return { completed: [] }
    const data = value as Partial<Progress>
    return {
      completed: Array.isArray(data.completed) ? data.completed.filter((path) => typeof path === 'string' && validPaths.has(path)) : [],
      lastPath: typeof data.lastPath === 'string' && validPaths.has(data.lastPath) ? data.lastPath : undefined,
    }
  } catch { return { completed: [] } }
}

const ProgressContext = createContext<{
  progress: Progress
  toggle: (path: string) => void
  visit: (path: string) => void
}>({ progress: { completed: [] }, toggle: () => {}, visit: () => {} })

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<Progress>(read)
  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(progress)) } catch { /* Sessionen fungerer også uden lager. */ }
  }, [progress])
  const save = useCallback((update: (current: Progress) => Progress) => {
    setProgress(update)
  }, [])
  function toggle(path: string) {
    if (!validPaths.has(path)) return
    save((current) => ({ ...current, completed: current.completed.includes(path) ? current.completed.filter((p) => p !== path) : [...current.completed, path] }))
  }
  const visit = useCallback((path: string) => {
    if (validPaths.has(path)) save((current) => current.lastPath === path ? current : { ...current, lastPath: path })
  }, [save])
  return <ProgressContext.Provider value={{ progress, toggle, visit }}>{children}</ProgressContext.Provider>
}

export function useProgress() { return useContext(ProgressContext) }
