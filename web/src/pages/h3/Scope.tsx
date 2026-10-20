import Callout from '../../components/Callout'
import CodeBlock from '../../components/CodeBlock'
import LessonIntro from '../../components/LessonIntro'
import LessonLayout from '../../components/LessonLayout'

export default function Scope() {
  return (
    <LessonLayout module="h3">
      <h1>Globale vs. lokale variabler</h1>
      <LessonIntro>
        <p>
          Scope er to spørgsmål: <em>hvor kan jeg se variablen?</em> og{' '}
          <em>hvor længe lever den?</em> Svaret styrer, hvor fejl dukker op — og hvor let koden er at
          følge.
        </p>
      </LessonIntro>

      <h2>To verdener</h2>
      <div className="scope-viz">
        <div className="scope-viz__box scope-viz__box--global">
          <h3>Globale</h3>
          <ul>
            <li>Deklareres uden for funktioner</li>
            <li>Synlige i hele filen (og mere med <code>extern</code>)</li>
            <li>Lever hele programmets levetid</li>
            <li>Nyttige til delt state — men dyre i overblik</li>
          </ul>
        </div>
        <div className="scope-viz__box scope-viz__box--local">
          <h3>Lokale</h3>
          <ul>
            <li>Deklareres inde i en funktion (eller blok)</li>
            <li>Kun synlige dér</li>
            <li>Dør når blokken slutter</li>
            <li>Standardvalget, når data kun bruges ét sted</li>
          </ul>
        </div>
      </div>

      <h2>Samme navn, forskellig verden</h2>
      <CodeBlock language="cpp">{`int value = 10;  // global

void demo() {
  int value = 5;  // lokal — skygger den globale inde i demo()
  Serial.println(value);  // 5
}

void loop() {
  demo();
  Serial.println(value);  // 10 — den globale
}
`}</CodeBlock>
      <Callout type="warn">
        <p>
          Shadowing (lokalt navn der skjuler globalt) forvirrer. Undgå samme navn i begge lag, medmindre
          det er helt bevidst.
        </p>
      </Callout>

      <h2>Klassisk eksempel</h2>
      <CodeBlock language="cpp">{`const int LED_PIN = 13;  // global konstant — ok

void blinkLED() {
  int delayTime = 500;  // lokal — kun her

  digitalWrite(LED_PIN, HIGH);
  delay(delayTime);
  digitalWrite(LED_PIN, LOW);
  delay(delayTime);
}

void loop() {
  blinkLED();
  // delayTime findes ikke her
}
`}</CodeBlock>

      <h2>State mellem loop-kald</h2>
      <p>
        Lokale variabler husker ikke noget mellem kald. Har du brug for “sidste gang vi blinkede”, skal
        værdien leve længere:
      </p>
      <CodeBlock language="cpp">{`// Mulighed A: global state
unsigned long lastBlink = 0;

// Mulighed B: static lokal — privat, men lang levetid
void blinkNonBlocking() {
  static unsigned long last = 0;
  static bool on = false;

  if (millis() - last < 500UL) return;
  last = millis();
  on = !on;
  digitalWrite(LED_BUILTIN, on ? HIGH : LOW);
}
`}</CodeBlock>
      <Callout type="tip">
        <p>
          <code>static</code> inde i en funktion er ofte det bedste kompromis: husket mellem kald,
          skjult for resten af programmet.
        </p>
      </Callout>

      <h2>Blok-scope</h2>
      <p>Selv inde i en funktion kan krøllede parenteser begrænse levetid:</p>
      <CodeBlock language="cpp">{`void example() {
  if (true) {
    int onlyHere = 42;
    Serial.println(onlyHere);
  }
  // onlyHere er væk
}
`}</CodeBlock>

      <h2>Tommelfingerregler</h2>
      <ul>
        <li>
          Konstanter (pins, grænser) → <code>const</code> globalt i toppen
        </li>
        <li>Midlertidige beregninger → lokale</li>
        <li>
          State mellem <code>loop()</code>-iterationer → <code>static</code> lokal eller få, tydelige
          globale
        </li>
        <li>Jo færre globale mutérbare variabler, jo lettere fejlsøgning</li>
      </ul>
    </LessonLayout>
  )
}
