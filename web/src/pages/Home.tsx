import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <>
      <section className="hero" aria-label="CPP forsides">
        <div className="hero__glow" aria-hidden />
        <p className="hero__brand">CPP</p>
        <h1 className="hero__title">C++ til H3 og H5</h1>
        <p className="hero__lead">
          Struktureret Arduino-kode, sprogets historie og den røde tråd til C# — bygget til undervisning
          på Mercantec.
        </p>
        <div className="cta-row">
          <Link className="btn btn--primary" to="/h3">
            Start H3-pensum
          </Link>
          <Link className="btn btn--ghost" to="/historie">
            Udforsk historien
          </Link>
        </div>
      </section>

      <div className="hub-grid">
        <Link className="hub-link" to="/historie">
          <h2>Historie</h2>
          <p>Fra C og Bell Labs til C++, Stroustrup og arven i C# og Arduino.</p>
        </Link>
        <Link className="hub-link" to="/h3">
          <h2>H3</h2>
          <p>Funktioner, datatyper, scope, .h/.cpp-filopdeling og kodestandarder.</p>
        </Link>
        <Link className="hub-link" to="/h5">
          <h2>H5</h2>
          <p>Næste niveau — kommer snart.</p>
        </Link>
      </div>
    </>
  )
}
