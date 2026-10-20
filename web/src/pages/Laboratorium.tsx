import { Link } from 'react-router-dom'
import ReferenceLab from '../components/labs/ReferenceLab'
import TypesLab from '../components/labs/TypesLab'
import TimerLab from '../components/labs/TimerLab'

export default function Laboratorium() {
  return (
    <div className="lab-page">
      <section className="lab-hero" aria-labelledby="lab-title">
        <p className="lab-eyebrow">C++ / interaktive eksempler</p>
        <h1 id="lab-title">Laboratorium</h1>
        <p>Undersøg referencer, datatyper og tidsmåling med små, interaktive eksempler. Forudsig resultatet, ændr en værdi, og sammenlign med det, du forventede.</p>
        <nav className="lab-controls" aria-label="Laboratoriets eksperimenter">
          <a className="lab-button" href="#referencer">01 / Referencer</a>
          <a className="lab-button" href="#bits">02 / Typer &amp; bit</a>
          <a className="lab-button" href="#millis">03 / millis()</a>
        </nav>
      </section>
      <p className="lab-note lab-model-note"><strong>Eksemplerne er modeller med faste rammer.</strong> Kontrollerne ændrer de viste eksempler lokalt i din browser. Laboratoriet indeholder ikke en C++-compiler og kan derfor ikke køre kode, du selv indsætter. Kopiér eksemplerne til Arduino IDE for at undersøge dem på et board.</p>
      <div className="lab-grid">
        <ReferenceLab />
        <TypesLab />
        <TimerLab />
      </div>
      <section className="lab-debrief" aria-labelledby="lab-debrief-title">
        <p className="lab-eyebrow">Efter forsøget</p>
        <h2 id="lab-debrief-title">Forklar, hvad der sker</h2>
        <p>Vælg ét eksperiment og forklar resultatet til din makker uden at pege på skærmen. Skift derefter én ting i den rigtige kode, forudsig resultatet, og undersøg forskellen i Serial Monitor.</p>
        <div className="lab-controls"><Link className="lab-button" to="/h3/funktioner">Arbejd videre med funktioner →</Link><Link className="lab-button" to="/h3/datatyper">Gå i dybden med datatyper →</Link></div>
      </section>
    </div>
  )
}
