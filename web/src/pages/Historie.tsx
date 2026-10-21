import Callout from '../components/Callout'
import InteractiveTimeline from '../components/InteractiveTimeline'
import LanguageLineage from '../components/LanguageLineage'
import LessonLayout from '../components/LessonLayout'

export default function Historie() {
  return (
    <LessonLayout module="historie" hideSidebar>
      <h1>Historien bag C++</h1>
      <p>
        I kommer fra C# — klasser, typer og scope er allerede i værktøjskassen. C++ er den ældre
        fætter i samme sprogfamilie: bevidst evolution af C, designet til abstraktion uden at ofre
        hastighed. Tidslinjen herunder forklarer, hvorfor Arduino kører C++, og hvor jeres C#-vaner
        hjælper (og hvor kontrakten er en anden).
      </p>

      <LanguageLineage />

      <Callout type="tip">
        <p>
          <strong>Tidslinjen:</strong> vælg et årstal, bladre med Forrige/Næste, eller brug
          piletasterne når fokus er i området.
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
          <h3>Fra C# til C++</h3>
          <p>
            C# arvede den familiære syntaks og type-tænkning — men flyttede hukommelse til en
            runtime (GC). I C++/Arduino er du tættere på hardware: færre “det ordner runtime”.
          </p>
        </div>
      </div>

      <h2>Hvad tager du med til H3?</h2>
      <ul>
        <li>C++ er skabt af Bjarne Stroustrup på Bell Labs som næste skridt efter C.</li>
        <li>Arduino-sketches er C++ — derfor gælder funktioner, typer, scope og .h/.cpp her.</li>
        <li>
          Din C#-baggrund er en fordel: samme mentale model for struktur. Forskellen er især
          hukommelse, headers/.cpp og at der ikke er en GC, der rydder op for dig.
        </li>
      </ul>
    </LessonLayout>
  )
}
