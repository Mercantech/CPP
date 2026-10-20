import Callout from '../../components/Callout'
import CodeBlock from '../../components/CodeBlock'
import LessonLayout from '../../components/LessonLayout'

export default function Kodestandarder() {
  return (
    <LessonLayout module="h3">
      <h1>Kodestandarder og best practices</h1>
      <p>
        Professionel kode er ikke kun “det virker” — det er navne, formatering og kommentarer der
        hjælper det næste menneske (ofte dig selv om tre uger).
      </p>

      <h2>Navngivning</h2>
      <ul>
        <li>
          Funktioner: <code>camelCase</code> — <code>readTemperature()</code>,{' '}
          <code>blinkLED()</code>
        </li>
        <li>
          Variabler: <code>camelCase</code> — <code>sensorValue</code>, <code>ledState</code>
        </li>
        <li>
          Konstanter: <code>UPPER_SNAKE_CASE</code> — <code>LED_PIN</code>, <code>MAX_TEMP</code>
        </li>
        <li>
          Beskrivende navne: <code>buttonPin</code> ikke <code>bp</code> eller <code>x</code>
        </li>
      </ul>

      <h2>Indrykning og formatering</h2>
      <ul>
        <li>Brug 2 eller 4 spaces konsekvent</li>
        <li>
          Brug altid krøllede parenteser <code>{'{}'}</code> — også for enkeltlinjer
        </li>
        <li>
          Mellemrum omkring operatorer: <code>a + b</code> ikke <code>a+b</code>
        </li>
      </ul>

      <h2>Kommentarer</h2>
      <CodeBlock language="cpp">{`// Single line comment - explain WHY, not WHAT

/* Multi-line comment
   used for longer descriptions */

// GOOD: Explains why
// Wait 100ms to avoid button bounce
delay(100);

// BAD: Explains what the code does (obvious)
// Set LED to HIGH
digitalWrite(LED_PIN, HIGH);
`}</CodeBlock>

      <h2>Loop-struktur</h2>
      <CodeBlock language="cpp">{`// PREFERRED: loop() as event-loop
void loop() {
  checkButtons();
  updateDisplay();
  readSensors();
  // Let loop() run and return quickly
}

// AVOID: Blocking code in loop()
void loop() {
  while(true) {  // Traps control!
    // This prevents other tasks
  }
  delay(10000);  // Long delays block execution
}
`}</CodeBlock>

      <Callout type="tip">
        <p>
          Til tidsstyring uden lange <code>delay</code>: husk <code>millis()</code> og sammenlign
          tidsstempler (non-blocking).
        </p>
      </Callout>

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
