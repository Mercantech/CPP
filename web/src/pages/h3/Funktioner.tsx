import Callout from '../../components/Callout'
import CodeBlock from '../../components/CodeBlock'
import LessonLayout from '../../components/LessonLayout'

export default function Funktioner() {
  return (
    <LessonLayout module="h3">
      <h1>Funktioner i Arduino C++</h1>
      <p>
        Funktioner er kodeblokke der udfører en specifik opgave. Du kender allerede{' '}
        <code>setup()</code> og <code>loop()</code> — nu laver du dine egne.
      </p>

      <h2>Syntaks</h2>
      <CodeBlock language="cpp">{`returnType functionName(parameterType parameterName) {
  // Code here
  return value; // if returnType is not void
}
`}</CodeBlock>

      <h2>Simpel funktion uden return</h2>
      <p>
        <code>void</code> betyder “returnerer intet”. Perfekt til sideeffekter som at blinke en LED.
      </p>
      <CodeBlock language="cpp">{`void blinkLED(int pin, int delayTime) {
  digitalWrite(pin, HIGH);
  delay(delayTime);
  digitalWrite(pin, LOW);
  delay(delayTime);
}

void loop() {
  blinkLED(13, 500);  // Blink LED on pin 13 with 500ms interval
}
`}</CodeBlock>

      <h2>Funktion med return-værdi</h2>
      <p>
        Når du beregner noget, returnér resultatet — så kan <code>loop()</code> holde sig tynd.
      </p>
      <CodeBlock language="cpp">{`float readTemperature() {
  int sensorValue = analogRead(A0);
  float voltage = sensorValue * (5.0 / 1023.0);
  float temperature = (voltage - 0.5) * 100.0;
  return temperature;
}

void loop() {
  float temp = readTemperature();
  Serial.println(temp);
  delay(1000);
}
`}</CodeBlock>

      <h2>Flere eksempler</h2>
      <h3>Knap med debounce-hjælp</h3>
      <CodeBlock language="cpp">{`boolean isButtonPressed(int pin) {
  return digitalRead(pin) == HIGH;
}

void waitForRelease(int pin) {
  while (digitalRead(pin) == HIGH) {
    // Wait — brug short delay hvis nødvendigt
    delay(10);
  }
}
`}</CodeBlock>

      <h3>Map sensor til PWM</h3>
      <CodeBlock language="cpp">{`int sensorToPwm(int sensorPin) {
  int raw = analogRead(sensorPin); // 0–1023
  return map(raw, 0, 1023, 0, 255);
}

void loop() {
  analogWrite(9, sensorToPwm(A0));
}
`}</CodeBlock>

      <Callout type="tip">
        <p>
          Giv funktioner <strong>verb-navne</strong>: <code>readTemperature</code>,{' '}
          <code>blinkLED</code>, <code>isButtonPressed</code>. Navnet skal fortælle <em>hvad</em>{' '}
          der sker.
        </p>
      </Callout>

      <h2>Hvorfor det hjælper</h2>
      <ul>
        <li>
          <code>loop()</code> bliver en event-liste i stedet for en spaghetti-blok
        </li>
        <li>Samme blink-logik kan bruges på flere pins</li>
        <li>Fejl sidder i én funktion — nemmere at finde</li>
      </ul>
    </LessonLayout>
  )
}
