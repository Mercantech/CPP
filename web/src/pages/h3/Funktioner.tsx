import Callout from '../../components/Callout'
import CodeBlock from '../../components/CodeBlock'
import LessonIntro from '../../components/LessonIntro'
import LessonLayout from '../../components/LessonLayout'
import { TEMPLATE_REPO_URL } from '../../data/projects'

export default function Funktioner() {
  return (
    <LessonLayout module="h3">
      <h1>Funktioner — modulets offentlige API</h1>
      <LessonIntro>
        <p>
          I{' '}
          <a href={TEMPLATE_REPO_URL} target="_blank" rel="noreferrer">
            H3-templaten
          </a>{' '}
          er hver <code>.h</code> et lille API: <code>readEnvironmentSensors</code>,{' '}
          <code>renderSensorScreen</code>, <code>temperatureToRgb</code>. Funktioner er det, der gør
          modulopdeling mulig.
        </p>
      </LessonIntro>

      <h2>Anatomi</h2>
      <CodeBlock language="cpp">{`returnType functionName(parameterType parameterName) {
  // arbejde
  return value; // hvis ikke void
}
`}</CodeBlock>

      <h2>Eksempel fra templaten: sensor-API</h2>
      <p>
        Headeren deklarerer kontrakten. <code>main.cpp</code> kalder den — uden at kende
        carrier-detaljerne.
      </p>
      <CodeBlock language="cpp">{`// environment_sensors.h
SensorReading readEnvironmentSensors(MKRIoTCarrier& carrier);

// main.cpp (wiring)
const SensorReading reading = readEnvironmentSensors(carrier);
`}</CodeBlock>
      <CodeBlock language="cpp">{`// environment_sensors.cpp
SensorReading readEnvironmentSensors(MKRIoTCarrier& carrier) {
  SensorReading reading;
  reading.temperatureCelsius = carrier.Env.readTemperature();
  reading.humidityPercent = carrier.Env.readHumidity();
  reading.pressureKPa = carrier.Pressure.readPressure();
  return reading;
}
`}</CodeBlock>

      <h2>void vs return</h2>
      <ul>
        <li>
          <code>void renderStartupScreen(...)</code> — sideeffekt (tegn på skærm)
        </li>
        <li>
          <code>SensorReading readEnvironmentSensors(...)</code> — returnér data til kalderen
        </li>
        <li>
          <code>void temperatureToRgb(..., int& red, int& green, int& blue)</code> — out-parametre
          via referencer
        </li>
      </ul>
      <CodeBlock language="cpp">{`void temperatureToRgb(float temperatureCelsius, int& red, int& green, int& blue) {
  if (temperatureCelsius < 15.0f) {
    red = 0;
    green = 50;
    blue = 255;
  } else if (temperatureCelsius < 22.0f) {
    // … blend …
  } else {
    red = 255;
    // …
  }
}
`}</CodeBlock>
      <Callout type="tip">
        <p>
          <code>temperatureToRgb</code> er bevidst uden Arduino-includes — derfor kan den unit-testes
          på PC. Hold I/O ude af ren logik, når I kan.
        </p>
      </Callout>

      <h2>Parametre gør genbrug muligt</h2>
      <p>
        Carrier sendes ind som <code>MKRIoTCarrier&</code> — funktionen ejer ikke hardwaren globalt.
        Samme mønster: giv det, funktionen skal bruge, i stedet for skjulte globale objekter.
      </p>

      <h2>Hold loop() som orkester</h2>
      <CodeBlock language="cpp">{`void loop() {
  carrier.Buttons.update();
  const SensorReading reading = readEnvironmentSensors(carrier);
  pollGestureLabel(carrier, lastGestureLabel, sizeof(lastGestureLabel));
  renderButtonLeds(carrier);
  // … tidsstyret renderSensorScreen …
}
`}</CodeBlock>
      <Callout type="warn">
        <p>
          Hvis I kopierer sensor-udregninger ind i <code>loop()</code>, mister I templaten’s pointe.
          Udtræk en funktion (og gerne et modul).
        </p>
      </Callout>
    </LessonLayout>
  )
}
