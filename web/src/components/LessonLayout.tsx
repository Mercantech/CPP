import { useRef, type ReactNode } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { getModuleNav, type LessonModule } from '../data/lessons'
import PresentMode from './PresentMode'

type LessonLayoutProps = {
  module: LessonModule
  children: ReactNode
}

export default function LessonLayout({ module, children }: LessonLayoutProps) {
  const { pathname } = useLocation()
  const nav = getModuleNav(module)
  const contentRef = useRef<HTMLElement>(null)

  return (
    <div className="lesson-shell">
      <aside className="lesson-sidebar" aria-label="Lektionsnavigation">
        <h2>{nav.title}</h2>
        <ul>
          {nav.items.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                end={item.path === '/h3' || item.path === '/historie'}
                className={({ isActive }) =>
                  isActive || pathname === item.path ? 'active' : undefined
                }
              >
                <span className="lesson-sidebar__num" aria-hidden="true">
                  {item.num ?? '—'}
                </span>
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </aside>
      <div className="lesson-main-wrap">
        <div className="lesson-toolbar">
          {module === 'h3' ? (
            <Link className="btn btn--primary" to="/h3/praesentation">
              Hele H3-slideshow
            </Link>
          ) : null}
          <PresentMode contentRef={contentRef} buttonLabel="Præsentér side" />
        </div>
        <article ref={contentRef} className="lesson-main lesson prose">
          {children}
        </article>
      </div>
    </div>
  )
}
