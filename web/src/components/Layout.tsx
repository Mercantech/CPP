import { NavLink, Outlet } from 'react-router-dom'

const navItems = [
  { to: '/', label: 'Forside', end: true },
  { to: '/historie', label: 'Historie', end: false },
  { to: '/h3', label: 'H3', end: false },
  { to: '/h5', label: 'H5', end: true },
]

export default function Layout() {
  return (
    <>
      <header className="site-header">
        <div className="site-header__inner">
          <NavLink to="/" className="site-logo" end>
            C<span>++</span>
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
      <main className="site-main">
        <Outlet />
      </main>
      <footer className="site-footer">
        <p>
          CPP · C++ til H3 og H5 · Mercantec ·{' '}
          <a href="https://cpp.mercantec.tech">cpp.mercantec.tech</a>
        </p>
      </footer>
    </>
  )
}
