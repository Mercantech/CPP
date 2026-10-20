import Callout from '../../components/Callout'
import CodeBlock from '../../components/CodeBlock'
import FileProjectExplorer from '../../components/FileProjectExplorer'
import LessonIntro from '../../components/LessonIntro'
import LessonLayout from '../../components/LessonLayout'
import { sensorProject } from '../../data/projects'

export default function Filer() {
  return (
    <LessonLayout module="h3">
      <h1>Organisering med .h og .cpp</h1>
      <LessonIntro>
        <p>
          Headeren er kontrakten. Implementationen er arbejdet. Sketch’en er dirigenten. Når du
          forstår include og linking, forstår du, hvorfor store Arduino-projekter ikke skal leve i én
          fil.
        </p>
      </LessonIntro>

      <h2>Rollerne</h2>
      <div className="why-grid">
        <div className="why-card">
          <h3>.ino</h3>
          <p>
            Entry point: <code>setup</code> / <code>loop</code>. Skal være tynd og kalde moduler.
          </p>
        </div>
        <div className="why-card">
          <h3>.h</h3>
          <p>Deklarationer, konstanter, include guards — “indholdsfortegnelsen”.</p>
        </div>
        <div className="why-card">
          <h3>.cpp</h3>
          <p>Funktionskroppe. Inkluderer egen header. Her bor detaljerne.</p>
        </div>
        <div className="why-card">
          <h3>Linker</h3>
          <p>Sætter kald fra .ino sammen med kroppe i .cpp til ét program.</p>
        </div>
      </div>

      <h2>Udforsk et projekt</h2>
      <p>Klik filerne — se hvad der hører hjemme hvor, og hvordan de hænger sammen.</p>
      <FileProjectExplorer files={sensorProject} title="SensorSketch" />

      <h2>Include er tekst-indsættelse</h2>
      <p>
        Når compileren (egentlig præprocessoren) ser <code>#include "sensor.h"</code>, indsættes
        headerens indhold <strong>tekstuelt</strong> på det sted. Derfor bliver prototyperne synlige
        i <code>main.ino</code>, mens kroppene stadig bor i <code>sensor.cpp</code> og findes ved
        link.
      </p>
      <div className="include-flow" aria-label="Include flow">
        <span className="include-flow__chip include-flow__chip--active">main.ino</span>
        <span aria-hidden>→</span>
        <span className="include-flow__chip">#include "sensor.h"</span>
        <span aria-hidden>→</span>
        <span className="include-flow__chip">prototyper synlige</span>
        <span aria-hidden>→</span>
        <span className="include-flow__chip">sensor.cpp implementerer</span>
      </div>

      <h2>Include guards</h2>
      <p>
        Hvis flere filer inkluderer samme header, risikerer du dobbeltdefinitioner. Guard’en sørger
        for, at indholdet kun behandles én gang:
      </p>
      <CodeBlock language="cpp">{`#ifndef SENSOR_H
#define SENSOR_H

// ... deklarationer ...

#endif
`}</CodeBlock>
      <Callout type="info">
        <p>
          Første gang ses <code>SENSOR_H</code> ikke → indholdet læses og makroen sættes. Næste
          include: <code>#ifndef</code> er falsk → resten springes over.
        </p>
      </Callout>

      <h2>Anførselstegn vs. vinkelparentes</h2>
      <ul>
        <li>
          <code>#include "sensor.h"</code> — din egen fil (søges først i projektmappen)
        </li>
        <li>
          <code>#include &lt;Arduino.h&gt;</code> — bibliotek / systemheader
        </li>
      </ul>
      <p>
        I <code>.cpp</code>-filer der bruger Arduino-API (fx <code>analogRead</code>) skal{' '}
        <code>Arduino.h</code> være inkluderet — typisk via din egen header som i eksemplet.
      </p>

      <h2>Sådan bygger Arduino IDE’en</h2>
      <div className="build-steps">
        <div className="build-steps__step">
          <span className="build-steps__n">1</span>
          <div>
            <strong>Sketch-mappe</strong>
            <p>
              Alle <code>.ino</code>, <code>.h</code> og <code>.cpp</code> i samme mappe hører til
              projektet.
            </p>
          </div>
        </div>
        <div className="build-steps__step">
          <span className="build-steps__n">2</span>
          <div>
            <strong>Concat + compile</strong>
            <p>
              IDE’en samler <code>.ino</code>-filer og oversætter dem sammen med dine{' '}
              <code>.cpp</code>-filer til objektkode.
            </p>
          </div>
        </div>
        <div className="build-steps__step">
          <span className="build-steps__n">3</span>
          <div>
            <strong>Link</strong>
            <p>
              Linker’en samler objekterne: kald fra <code>main.ino</code> finder kroppene i{' '}
              <code>sensor.cpp</code>.
            </p>
          </div>
        </div>
      </div>

      <h2>Typiske fejl</h2>
      <Callout type="danger">
        <p>
          <strong>Glemt include guard</strong> → “multiple definition” / redefinition-fejl.
        </p>
      </Callout>
      <Callout type="danger">
        <p>
          <strong>Glemt <code>#include &lt;Arduino.h&gt;</code></strong> i en{' '}
          <code>.cpp</code> der kalder <code>digitalWrite</code> → “was not declared”.
        </p>
      </Callout>
      <Callout type="danger">
        <p>
          <strong>Cirkulær include</strong> (A.h inkluderer B.h som inkluderer A.h) → kaos. Løsning:
          flyt fælles typer til en tredje header, eller brug forward declarations.
        </p>
      </Callout>
      <Callout type="warn">
        <p>
          <strong>Implementering i .h</strong> (store funktionskroppe) → kan give multiple
          definition ved link, medmindre du bruger <code>inline</code>. Hold kroppe i{' '}
          <code>.cpp</code>.
        </p>
      </Callout>

      <h2>Hvad linker’en egentlig gør</h2>
      <p>
        Compile giver dig objektfiler med “huller”: kaldet <code>readTemperature()</code> i .ino ved,
        at funktionen findes (pga. prototypen), men adressen kendes først, når{' '}
        <code>sensor.cpp</code> er linket ind. Mangler .cpp’en i projektet → “undefined reference”.
      </p>
      <Callout type="info">
        <p>
          I Arduino IDE: læg <code>.h</code> og <code>.cpp</code> i samme sketch-mappe som{' '}
          <code>.ino</code>. Fanerne dukker op automatisk.
        </p>
      </Callout>

      <h2>Mini-regler for flot filopdeling</h2>
      <ul>
        <li>
          Én “modul”-idé pr. par: <code>sensor.h</code> + <code>sensor.cpp</code>
        </li>
        <li>
          <code>.ino</code> orkestrerer — den skal være tynd
        </li>
        <li>Offentligt API i headeren, private hjælpere kun i .cpp (fx <code>static</code>)</li>
        <li>Konstanter der deles → header; kun-interne → .cpp</li>
        <li>Hold include-grafen acyklisk — fælles typer i en lille <code>types.h</code> om nødvendigt</li>
      </ul>
    </LessonLayout>
  )
}
