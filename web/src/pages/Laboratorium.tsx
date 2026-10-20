import { Link } from 'react-router-dom'
import ReferenceLab from '../components/labs/ReferenceLab'
import TypesLab from '../components/labs/TypesLab'
import TimerLab from '../components/labs/TimerLab'

export default function Laboratorium() {
  return (
    <div className="lab-page">
      <section className="lab-hero" aria-labelledby="lab-title">
        <p className="lab-eyebrow">CPP / interaktivt laboratorium</p>
        <h1 id="lab-title">Gør det usynlige<br /><span>til noget, du kan se.</span></h1>
        <p>Hvad sker der egentlig, når du sætter et <code>&amp;</code>, fylder en byte eller lader uret løbe rundt? Stil en hypotese. Tryk på knapperne. Få C++ under huden.</p>
        <nav className="lab-controls" aria-label="Laboratoriets eksperimenter">
          <a className="lab-button" href="#referencer">01 / Referencer</a>
          <a className="lab-button" href="#bits">02 / Typer &amp; bit</a>
          <a className="lab-button" href="#millis">03 / millis()</a>
        </nav>
      </section>
      <p className="lab-note lab-model-note"><strong>Model af faste eksempler — ikke en C++-compiler.</strong> Kontrollerne ændrer kun de viste, afgrænsede eksempler lokalt i din browser. Du kan ikke indsætte eller køre vilkårlig kode. Kopiér eksemplerne til din Arduino IDE for at prøve dem på et rigtigt board.</p>
      <div className="lab-grid">
        <ReferenceLab />
        <TypesLab />
        <TimerLab />
      </div>
      <section className="lab-debrief" aria-labelledby="lab-debrief-title">
        <p className="lab-eyebrow">Din næste mission</p>
        <h2 id="lab-debrief-title">Fra “det virker” til “jeg ved hvorfor”.</h2>
        <p>Vælg ét eksperiment og forklar resultatet til din makker uden at pege på skærmen. Skift derefter én ting i den rigtige kode, forudsig resultatet, og undersøg forskellen i Serial Monitor.</p>
        <div className="lab-controls"><Link className="lab-button" to="/h3/funktioner">Arbejd videre med funktioner →</Link><Link className="lab-button" to="/h3/datatyper">Gå i dybden med datatyper →</Link></div>
      </section>
    </div>
  )
}
