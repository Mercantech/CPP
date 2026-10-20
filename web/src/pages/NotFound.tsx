import { Link } from 'react-router-dom'
export default function NotFound() {
  return <section className="placeholder-page"><p className="eyebrow">404 / UKENDT ADRESSE</p><h1>Den lektion findes ikke her.</h1><p>Find næste skridt i et af forløbene.</p><div className="cta-row"><Link className="btn btn--primary" to="/h3">Åbn H3</Link><Link className="btn btn--ghost" to="/h5">Åbn H5</Link></div></section>
}
