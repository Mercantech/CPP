import Callout from '../../components/Callout'
import CodeBlock from '../../components/CodeBlock'
import LessonLayout from '../../components/LessonLayout'

export default function Datatyper() {
  return (
    <LessonLayout module="h3">
      <h1>Datatyper i Arduino C++</h1>
      <p>
        At vælge den rigtige datatype er vigtigt for både hukommelse og korrekt funktionalitet —
        især på Uno, hvor RAM er knap.
      </p>

      <h2>Heltal</h2>
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
            <td>Små positive værdier, PWM</td>
          </tr>
          <tr>
            <td>
              <code>int</code>
            </td>
            <td>2</td>
            <td>−32 768 … 32 767</td>
            <td>Standard heltal, pins, tællere</td>
          </tr>
          <tr>
            <td>
              <code>unsigned int</code>
            </td>
            <td>2</td>
            <td>0 … 65 535</td>
            <td>Kun positive værdier</td>
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

      <h2>Decimaltal og øvrige</h2>
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
            <td>~6–7 cifres præcision</td>
          </tr>
          <tr>
            <td>
              <code>double</code>
            </td>
            <td>4 (Uno)</td>
            <td>Samme som float på mange AVR-boards</td>
          </tr>
          <tr>
            <td>
              <code>boolean</code> / <code>bool</code>
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
            <td>Enkelt tegn eller −128…127</td>
          </tr>
          <tr>
            <td>
              <code>String</code>
            </td>
            <td>variabel</td>
            <td>Tekst — brug med omtanke (heap)</td>
          </tr>
        </tbody>
      </table>

      <h2>Eksempel: blandede typer</h2>
      <CodeBlock language="cpp">{`int ledPin = 13;                    // Pin number
unsigned long lastUpdate = 0;       // Timestamp from millis()
boolean ledState = false;           // LED state
float temperature = 23.5;           // Temperature in celsius
byte brightness = 128;              // PWM value (0-255)
const int SENSOR_PIN = A0;          // Constant (never changes)
`}</CodeBlock>

      <Callout type="warn">
        <p>
          Gem aldrig <code>millis()</code> i en <code>int</code> — den overløber efter ca. 32
          sekunder. Brug <code>unsigned long</code>.
        </p>
      </Callout>

      <h2>Vælg bevidst</h2>
      <ul>
        <li>Pin-numre → <code>const int</code> eller <code>byte</code></li>
        <li>Temperatur / spænding → <code>float</code></li>
        <li>Til/fra-tilstand → <code>bool</code></li>
        <li>Tid → <code>unsigned long</code></li>
      </ul>
    </LessonLayout>
  )
}
