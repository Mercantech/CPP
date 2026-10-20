import { useEffect } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { ProgressProvider } from '../lib/progress'

const navItems = [
  { to: '/', label: 'Forside', end: true },
  { to: '/historie', label: 'Historie', end: false },
  { to: '/h3', label: 'H3', end: false },
  { to: '/h5', label: 'H5', end: false },
  { to: '/laboratorium', label: 'Laboratorium', end: false },
]

export default function Layout() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      const frame = requestAnimationFrame(() => {
        try { document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView() } catch { /* Ukendt anker ignoreres. */ }
      })
      return () => cancelAnimationFrame(frame)
    }
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname, hash])
  return (
    <ProgressProvider>
      <a className="skip-link" href="#indhold">Spring til indhold</a>
      <header className="site-header">
        <div className="site-header__inner">
          <NavLink to="/" className="site-logo" end>
            <img src="/history/cplusplus.svg" alt="" width="30" height="30" />
            <span className="site-logo__text">C++<small>H3 og H5 · Mercantec</small></span>
          </NavLink>
          <nav aria-label="Hovednavigation">
            <ul className="site-nav">
              {navItems.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.end}
                    className={({ isActive }) => (isActive ? 'active' : undefined)}
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>
      <main id="indhold" className="site-main">
        <Outlet />
      </main>
      <footer className="site-footer">
        <p>
          C++ · H3 og H5 · Mercantec ·{' '}
          <a href="https://cpp.mercantec.tech">cpp.mercantec.tech</a>
        </p>
      </footer>
      <p className="site-footer__note">Fremskridt og quizsvar gemmes i denne browser.</p>
    </ProgressProvider>
  )
}
