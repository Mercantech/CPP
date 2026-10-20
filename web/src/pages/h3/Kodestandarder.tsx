import Callout from '../../components/Callout'
import CodeBlock from '../../components/CodeBlock'
import LessonIntro from '../../components/LessonIntro'
import LessonLayout from '../../components/LessonLayout'

export default function Kodestandarder() {
  return (
    <LessonLayout module="h3">
      <h1>Kodestandarder og best practices</h1>
      <LessonIntro>
        <p>
          Professionel kode er ikke kun “det virker”. Det er navne, formatering og kommentarer der
          hjælper det næste menneske — ofte dig selv om tre uger.
        </p>
      </LessonIntro>

      <h2>Navngivning</h2>
      <div className="why-grid">
        <div className="why-card">
          <h3>Funktioner</h3>
          <p>
            <code>camelCase</code> · <code>readTemperature()</code> · <code>blinkLED()</code>
          </p>
        </div>
        <div className="why-card">
          <h3>Variabler</h3>
          <p>
            <code>camelCase</code> · <code>sensorValue</code> · <code>ledState</code>
          </p>
        </div>
        <div className="why-card">
          <h3>Konstanter</h3>
          <p>
            <code>UPPER_SNAKE</code> · <code>LED_PIN</code> · <code>MAX_TEMP</code>
          </p>
        </div>
        <div className="why-card">
          <h3>Undgå</h3>
          <p>
            <code>x</code>, <code>bp</code>, <code>tmp2</code> — medmindre scope er tre linjer
          </p>
        </div>
      </div>

      <h2>Formatering</h2>
      <ul>
        <li>2 eller 4 spaces — men vælg én stil og hold den</li>
        <li>
          Altid <code>{'{}'}</code>, også for enkeltlinjer (færre bugs ved senere rettelser)
        </li>
        <li>
          Mellemrum omkring operatorer: <code>a + b</code> ikke <code>a+b</code>
        </li>
        <li>Én erklæring pr. linje — undgå <code>int a, b, c;</code> når det kan undgås</li>
      </ul>

      <h2>Kommentarer: forklar hvorfor</h2>
      <CodeBlock language="cpp">{`// GOOD: forklarer hvorfor
// Vent 100 ms for at undgå knap-bounce
delay(100);

// BAD: gentager koden
// Sæt LED til HIGH
digitalWrite(LED_PIN, HIGH);
`}</CodeBlock>

      <h2>loop() som event-loop</h2>
      <p>
        Idealet: <code>loop()</code> vender hurtigt tilbage, så knapper, sensorer og display alle får
        en chance.
      </p>
      <CodeBlock language="cpp">{`// FORETRUKKET
void loop() {
  checkButtons();
  updateDisplay();
  readSensors();
}

// UNDGÅ
void loop() {
  while (true) { /* fanger kontrollen */ }
  delay(10000);  // blokerer alt i 10 sekunder
}
`}</CodeBlock>

      <h2>Non-blocking med millis()</h2>
      <CodeBlock language="cpp">{`const unsigned long BLINK_MS = 500;
unsigned long lastToggle = 0;
bool ledOn = false;

void loop() {
  unsigned long now = millis();
  if (now - lastToggle >= BLINK_MS) {
    lastToggle = now;
    ledOn = !ledOn;
    digitalWrite(LED_BUILTIN, ledOn ? HIGH : LOW);
  }
  // her kan du samtidig læse knapper osv.
}
`}</CodeBlock>
      <Callout type="tip">
        <p>
          Sammenlign altid med <code>now - last</code> (ikke <code>now &gt; last + interval</code>),
          så wrap-around af <code>millis()</code> håndteres korrekt.
        </p>
      </Callout>

      <h2>Tjekliste før du kalder det “færdigt”</h2>
      <ul>
        <li>Konstanter har UPPER_SNAKE-navne</li>
        <li>
          <code>loop()</code> er kort og kalder hjælpefunktioner
        </li>
        <li>Typer matcher data (især tid → <code>unsigned long</code>)</li>
        <li>Ingen magiske tal uden navn</li>
        <li>Kommentarer forklarer det ikke-oplagte</li>
      </ul>

      <h2>Ressourcer</h2>
      <ul>
        <li>
          <a href="https://www.arduino.cc/reference/en/" target="_blank" rel="noreferrer">
            Arduino Language Reference
          </a>
        </li>
        <li>
          <a
            href="https://www.arduino.cc/en/Reference/StyleGuide"
            target="_blank"
            rel="noreferrer"
          >
            Arduino Style Guide
          </a>
        </li>
      </ul>
    </LessonLayout>
  )
}
