import { useEffect, useRef, type ReactNode } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { getModuleNav, type LessonModule } from '../data/lessons'
import PresentMode from './PresentMode'
import { useProgress } from '../lib/progress'

type LessonLayoutProps = {
  module: LessonModule
  children: ReactNode
}

export default function LessonLayout({ module, children }: LessonLayoutProps) {
  const { pathname } = useLocation()
  const nav = getModuleNav(module)
  const contentRef = useRef<HTMLElement>(null)
  const { progress, toggle, visit } = useProgress()
  const currentIndex = nav.items.findIndex((item) => item.path === pathname)
  const current = nav.items[currentIndex]
  const previous = nav.items[currentIndex - 1]
  const next = nav.items[currentIndex + 1]
  const done = progress.completed.includes(pathname)
  const count = nav.items.filter((item) => progress.completed.includes(item.path)).length
  useEffect(() => { visit(pathname) }, [pathname, visit])

  return (
    <div className="lesson-shell">
      <aside className="lesson-sidebar" aria-label="Lektionsnavigation">
        <h2>{nav.title}</h2>
        <div className="course-progress">
          <span>{count} / {nav.items.length} gennemført</span>
          <progress value={count} max={nav.items.length} aria-label={`Gennemførte lektioner i ${module}`} />
        </div>
        <ul>
          {nav.items.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                end
                className={({ isActive }) =>
                  isActive || pathname === item.path ? 'active' : undefined
                }
              >
                <span className="lesson-sidebar__num" aria-hidden="true">
                  {progress.completed.includes(item.path) ? '✓' : item.num ?? '—'}
                </span>
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
        <Link className="sidebar-lab" to="/laboratorium">&gt;_ Åbn laboratoriet <span aria-hidden>↗</span></Link>
      </aside>
      <div className="lesson-main-wrap">
        <div className="lesson-toolbar">
          <span className="lesson-toolbar__meta">{module.toUpperCase()} / {current?.num ?? '00'} {current?.duration ? `· ${current.duration} inkl. øvelser` : ''}</span>
          <PresentMode contentRef={contentRef} />
        </div>
        <article ref={contentRef} className="lesson-main lesson prose">
          {children}
        </article>
        <div className="lesson-completion">
          <button type="button" className={`btn ${done ? 'btn--done' : 'btn--primary'}`} aria-pressed={done} onClick={() => toggle(pathname)}>
            {done ? '✓ Markeret som gennemført' : 'Markér som gennemført'}
          </button>
          <span>Du bestemmer selv, hvornår du er klar.</span>
        </div>
        <nav className="lesson-pagination" aria-label="Forrige og næste lektion">
          {previous ? <Link to={previous.path}><small>← Forrige</small>{previous.label}</Link> : <span />}
          {next ? <Link to={next.path}><small>Næste →</small>{next.label}</Link> : <Link to="/laboratorium"><small>Eksperimentér videre →</small>Laboratoriet</Link>}
        </nav>
      </div>
    </div>
  )
}
