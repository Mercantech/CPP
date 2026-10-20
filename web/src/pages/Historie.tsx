import Callout from '../components/Callout'
import InteractiveTimeline from '../components/InteractiveTimeline'
import LanguageLineage from '../components/LanguageLineage'
import LessonLayout from '../components/LessonLayout'

export default function Historie() {
  return (
    <LessonLayout module="historie">
      <h1>Historien bag C++</h1>
      <p>
        C++ er ikke bare “endnu et sprog”. Det er en bevidst evolution af C — designet til abstraktion
        uden at ofre hastighed. Tidslinjen herunder forklarer, hvorfor Arduino stadig kører C++, og
        hvorfor C# føles bekendt, når du kender klasser og typer.
      </p>

      <LanguageLineage />

      <Callout type="tip">
        <p>
          <strong>Sådan bruges tidslinjen:</strong> klik et årstal i bjælken, bladre med Forrige/Næste,
          eller udvid punkterne nedenunder. På tastatur: fokusér bjælken og brug piletasterne.
        </p>
      </Callout>

      <h2>Interaktiv tidslinje</h2>
      <InteractiveTimeline />

      <h2>Tre tråde at huske</h2>
      <div className="thread-grid">
        <div className="thread-card">
          <h3>Effektivitet</h3>
          <p>
            Fra C og Unix: tæt på hardware, forudsigelig omkostning. C++ arver det — “you don’t pay
            for what you don’t use”.
          </p>
        </div>
        <div className="thread-card">
          <h3>Abstraktion</h3>
          <p>
            Fra Simula til klasser, templates og biblioteker: modellér problemet uden at miste
            kontrol.
          </p>
        </div>
        <div className="thread-card">
          <h3>Arv til andre sprog</h3>
          <p>
            Java og C# genbruger den familiære syntaks og type-tænkning — men flytter hukommelse til
            en runtime.
          </p>
        </div>
      </div>

      <h2>Hvad tager du med til H3?</h2>
      <ul>
        <li>C++ er skabt af Bjarne Stroustrup på Bell Labs som næste skridt efter C.</li>
        <li>Arduino-sketches er C++ — derfor gælder funktioner, typer, scope og .h/.cpp her.</li>
        <li>Når du møder C# senere, genkender du strukturen — kontrakten om hukommelse er bare en anden.</li>
      </ul>
    </LessonLayout>
  )
}
