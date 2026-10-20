import Callout from '../../components/Callout'
import CodeBlock from '../../components/CodeBlock'
import LessonIntro from '../../components/LessonIntro'
import LessonLayout from '../../components/LessonLayout'

export default function Datatyper() {
  return (
    <LessonLayout module="h3">
      <h1>Datatyper i Arduino C++</h1>
      <LessonIntro>
        <p>
          Typen fortæller både <em>hvad</em> værdien betyder, og <em>hvor meget hukommelse</em> den
          fylder. På Uno (2 KB SRAM) er det ikke akademisk — det er praktisk.
        </p>
      </LessonIntro>

      <h2>Heltal</h2>
      <p>
        Bemærk: størrelser nedenfor gælder typisk <strong>AVR / Uno</strong>. På 32-bit boards (fx
        nogle SAMD/ESP) er <code>int</code> ofte 4 bytes.
      </p>
      <table className="datatype-table">
        <thead>
          <tr>
            <th>Type</th>
            <th>Bytes</th>
            <th>Range (typisk Uno)</th>
            <th>Brug til</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <code>byte</code>
            </td>
            <td>1</td>
            <td>0 … 255</td>
            <td>PWM, små tællere</td>
          </tr>
          <tr>
            <td>
              <code>int</code>
            </td>
            <td>2</td>
            <td>−32 768 … 32 767</td>
            <td>Standard heltal, analogRead</td>
          </tr>
          <tr>
            <td>
              <code>unsigned int</code>
            </td>
            <td>2</td>
            <td>0 … 65 535</td>
            <td>Kun positive, større range</td>
          </tr>
          <tr>
            <td>
              <code>long</code>
            </td>
            <td>4</td>
            <td>±2 mia.</td>
            <td>Store heltal</td>
          </tr>
          <tr>
            <td>
              <code>unsigned long</code>
            </td>
            <td>4</td>
            <td>0 … ~4 mia.</td>
            <td>
              <code>millis()</code>, tidsstempler
            </td>
          </tr>
        </tbody>
      </table>

      <h2>Decimaltal, bool og tekst</h2>
      <table className="datatype-table">
        <thead>
          <tr>
            <th>Type</th>
            <th>Bytes</th>
            <th>Note</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <code>float</code>
            </td>
            <td>4</td>
            <td>~6–7 betydende cifre — fint til temperatur</td>
          </tr>
          <tr>
            <td>
              <code>double</code>
            </td>
            <td>4 (Uno)</td>
            <td>Ofte samme som float på AVR</td>
          </tr>
          <tr>
            <td>
              <code>bool</code> / <code>boolean</code>
            </td>
            <td>1</td>
            <td>
              <code>true</code> / <code>false</code>
            </td>
          </tr>
          <tr>
            <td>
              <code>char</code>
            </td>
            <td>1</td>
            <td>Ét tegn; til tekstbuffere brug arrays / <code>String</code> forsigtigt</td>
          </tr>
          <tr>
            <td>
              <code>String</code>
            </td>
            <td>variabel</td>
            <td>Praktisk, men kan fragmentere heap — undgå i stramme loops</td>
          </tr>
        </tbody>
      </table>

      <h2>Overflow — den stille fejl</h2>
      <p>
        Når et heltal går uden for sit range, “folder” det rundt. Det giver rare bugs uden
        compiler-fejl.
      </p>
      <CodeBlock language="cpp">{`int x = 30000;
x = x + 10000;  // overflow på Uno (int max 32767) → negativt eller forkert tal
`}</CodeBlock>
      <Callout type="danger">
        <p>
          Gem aldrig <code>millis()</code> i <code>int</code>. Efter ~32 sekunder overløber den.
          Brug <code>unsigned long</code> — og sammenlign med subtraktion (
          <code>millis() - last</code>), som håndterer wrap-around korrekt.
        </p>
      </Callout>

      <h2>const og literals</h2>
      <CodeBlock language="cpp">{`const int LED_PIN = 13;           // må ikke ændres
const float VREF = 5.0;           // float-literal med .0
const unsigned long INTERVAL = 1000UL;  // UL = unsigned long
`}</CodeBlock>

      <h2>Eksempel: blandede typer i praksis</h2>
      <CodeBlock language="cpp">{`const int LED_PIN = 13;
const int SENSOR_PIN = A0;

unsigned long lastUpdate = 0;
bool ledState = false;
float temperature = 23.5;
byte brightness = 128;

void loop() {
  if (millis() - lastUpdate >= 1000UL) {
    lastUpdate = millis();
    int raw = analogRead(SENSOR_PIN);
    temperature = raw * (5.0 / 1023.0);
    brightness = (byte)map(raw, 0, 1023, 0, 255);
  }
}
`}</CodeBlock>

      <h2>I H3-templaten: SensorReading</h2>
      <p>
        Flere floats samles i én struct i <code>types.h</code> — så sensor- og display-moduler deler
        samme datamodel uden løse globale variabler:
      </p>
      <CodeBlock language="cpp">{`struct SensorReading {
  float temperatureCelsius;
  float humidityPercent;
  float pressureKPa;
};
`}</CodeBlock>
      <Callout type="tip">
        <p>
          Navnene er engelske og enhederne sidder i identifikatoren (
          <code>temperatureCelsius</code>) — præcis template-stilen.
        </p>
      </Callout>

      <h2>Vælg bevidst</h2>
      <ul>
        <li>
          Temperatur / fugt / tryk → <code>float</code> (som i <code>SensorReading</code>)
        </li>
        <li>
          Flags som shake-mode → <code>bool</code>
        </li>
        <li>
          Tid (<code>lastDisplayUpdateMs</code>) → <code>unsigned long</code>
        </li>
        <li>
          Config-tal → <code>#define</code> / konstant i <code>config.h</code>
        </li>
        <li>
          RGB-kanaler i <code>temperatureToRgb</code> → <code>int</code> (0–255)
        </li>
      </ul>
    </LessonLayout>
  )
}
