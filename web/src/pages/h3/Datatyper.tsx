import Callout from '../../components/Callout'
import CodeBlock from '../../components/CodeBlock'
import LessonLayout from '../../components/LessonLayout'

export default function Datatyper() {
  return (
    <LessonLayout module="h3">
      <h1>Datatyper: bytes, værdier og overraskelser</h1>
      <p>
        En datatype er et løfte om, hvilke værdier du kan repræsentere, og hvilke beregninger
        der bliver udført. På en UNO R3 deler programmet kun 2 KB SRAM mellem blandt andet
        variabler, kald og dynamiske data. Derfor handler typevalg både om korrekthed og om plads.
        Vi vælger først en type, som kan beskrive problemet, og optimerer derefter med målinger.
      </p>
      <Callout type="info">
        <p>
          <strong>Platform betyder noget:</strong> Tabellerne gælder Arduino UNO R3 med
          ATmega328P og den sædvanlige AVR-toolchain. UNO R4, ESP32 og desktop-C++ har andre
          egenskaber. C#-typen <code>int</code> er 32 bit; C++-typen <code>int</code> har ikke
          én universel størrelse. På UNO R3 er den 16 bit, på almindelige desktopplatforme typisk 32 bit.
        </p>
      </Callout>

      <h2>1. Heltal: antal bit giver et begrænset område</h2>
      <p>
        Med 8 bit findes 256 bitmønstre. En unsigned 8-bit type bruger dem til værdierne
        0–255. En signed type kan også indeholde negative værdier. Vælg ikke unsigned alene,
        fordi en værdi normalt er positiv: subtraktion og sammenligning skal også give mening.
      </p>
      <div className="lesson-table-scroll">
        <table className="datatype-table">
          <thead><tr><th>Type på UNO R3</th><th>Bytes</th><th>Værdiområde</th><th>Et meningsfuldt valg</th></tr></thead>
          <tbody>
            <tr><td><code>byte</code> / <code>uint8_t</code></td><td>1</td><td>0 … 255</td><td>En rå byte eller et PWM-niveau</td></tr>
            <tr><td><code>int</code> / <code>int16_t</code></td><td>2</td><td>−32 768 … 32 767</td><td>ADC-aflæsning og små beregninger</td></tr>
            <tr><td><code>unsigned int</code> / <code>uint16_t</code></td><td>2</td><td>0 … 65 535</td><td>En protokols 16-bit felt</td></tr>
            <tr><td><code>long</code> / <code>int32_t</code></td><td>4</td><td>−2 147 483 648 … 2 147 483 647</td><td>Større mellemregninger</td></tr>
            <tr><td><code>unsigned long</code> / <code>uint32_t</code></td><td>4</td><td>0 … 4 294 967 295</td><td>Tidsstempler fra <code>millis()</code></td></tr>
            <tr><td><code>bool</code></td><td>1</td><td><code>false</code> eller <code>true</code></td><td>Tilstande og betingelser</td></tr>
            <tr><td><code>char</code></td><td>1</td><td>Tegn; signedness er platformafhængig</td><td>En byte i en tekstsekvens</td></tr>
          </tbody>
        </table>
      </div>
      <p>
        <code>byte</code> er et Arduino-alias. <code>bool</code> er standard-C++; Arduinos
        <code>boolean</code> er et alias for samme type. Til binære filformater kan præcise
        bredder som <code>uint16_t</code> gøre kontrakten tydelig. På desktop inkluderer du
        <code>&lt;cstdint&gt;</code> og bruger fx <code>std::uint16_t</code>. Typer med præcis
        bredde findes, når implementeringen understøtter dem.
      </p>

      <h2>2. Udtrykkets type vælges før variablen modtager resultatet</h2>
      <CodeBlock language="cpp">{`// UNO R3 / AVR:
float wrong = 5 / 2;       // Heltalsdivision først: værdien bliver 2.0.
float right = 5.0f / 2;    // Flydende beregning: værdien bliver 2.5.

// Forkert strategi på AVR: 1000 * 60 beregnes som 16-bit int.
// long minuteMs = 1000 * 60; // Signed overflow: undefined behavior.

unsigned long minuteMs = 1000UL * 60; // Bred type FØR beregningen.

int raw = 900;
long scaled = static_cast<long>(raw) * 255; // Produktet er 229500.`}</CodeBlock>
      <p>
        En stor modtagervariabel redder ikke en mellemregning, der allerede gik galt.
        Suffikset <code>UL</code> betyder unsigned long, mens <code>f</code> angiver en
        float-literal. <code>static_cast</code> gør en ønsket konvertering synlig. Det beviser
        ikke, at konverteringen er sikker; du skal stadig kende værdiernes område.
      </p>

      <h2>3. Overflow: to forskellige problemer</h2>
      <p>
        Unsigned heltalsaritmetik regner modulo typens antal mulige værdier. For en unsigned
        8-bit værdi giver konverteringen af 256 derfor 0. Signed overflow har derimod
        <em> undefined behavior</em>: C++ lover ikke et bestemt resultat. Brug aldrig en
        observeret negativ værdi som bevis for, at signed overflow er en sikker wrap-mekanisme.
      </p>
      <CodeBlock language="cpp">{`// Udsnit inde i en funktion:
uint8_t brightness = 255;
brightness = static_cast<uint8_t>(brightness + 1); // Ender som 0.

int temperature = -5;
unsigned int limit = 10;
// temperature < limit kan blive falsk på UNO R3:
// Ved sammenligningen konverteres temperature til unsigned int.

int safeLimit = 10; // Begge er signed og kan beskrive problemet.
bool belowLimit = temperature < safeLimit;`}</CodeBlock>
      <p>
        Små heltal kan blive promoveret til <code>int</code> under beregning. Eksemplet med
        brightness viser derfor især indsnævringen tilbage til 8 bit, ikke en garanti om at
        selve plus-operationen udføres i 8 bit. Det er netop derfor, vi følger hele udtrykket.
      </p>

      <h2>4. Tid: vælg returtypen og træk tidsstempler fra hinanden</h2>
      <CodeBlock language="cpp">{`constexpr unsigned long INTERVAL_MS = 1000UL;
unsigned long lastUpdate = 0;

void setup() {
  pinMode(LED_BUILTIN, OUTPUT);
}

void loop() {
  const unsigned long now = millis();
  if (now - lastUpdate >= INTERVAL_MS) {
    lastUpdate = now;
    digitalWrite(LED_BUILTIN, !digitalRead(LED_BUILTIN));
  }
}`}</CodeBlock>
      <p>
        <code>millis()</code> returnerer <code>unsigned long</code>. På UNO R3 ruller tælleren
        rundt efter cirka 49,7 dage. Udtrykket <code>now - lastUpdate</code> bruger unsigned
        aritmetik og håndterer én wrap, når den reelle forløbne tid stadig er mindre end en hel
        tællerperiode. Løkken skal køre ofte nok til at opdage intervallet. Brug ikke
        <code>now &gt;= lastUpdate + interval</code> som generel wrap-løsning.
      </p>
      <Callout type="warn">
        <p>
          En 16-bit <code>int</code> kan ikke repræsentere et millis-tidsstempel over 32 767.
          Allerede efter cirka 32,8 sekunder passer den positive værdi ikke længere. Det er
          <strong>ikke</strong> selve <code>millis()</code>, der ruller rundt så tidligt.
        </p>
      </Callout>

      <h2>5. Float er en tilnærmelse, ikke ekstra målenøjagtighed</h2>
      <div className="lesson-table-scroll">
        <table className="datatype-table">
          <thead><tr><th>Type</th><th>UNO R3</th><th>Typisk desktop</th><th>Husk</th></tr></thead>
          <tbody>
            <tr><td><code>float</code></td><td>4 bytes</td><td>4 bytes</td><td>Omtrent 6–7 betydende decimale cifre på disse platforme</td></tr>
            <tr><td><code>double</code></td><td>4 bytes i standard AVR-opsætningen</td><td>8 bytes</td><td>Giver ikke ekstra præcision på UNO R3</td></tr>
          </tbody>
        </table>
      </div>
      <p>
        Betydende cifre er noget andet end antal decimaler. Et stort tal efterlader mindre plads
        til små detaljer. Desuden kan mange decimaltal, fx 0,1, ikke repræsenteres præcist i
        binær floating point. En temperatur med seks udskrevne decimaler er ikke nødvendigvis
        målt bedre end en temperatur med én decimal.
      </p>
      <CodeBlock language="cpp">{`float measuredCelsius = 23.5f;
constexpr float TARGET_C = 24.0f;
constexpr float TOLERANCE_C = 0.2f;

bool nearTarget = measuredCelsius >= TARGET_C - TOLERANCE_C
               && measuredCelsius <= TARGET_C + TOLERANCE_C;

int wholeDegrees = static_cast<int>(-3.9f); // Afkorter mod nul: -3.`}</CodeBlock>
      <p>
        Vælg en tolerance ud fra problemets krav. Den løser et andet problem end hysterese,
        som bruger forskellige tænd- og slukgrænser for at undgå hurtige skift omkring en tærskel.
      </p>

      <h2>6. Tekst har også et hukommelsesbudget</h2>
      <CodeBlock language="cpp">{`char roomName[16] = "Vaerksted"; // 16 bytes: højst 15 tegn + '\\0'.
const char* statusText = "Ready"; // En pointer, ikke en kopieret tekstbuffer.

// Arduino String kan vokse og bruger dynamisk hukommelse.
String message = "Sensor: ";
// Inde i en funktion: message += 42;

// På AVR kan F() beholde denne konstante tekst i flash:
// Serial.println(F("System ready"));`}</CodeBlock>
      <p>
        Arduinos <code>String</code> er ikke C#-typen <code>string</code> og heller ikke
        standardbibliotekets <code>std::string</code>. Dynamiske tekster kan være praktiske,
        men mange skiftende allokeringer kan være svære at budgettere på 2 KB SRAM. En fast
        buffer gør pladsen forudsigelig; til gengæld skal du selv sikre grænser og nulterminering.
        Danske tegn i UTF-8 kan optage flere bytes pr. tegn.
      </p>

      <h2>7. Initialisér og undersøg din platform</h2>
      <CodeBlock language="cpp">{`int count{};            // Initialiserer til 0.
bool alarmActive{false};
constexpr int SENSOR_PIN = A0;

// int pwm{300.5f}; // Afvises: indsnævrende konvertering med {}.

void setup() {
  Serial.begin(9600);
  Serial.print("int bytes: ");
  Serial.println(sizeof(int));
  Serial.print("double bytes: ");
  Serial.println(sizeof(double));
}

void loop() {}`}</CodeBlock>
      <p>
        Kør sketchen med det board, du faktisk bruger. <code>sizeof</code> oplyser antal C++-bytes,
        som er 8 bit på UNO R3 og almindelige pc'er. Sammenlign med tabellen og notér board og
        toolchain. En uinitialiseret lokal <code>int</code> må du ikke bare læse som et tilfældigt,
        men brugbart tal; initialisering skal være en vane.
      </p>

      <h2>Missioner</h2>
      <h3>Niveau 1 · Pak rygsækken</h3>
      <p>
        Vælg typer til: en alarmtilstand, −20 til 60 °C med decimaler, raw ADC 0–1023,
        et millis-tidsstempel og 100 historiske ADC-målinger. Beregn pladsen til historikken på UNO R3.
      </p>
      <details className="exercise"><summary>Løsningsforslag</summary>
        <p>
          <code>bool</code>, <code>float</code>, <code>int</code> og <code>unsigned long</code>.
          Et array med 100 <code>int</code>-elementer fylder 200 bytes på UNO R3, cirka 9,8 %
          af 2048 bytes. Det er kun arrayets lager, ikke hele programmets RAM-forbrug.
        </p>
      </details>
      <h3>Niveau 2 · Find fejlen før compileren</h3>
      <p>
        Forklar hvorfor <code>float ratio = 3 / 4;</code> og en AVR-mellemregning
        <code>long area = 300 * 300;</code> ikke gør det, man umiddelbart forventer. Ret begge
        ved at vælge type, før beregningen starter.
      </p>
      <details className="exercise"><summary>Hint og løsning</summary>
        <CodeBlock language="cpp">{`float ratio = 3.0f / 4.0f;
long area = 300L * 300;`}</CodeBlock>
        <p>Den første oprindelige beregning giver 0 før konvertering. Den anden har signed overflow på 16-bit int.</p>
      </details>
      <h3>Niveau 3 · Tidsdetektiv</h3>
      <p>
        Brug papir og unsigned 32-bit aritmetik: last er 4 294 967 000, og now er 704 efter
        wrap. Hvor lang tid er der gået? Skriv derefter en funktion, som tager now, last og interval
        som input, så beregningen kan afprøves uden at vente 49 dage.
      </p>
      <details className="exercise"><summary>Kontrol og løsningsforslag</summary>
        <p>Den forløbne tid er 1000 ms: 296 ms til wrap og 704 ms derefter.</p>
        <CodeBlock language="cpp">{`bool elapsed(unsigned long now, unsigned long last,
             unsigned long interval) {
  return now - last >= interval;
}`}</CodeBlock>
        <p>Dokumentér, at den reelle forløbne tid ikke må være en hel tællerperiode eller mere.</p>
      </details>

      <h2>Selvtest og refleksion</h2>
      <ol>
        <li>Hvorfor kan samme C++-kode opføre sig forskelligt på UNO R3 og din pc?</li>
        <li>Hvad sker der før assignment i et regneudtryk?</li>
        <li>Hvilken forskel er der på overflow i unsigned og signed aritmetik?</li>
        <li>Kan flere udskrevne decimaler gøre en sensor mere præcis?</li>
      </ol>
      <p><strong>Exit ticket:</strong> Peg på én type i dit eget projekt og forsvar den med værdiområde, enhed og hukommelsesforbrug.</p>
      <h2>Kilder og videre læsning</h2>
      <ul>
        <li><a href="https://docs.arduino.cc/hardware/uno-rev3" target="_blank" rel="noreferrer">Arduino UNO R3: board og ressourcer</a></li>
        <li><a href="https://docs.arduino.cc/language-reference/en/variables/data-types/int/" target="_blank" rel="noreferrer">Arduino: int</a> · <a href="https://docs.arduino.cc/language-reference/en/variables/data-types/double/" target="_blank" rel="noreferrer">double</a> · <a href="https://docs.arduino.cc/language-reference/en/variables/data-types/float/" target="_blank" rel="noreferrer">float</a></li>
        <li><a href="https://docs.arduino.cc/language-reference/en/functions/time/millis/" target="_blank" rel="noreferrer">Arduino: millis()</a></li>
        <li><a href="https://eel.is/c++draft/basic.fundamental" target="_blank" rel="noreferrer">C++ standardudkast: grundlæggende typer og unsigned aritmetik</a></li>
        <li><a href="https://eel.is/c++draft/expr.mul" target="_blank" rel="noreferrer">C++ standardudkast: division</a> · <a href="https://eel.is/c++draft/conv.integral" target="_blank" rel="noreferrer">heltalskonvertering</a></li>
      </ul>
    </LessonLayout>
  )
}
