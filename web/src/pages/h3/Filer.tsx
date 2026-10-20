import Callout from '../../components/Callout'
import CodeBlock from '../../components/CodeBlock'
import FileProjectExplorer from '../../components/FileProjectExplorer'
import LessonIntro from '../../components/LessonIntro'
import LessonLayout from '../../components/LessonLayout'
import { oplaProject, TEMPLATE_REPO_URL } from '../../data/projects'

export default function Filer() {
  return (
    <LessonLayout module="h3">
      <h1>Filopdeling: H3 Oplà-templaten</h1>
      <LessonIntro>
        <p>
          Teorien her følger Mercantechs rigtige undervisningsskabelon —{' '}
          <a href={TEMPLATE_REPO_URL} target="_blank" rel="noreferrer">
            H3/Arduino
          </a>{' '}
          (MKR WiFi 1010 + Oplà IoT Carrier) med PlatformIO, <code>include/</code> +{' '}
          <code>src/</code> og tynd <code>main.cpp</code>.
        </p>
      </LessonIntro>

      <h2>PlatformIO-mapper</h2>
      <div className="why-grid">
        <div className="why-card">
          <h3>src/</h3>
          <p>
            Alle <code>.cpp</code> — inkl. <code>main.cpp</code> (wiring only).
          </p>
        </div>
        <div className="why-card">
          <h3>include/</h3>
          <p>
            Alle <code>.h</code> — PlatformIO lægger mappen automatisk på include-path.
          </p>
        </div>
        <div className="why-card">
          <h3>lib/</h3>
          <p>Valgfri lokale biblioteker (tom i demoen).</p>
        </div>
        <div className="why-card">
          <h3>test/</h3>
          <p>
            Unity-tests — fx <code>pio test -e native</code> for pure logic.
          </p>
        </div>
      </div>

      <Callout type="info">
        <p>
          I klassisk Arduino IDE ligger <code>.ino</code> + <code>.h</code>/<code>.cpp</code> i
          samme sketch-mappe. I H3 bruger I <strong>PlatformIO</strong>: samme C++-idé, klarere
          mappeopdeling.
        </p>
      </Callout>

      <h2>Modulkort (fra templaten)</h2>
      <table className="datatype-table">
        <thead>
          <tr>
            <th>Modul</th>
            <th>Filer</th>
            <th>Ansvar</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <strong>Config</strong>
            </td>
            <td>
              <code>include/config.h</code>, <code>src/secrets.h</code>
            </td>
            <td>Indstillinger og credentials</td>
          </tr>
          <tr>
            <td>
              <strong>Types</strong>
            </td>
            <td>
              <code>include/types.h</code>
            </td>
            <td>
              <code>SensorReading</code> m.m.
            </td>
          </tr>
          <tr>
            <td>
              <strong>Sensors</strong>
            </td>
            <td>
              <code>environment_sensors.*</code>
            </td>
            <td>Temp, fugt, tryk</td>
          </tr>
          <tr>
            <td>
              <strong>Display / LEDs / Input</strong>
            </td>
            <td>
              <code>display_renderer.*</code>, <code>led_controller.*</code>,{' '}
              <code>shake_detector.*</code>, <code>gesture_reader.*</code>
            </td>
            <td>Skærm, RGB-ring, ryst, gesture</td>
          </tr>
          <tr>
            <td>
              <strong>Network</strong>
            </td>
            <td>
              <code>wifi_manager.*</code>
            </td>
            <td>Valgfri WiFi</td>
          </tr>
          <tr>
            <td>
              <strong>Logic</strong>
            </td>
            <td>
              <code>temperature_color.*</code>
            </td>
            <td>Ren C++ — testbar på PC</td>
          </tr>
          <tr>
            <td>
              <strong>App</strong>
            </td>
            <td>
              <code>main.cpp</code>
            </td>
            <td>
              <code>setup()</code> + <code>loop()</code>
            </td>
          </tr>
        </tbody>
      </table>

      <h2>Udforsk filerne</h2>
      <p>
        Klik rundt i uddrag fra templaten. Læg mærke til: tynd <code>main.cpp</code>, fælles{' '}
        <code>types.h</code>, og at <code>temperature_color</code> ikke trækker Arduino-hardware ind.
      </p>
      <FileProjectExplorer files={oplaProject} title="H3/Arduino" />

      <h2>Include-flow i templaten</h2>
      <div className="include-flow" aria-label="Include flow">
        <span className="include-flow__chip include-flow__chip--active">main.cpp</span>
        <span aria-hidden>→</span>
        <span className="include-flow__chip">#include "environment_sensors.h"</span>
        <span aria-hidden>→</span>
        <span className="include-flow__chip">types.h (SensorReading)</span>
        <span aria-hidden>→</span>
        <span className="include-flow__chip">environment_sensors.cpp</span>
      </div>
      <p>
        Præprocessoren indsætter headerens tekst. Linker’en finder senere kroppen i den matchende{' '}
        <code>.cpp</code>. Mangler filen i <code>src/</code> → “undefined reference”.
      </p>

      <h2>Include guards + forward declaration</h2>
      <p>
        Templaten bruger klassiske guards (<code>#ifndef TYPES_H</code> …). Sensor-headeren
        forward-declarerer <code>class MKRIoTCarrier;</code>, så <code>.h</code> ikke behøver at
        trække hele carrier-biblioteket ind — implementationen inkluderer det i{' '}
        <code>.cpp</code>.
      </p>
      <CodeBlock language="cpp">{`// include/environment_sensors.h
#include "types.h"
class MKRIoTCarrier;  // forward — fuld type først i .cpp

SensorReading readEnvironmentSensors(MKRIoTCarrier& carrier);
`}</CodeBlock>

      <h2>config.h vs secrets.h</h2>
      <ul>
        <li>
          <code>config.h</code> — baud, intervaller, flags. <strong>Må</strong> commits.
        </li>
        <li>
          <code>secrets.h</code> — WiFi/API. Kopiér fra <code>secrets.h.example</code>. Commit{' '}
          <strong>aldrig</strong> den rigtige fil.
        </li>
      </ul>

      <h2>Pure logic + native test</h2>
      <p>
        <code>temperature_color.cpp</code> har ingen pins eller Serial — kun matematik. Derfor kan{' '}
        <code>[env:native]</code> i <code>platformio.ini</code> bygge netop den fil og køre Unity-tests
        på PC:
      </p>
      <CodeBlock language="text">{`pio run -t upload          # firmware til board
pio test -e native         # unit tests på PC (temperature_color)
`}</CodeBlock>
      <Callout type="tip">
        <p>
          Det er H3-mønsteret: hardware i egne moduler, beslutningslogik i rene funktioner I kan
          teste uden board.
        </p>
      </Callout>

      <h2>Typiske fejl</h2>
      <Callout type="danger">
        <p>
          <strong>Glemt include guard</strong> → redefinition, når flere filer inkluderer samme{' '}
          <code>.h</code>.
        </p>
      </Callout>
      <Callout type="danger">
        <p>
          <strong>Tung logik i main.cpp</strong> → template-reglen brydes; fejsøgning og tests
          bliver sværere.
        </p>
      </Callout>
      <Callout type="danger">
        <p>
          <strong>Secrets i config.h / git</strong> → credentials i historikken. Brug{' '}
          <code>secrets.h</code> + <code>.gitignore</code>.
        </p>
      </Callout>
      <Callout type="warn">
        <p>
          <strong>Cirkulære includes</strong> mellem headers → flyt fælles typer til{' '}
          <code>types.h</code> (som templaten gør).
        </p>
      </Callout>

      <h2>Sådan udvider I (fra README)</h2>
      <ol>
        <li>
          HTTP/MQTT i <code>wifi_manager</code> eller nyt <code>api_client</code>-modul
        </li>
        <li>
          Udvid <code>SensorReading</code> + <code>environment_sensors</code>
        </li>
        <li>
          Eget dashboard i <code>display_renderer</code>
        </li>
        <li>Flere pure-logic moduler med native tests</li>
      </ol>

      <p>
        Klon og kør:{' '}
        <a href={TEMPLATE_REPO_URL} target="_blank" rel="noreferrer">
          github.com/Mercantech/H3/tree/main/Arduino
        </a>
      </p>
    </LessonLayout>
  )
}
