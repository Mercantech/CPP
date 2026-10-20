import Callout from '../../components/Callout'
import CodeBlock from '../../components/CodeBlock'
import LessonIntro from '../../components/LessonIntro'
import LessonLayout from '../../components/LessonLayout'

export default function Funktioner() {
  return (
    <LessonLayout module="h3">
      <h1>Funktioner i Arduino C++</h1>
      <LessonIntro>
        <p>
          Funktioner er navngivne kodeblokke med én opgave. Du kender <code>setup()</code> og{' '}
          <code>loop()</code> — nu designer du selv API’et for dit program.
        </p>
      </LessonIntro>

      <h2>Anatomi</h2>
      <p>En funktion har fire dele: returtype, navn, parametre og krop.</p>
      <CodeBlock language="cpp">{`returnType functionName(parameterType parameterName) {
  // arbejde her
  return value; // kun hvis returnType ikke er void
}
`}</CodeBlock>
      <ul>
        <li>
          <strong>Returtype</strong> — hvad kalderen får tilbage (<code>void</code> = intet)
        </li>
        <li>
          <strong>Navn</strong> — verbum der beskriver handlingen
        </li>
        <li>
          <strong>Parametere</strong> — input udefra (kan være tomme)
        </li>
        <li>
          <strong>Krop</strong> — det der faktisk sker
        </li>
      </ul>

      <h2>void — sideeffekter</h2>
      <p>
        Brug <code>void</code>, når du ændrer verden (pins, Serial) uden at returnere et resultat.
      </p>
      <CodeBlock language="cpp">{`void blinkLED(int pin, int delayTime) {
  digitalWrite(pin, HIGH);
  delay(delayTime);
  digitalWrite(pin, LOW);
  delay(delayTime);
}

void loop() {
  blinkLED(13, 500);
}
`}</CodeBlock>
      <Callout type="warn">
        <p>
          <code>delay()</code> inde i hjælpefunktioner blokerer stadig hele programmet. Til mere
          avancerede sketches: non-blocking med <code>millis()</code> (se kodestandarder).
        </p>
      </Callout>

      <h2>Return — beregn og giv videre</h2>
      <p>
        Når du beregner noget, returnér det. Så kan <code>loop()</code> beslutte, hvad der skal ske
        med værdien (print, sammenlign, gem).
      </p>
      <CodeBlock language="cpp">{`float readTemperature() {
  int sensorValue = analogRead(A0);
  float voltage = sensorValue * (5.0 / 1023.0);
  return (voltage - 0.5) * 100.0;
}

void loop() {
  float temp = readTemperature();
  Serial.println(temp);
  delay(1000);
}
`}</CodeBlock>

      <h2>Parametre vs. globale</h2>
      <p>
        Parametre gør funktionen genbrugelig: samme <code>blinkLED</code> på pin 13 og pin 7.
        Globale pins er ok til faste board-layout — men parametre vinder, når logikken skal kunne
        flyttes.
      </p>
      <CodeBlock language="cpp">{`// Fleksibel: pin som parameter
void setOutput(int pin, bool on) {
  digitalWrite(pin, on ? HIGH : LOW);
}

// Fast layout: konstant globalt er fint
const int STATUS_LED = 13;

void showOk() {
  setOutput(STATUS_LED, true);
}
`}</CodeBlock>

      <h2>Flere mønstre</h2>
      <h3>Predicate — spørgsmål der returnerer bool</h3>
      <CodeBlock language="cpp">{`bool isButtonPressed(int pin) {
  return digitalRead(pin) == HIGH;
}
`}</CodeBlock>

      <h3>Transform — map sensor til PWM</h3>
      <CodeBlock language="cpp">{`int sensorToPwm(int sensorPin) {
  int raw = analogRead(sensorPin); // 0–1023
  return map(raw, 0, 1023, 0, 255);
}

void loop() {
  analogWrite(9, sensorToPwm(A0));
}
`}</CodeBlock>

      <h3>Early return — hold logikken flad</h3>
      <CodeBlock language="cpp">{`void handleAlarm(float temp, float limit) {
  if (temp < limit) {
    return; // intet at gøre
  }
  digitalWrite(LED_BUILTIN, HIGH);
  Serial.println("ALARM");
}
`}</CodeBlock>

      <Callout type="tip">
        <p>
          Navngiv med verber: <code>readTemperature</code>, <code>blinkLED</code>,{' '}
          <code>isButtonPressed</code>. Hvis du ikke kan finde et klart verbum, er funktionen måske
          for stor.
        </p>
      </Callout>

      <h2>Hvad god struktur giver dig</h2>
      <ul>
        <li>
          <code>loop()</code> bliver en kort orkestrering: læs → beslut → agér
        </li>
        <li>Samme hjælpefunktion bruges flere steder uden copy-paste</li>
        <li>Fejl findes i én navngiven enhed</li>
      </ul>
    </LessonLayout>
  )
}
