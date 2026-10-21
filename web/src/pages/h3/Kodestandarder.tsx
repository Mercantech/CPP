import Callout from '../../components/Callout'
import ChecklistInteractive from '../../components/ChecklistInteractive'
import CodeBlock from '../../components/CodeBlock'
import LessonIntro from '../../components/LessonIntro'
import LessonLayout from '../../components/LessonLayout'
import { TEMPLATE_REPO_URL } from '../../data/projects'

export function KodestandarderContent() {
  return (
    <>
      <h1>Kodestandarder (H3-templaten)</h1>
      <LessonIntro>
        <p>
          Reglerne herunder er de samme som i{' '}
          <a href={TEMPLATE_REPO_URL} target="_blank" rel="noreferrer">
            H3/Arduino README
          </a>
          : engelsk i kode, dansk i kommentarer/undervisning, og <code>main.cpp</code> der kun
          wirer.
        </p>
      </LessonIntro>

      <h2>Sprog i koden</h2>
      <div className="why-grid">
        <div className="why-card">
          <h3>Engelsk</h3>
          <p>
            Variabler, funktioner, filnavne, typer:{' '}
            <code>temperatureCelsius</code>, <code>renderButtonLeds</code>,{' '}
            <code>SensorReading</code>
          </p>
        </div>
        <div className="why-card">
          <h3>Dansk OK</h3>
          <p>Kommentarer og README til undervisning — forklar <em>hvorfor</em>.</p>
        </div>
        <div className="why-card">
          <h3>Display-tekst</h3>
          <p>Kan være engelsk i skabelonen — tilpas til jeres brugere.</p>
        </div>
        <div className="why-card">
          <h3>main.cpp</h3>
          <p>Kun wiring: læs sensorer, kald moduler. Ingen tung logik.</p>
        </div>
      </div>

      <h2>Navngivning (camelCase + tydelige verber)</h2>
      <CodeBlock language="cpp" filename="naming.cpp" highlightLines={[2, 3, 4]}>{`// Fra templaten — beskrivende engelske navne
float temperatureCelsius;
unsigned long lastDisplayUpdateMs;
SensorReading readEnvironmentSensors(MKRIoTCarrier& carrier);
void renderSensorScreen(...);
void temperatureToRgb(float temperatureCelsius, int& red, int& green, int& blue);
`}</CodeBlock>
      <CodeBlock language="cpp" filename="bad_names.cpp" highlightLines={[1, 2, 3]}>{`// Undgå dette
int t; int x; void go() { /* … */ }
`}</CodeBlock>
      <ul>
        <li>
          Funktioner/variabler: <code>camelCase</code>
        </li>
        <li>
          Konstanter/macros i config: <code>UPPER_SNAKE</code> — <code>DISPLAY_INTERVAL_MS</code>
        </li>
        <li>
          Typer/structs: <code>PascalCase</code> — <code>SensorReading</code>
        </li>
        <li>
          Filnavne matcher modulet: <code>environment_sensors.h</code> /{' '}
          <code>environment_sensors.cpp</code>
        </li>
      </ul>

      <h2>main.cpp = tynd dirigent</h2>
      <CodeBlock language="cpp" filename="src/main.cpp">{`void loop() {
  carrier.Buttons.update();
  const SensorReading reading = readEnvironmentSensors(carrier);
  // … touch / gesture / shake …
  if (nowMs - lastDisplayUpdateMs >= DISPLAY_INTERVAL_MS) {
    lastDisplayUpdateMs = nowMs;
    renderSensorScreen(carrier, reading, shakeDetected, lastGestureLabel);
  }
  delay(LOOP_DELAY_MS);
}
`}</CodeBlock>
      <Callout type="tip">
        <p>
          Hvis <code>loop()</code> begynder at “gøre alt”, er det et signal om at udtrække et nyt
          modul — præcis som templaten allerede har gjort med sensors, display og LEDs.
        </p>
      </Callout>

      <h2>Privat state i anonym namespace</h2>
      <p>
        I <code>main.cpp</code> ligger midlertidig app-state i et anonymt namespace — synligt kun i
        den oversættelsesenhed (filen), ikke som globale symboler til resten af projektet:
      </p>
      <CodeBlock language="cpp" filename="src/main.cpp">{`namespace {
bool shakeModeEnabled = false;
unsigned long lastDisplayUpdateMs = 0;
}  // namespace
`}</CodeBlock>

      <h2>Non-blocking timing</h2>
      <p>
        Templaten opdaterer display med interval — ikke lange <code>delay()</code> midt i arbejdet:
      </p>
      <CodeBlock language="cpp" filename="timing.cpp" highlightLines={[1]}>{`if (nowMs - lastDisplayUpdateMs >= DISPLAY_INTERVAL_MS) {
  lastDisplayUpdateMs = nowMs;
  renderSensorScreen(...);
}
`}</CodeBlock>
      <Callout type="warn">
        <p>
          Sammenlign med <code>now - last</code> (som her), så <code>millis()</code>-wrap håndteres
          korrekt. Brug <code>unsigned long</code> til tidsstempler.
        </p>
      </Callout>

      <h2>Secrets uden for git</h2>
      <ul>
        <li>
          <code>config.h</code> — offentligt, commit OK
        </li>
        <li>
          <code>secrets.h</code> — fra example-filen, i <code>.gitignore</code>
        </li>
      </ul>

      <h2>Tjekliste før I kalder det “færdigt”</h2>
      <p>Markér undervejs — listen gemmes kun i denne session (ikke localStorage).</p>
      <ChecklistInteractive
        items={[
          {
            id: 'en',
            label: 'Engelske identifikatorer; danske kommentarer hvor det hjælper',
          },
          { id: 'main', label: 'main.cpp wirer kun' },
          { id: 'pair', label: 'Nyt ansvar = nyt navn.h / navn.cpp-par' },
          { id: 'types', label: 'Fælles data i types.h' },
          {
            id: 'test',
            label: 'Pure logic kan testes med pio test -e native når det giver mening',
          },
        ]}
      />
    </>
  )
}

export default function Kodestandarder() {
  return (
    <LessonLayout module="h3">
      <KodestandarderContent />
    </LessonLayout>
  )
}

