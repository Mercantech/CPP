import Callout from '../../components/Callout'
import CodeBlock from '../../components/CodeBlock'
import LessonIntro from '../../components/LessonIntro'
import LessonLayout from '../../components/LessonLayout'
import MemoryStage from '../../components/MemoryStage'
import { stackFramesDemo } from '../../data/memoryDemos'
import { TEMPLATE_REPO_URL } from '../../data/projects'

export function ScopeContent() {
  return (
    <>
      <h1>Scope — synlighed og levetid</h1>
      <LessonIntro>
        <p>
          I{' '}
          <a href={TEMPLATE_REPO_URL} target="_blank" rel="noreferrer">
            H3-templaten
          </a>{' '}
          er <code>carrier</code> globalt (delt hardware), mens knap-state og tidsstempler gemmes i et{' '}
          <strong>anonymt namespace</strong> i <code>main.cpp</code> — privat for den fil.
        </p>
      </LessonIntro>

      <h2>Stack frames i aktion</h2>
      <p>
        Følg et funktionskald: global bliver, lokal frame pushes/pops. Det er kerneforskellen på
        levetid — også ift. C#, hvor stack/heap er skjult bag runtime.
      </p>
      <MemoryStage demo={stackFramesDemo} />

      <h2>To verdener</h2>
      <div className="scope-viz">
        <div className="scope-viz__box scope-viz__box--global">
          <h3>Globale / fil-synlige</h3>
          <ul>
            <li>
              <code>MKRIoTCarrier carrier;</code> i main — boardet alle kald bruger
            </li>
            <li>
              Konstanter i <code>config.h</code> via macros
            </li>
            <li>Brug sparsomt til mutérbar state</li>
          </ul>
        </div>
        <div className="scope-viz__box scope-viz__box--local">
          <h3>Lokale</h3>
          <ul>
            <li>
              <code>const SensorReading reading = …</code> inde i <code>loop()</code>
            </li>
            <li>Kun synlige i blokken</li>
            <li>Standardvalg til midlertidige værdier</li>
          </ul>
        </div>
      </div>

      <h2>Anonymt namespace (fra main.cpp)</h2>
      <CodeBlock language="cpp" filename="src/main.cpp">{`namespace {
bool shakeModeEnabled = false;
char lastGestureLabel[8] = "-";
unsigned long lastShakeTimestampMs = 0;
unsigned long lastDisplayUpdateMs = 0;
}  // namespace
`}</CodeBlock>
      <p>
        Det ligner “globale variabler”, men symbolerne eksporteres ikke til andre{' '}
        <code>.cpp</code>-filer. Bedre end et hav af ægte globals — stadig synlige i hele{' '}
        <code>main.cpp</code>.
      </p>
      <Callout type="tip">
        <p>
          Har ét modul brug for privat state? Hold den i modulets <code>.cpp</code> (evt.{' '}
          <code>static</code> eller anonymt namespace) — ikke i headeren.
        </p>
      </Callout>

      <h2>Data der krydser moduler: types.h</h2>
      <p>
        I stedet for mange løse globale floats sender I en struct. Det er stadig “delt data”, men med
        et klart navn og uden skjulte sideeffekter:
      </p>
      <CodeBlock language="cpp" filename="include/types.h">{`struct SensorReading {
  float temperatureCelsius;
  float humidityPercent;
  float pressureKPa;
};

// loop:
const SensorReading reading = readEnvironmentSensors(carrier);
renderSensorScreen(carrier, reading, shakeDetected, lastGestureLabel);
`}</CodeBlock>

      <h2>Levetid mellem loop-kald</h2>
      <CodeBlock language="cpp" filename="src/main.cpp" highlightLines={[5, 6, 7]}>{`// Huskes mellem iterationer (anonymt namespace i main)
unsigned long lastDisplayUpdateMs = 0;

void loop() {
  const unsigned long nowMs = millis();
  if (nowMs - lastDisplayUpdateMs >= DISPLAY_INTERVAL_MS) {
    lastDisplayUpdateMs = nowMs;
    // opdater display
  }
}
`}</CodeBlock>
      <Callout type="warn">
        <p>
          En lokal <code>unsigned long last = 0;</code> inde i <code>loop()</code> uden{' '}
          <code>static</code> nulstilles hver gang — interval-logikken virker ikke.
        </p>
      </Callout>

      <h2>Tommelfingerregler (H3)</h2>
      <ul>
        <li>Hardware-objekter: få, tydelige (som <code>carrier</code>)</li>
        <li>App-state til main: anonymt namespace</li>
        <li>Delt betydning på tværs af moduler: struct i <code>types.h</code></li>
        <li>Midlertidige beregninger: lokale i funktionen</li>
      </ul>
    </>
  )
}

export default function Scope() {
  return (
    <LessonLayout module="h3">
      <ScopeContent />
    </LessonLayout>
  )
}

