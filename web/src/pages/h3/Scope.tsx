import Callout from '../../components/Callout'
import CodeBlock from '../../components/CodeBlock'
import LessonLayout from '../../components/LessonLayout'

export default function Scope() {
  return (
    <LessonLayout module="h3">
      <h1>Globale vs. lokale variabler</h1>
      <p>
        Scope fortæller, <em>hvor</em> en variabel er synlig, og <em>hvor længe</em> den lever.
      </p>

      <h2>To verdener</h2>
      <div className="scope-viz">
        <div className="scope-viz__box scope-viz__box--global">
          <h3>Globale</h3>
          <ul>
            <li>Deklareres uden for funktioner</li>
            <li>Synlige overalt i filen (og mere med <code>extern</code>)</li>
            <li>Lever hele programmets levetid</li>
            <li>Del data mellem funktioner — men sparsomt</li>
          </ul>
        </div>
        <div className="scope-viz__box scope-viz__box--local">
          <h3>Lokale</h3>
          <ul>
            <li>Deklareres inde i en funktion</li>
            <li>Kun synlige dér</li>
            <li>Slettes når funktionen returnerer</li>
            <li>Foretrækkes når data kun bruges ét sted</li>
          </ul>
        </div>
      </div>

      <h2>Eksempel</h2>
      <CodeBlock language="cpp">{`// Global variable
int ledPin = 13;

void setup() {
  pinMode(ledPin, OUTPUT);  // ledPin is accessible here
}

void blinkLED() {
  // Local variable
  int delayTime = 500;

  digitalWrite(ledPin, HIGH);  // ledPin accessible
  delay(delayTime);            // delayTime accessible
  digitalWrite(ledPin, LOW);
  delay(delayTime);
  // delayTime is deleted when function ends
}

void loop() {
  blinkLED();
  // delayTime is NOT accessible here
}
`}</CodeBlock>

      <Callout type="warn">
        <p>
          For mange globale variabler gør koden svær at fejlsøge — “hvem ændrede den værdi?”. Start
          lokalt, løft til global kun når flere funktioner <em>skal</em> dele state.
        </p>
      </Callout>

      <h2>Tommelfingerregler</h2>
      <ul>
        <li>
          Pins og faste konstanter → <code>const</code> (ofte globalt i toppen)
        </li>
        <li>
          Midlertidige beregninger → lokale
        </li>
        <li>
          State der huskes mellem <code>loop()</code>-kald (fx <code>lastUpdate</code>) → global
          eller <code>static</code> lokal
        </li>
      </ul>

      <h2>static lokal — midt imellem</h2>
      <CodeBlock language="cpp">{`void toggleEverySecond() {
  static unsigned long last = 0;  // huskes mellem kald, men skjult for andre
  if (millis() - last >= 1000) {
    last = millis();
    // toggle something
  }
}
`}</CodeBlock>
      <p>
        <code>static</code> inde i en funktion giver “privat global” levetid med begrænset synlighed
        — ofte et godt kompromis.
      </p>
    </LessonLayout>
  )
}
