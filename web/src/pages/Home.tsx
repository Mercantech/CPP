import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="home">
      <section className="home-hero" aria-label="CPP">
        <div className="home-hero__copy">
          <p className="home-hero__eyebrow">Mercantec · Datatekniker</p>
          <h1 className="home-hero__brand">
            C<span>++</span>
          </h1>
          <p className="home-hero__title">Struktureret kode til H3 — og historien bag sproget</p>
          <p className="home-hero__lead">
            Undervisningssider om Arduino C++: funktioner, datatyper, filopdeling og den røde tråd
            fra C til C#. Ingen login. Bare pensum.
          </p>
          <div className="cta-row">
            <Link className="btn btn--primary" to="/h3?present=1">
              Præsentér H3
            </Link>
            <Link className="btn btn--ghost" to="/h3">
              Åbn H3
            </Link>
            <Link className="btn btn--ghost" to="/historie">
              Læs historien
            </Link>
          </div>
        </div>
        <aside className="home-hero__code" aria-hidden="true">
          <pre>{`// H3 template — main.cpp wiring only
const SensorReading reading =
  readEnvironmentSensors(carrier);

if (nowMs - lastDisplayUpdateMs
    >= DISPLAY_INTERVAL_MS) {
  lastDisplayUpdateMs = nowMs;
  renderSensorScreen(
    carrier, reading,
    shakeDetected, lastGestureLabel);
}`}</pre>
        </aside>
      </section>

      <section className="home-paths" aria-label="Indhold">
        <h2 className="home-section-title">Hvor vil du hen?</h2>
        <div className="path-list">
          <Link className="path-row" to="/historie">
            <span className="path-row__num">01</span>
            <span className="path-row__body">
              <span className="path-row__label">Historie</span>
              <span className="path-row__desc">
                Interaktiv tidslinje: Simula, C, Stroustrup, ISO, Java, C#, Arduino
              </span>
            </span>
            <span className="path-row__arrow" aria-hidden>
              →
            </span>
          </Link>
          <Link className="path-row" to="/h3?present=1">
            <span className="path-row__num">02</span>
            <span className="path-row__body">
              <span className="path-row__label">H3 · Præsentér</span>
              <span className="path-row__desc">
                Start fra Oversigt — Næste går videre til Funktioner, Datatyper, …
              </span>
            </span>
            <span className="path-row__arrow" aria-hidden>
              →
            </span>
          </Link>
          <Link className="path-row" to="/h3">
            <span className="path-row__num">02b</span>
            <span className="path-row__body">
              <span className="path-row__label">H3 · Lektioner</span>
              <span className="path-row__desc">
                Læs side for side — samme Præsentér-knap kæder også siderne
              </span>
            </span>
            <span className="path-row__arrow" aria-hidden>
              →
            </span>
          </Link>
          <Link className="path-row path-row--muted" to="/h5">
            <span className="path-row__num">03</span>
            <span className="path-row__body">
              <span className="path-row__label">H5</span>
              <span className="path-row__desc">Kommer snart</span>
            </span>
            <span className="path-row__arrow" aria-hidden>
              →
            </span>
          </Link>
        </div>
      </section>
    </div>
  )
}
