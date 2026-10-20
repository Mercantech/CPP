import { Link } from 'react-router-dom'

export default function H5Placeholder() {
  return (
    <div className="placeholder-page">
      <h1>H5</h1>
      <p>Næste niveau af C++-pensum er på vej.</p>
      <p>Indtil da: gennemfør H3 — struktureret Arduino C++.</p>
      <div className="cta-row" style={{ justifyContent: 'center' }}>
        <Link className="btn btn--primary" to="/h3">
          Gå til H3
        </Link>
        <Link className="btn btn--ghost" to="/historie">
          Læs historien
        </Link>
      </div>
    </div>
  )
}
