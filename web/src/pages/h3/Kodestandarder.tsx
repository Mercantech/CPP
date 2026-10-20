import Callout from '../../components/Callout'
import CodeBlock from '../../components/CodeBlock'
import LessonLayout from '../../components/LessonLayout'

export default function Kodestandarder() {
  return (
    <LessonLayout module="h3">
      <h1>Kodestandarder: kode din makker tør ændre</h1>
      <p>
        Kode bliver læst mange gange, før den bliver skrevet om. En fælles standard gør det
        lettere at opdage fejl, gennemgå ændringer og hjælpe hinanden. Målet er ikke at vinde
        en diskussion om parenteser, men at gøre hensigt, enheder, ansvar og overraskelser synlige.
      </p>
      <Callout type="info">
        <p>
          C++ bestemmer syntaks og betydning. Et team bestemmer navnestil og formatering.
          Her bruger vi camelCase til funktioner og variabler, PascalCase til egne typer og
          UPPER_SNAKE_CASE til faste konstanter. Andre C++-projekter vælger andre konventioner.
          Brug den lokale stil konsekvent frem for at blande C#-, Arduino- og biblioteksstil.
        </p>
      </Callout>

      <h2>1. Et navn skal spare læseren for detektivarbejde</h2>
      <div className="lesson-table-scroll"><table>
        <thead><tr><th>Uklart</th><th>Tydeligere</th><th>Hvorfor?</th></tr></thead>
        <tbody>
          <tr><td><code>x</code></td><td><code>rawAdc</code></td><td>Fortæller at værdien endnu ikke er en spænding</td></tr>
          <tr><td><code>temp</code></td><td><code>temperatureCelsius</code></td><td>Enheden er synlig</td></tr>
          <tr><td><code>time</code></td><td><code>lastSampleMs</code></td><td>Tidsstempel og millisekunder fremgår</td></tr>
          <tr><td><code>handle()</code></td><td><code>updateFanLed()</code></td><td>Navnet angiver handlingens genstand</td></tr>
          <tr><td><code>flag</code></td><td><code>alarmActive</code></td><td>En boolsk tilstand kan læses i en betingelse</td></tr>
        </tbody>
      </table></div>
      <p>
        Korte navne er fine i små, velkendte sammenhænge, fx <code>i</code> i en trelinjers
        løkke. Problemet er ikke navnets længde, men hvor meget læseren skal huske. Et navn som
        <code>DEBOUNCE_MS</code> må kun bruges, hvis værdien faktisk indgår i debounce. Et
        almindeligt samplinginterval skal hedde noget andet.
      </p>

      <h2>2. Konstanter gør reglerne synlige</h2>
      <CodeBlock language="cpp">{`constexpr int SENSOR_PIN = A0;
constexpr int FAN_LED_PIN = 13;
constexpr float FAN_ON_C = 30.0f;
constexpr unsigned long SAMPLE_INTERVAL_MS = 500UL;

// Udsnit inde i en funktion:
const int rawAdc = analogRead(SENSOR_PIN); // Fast i dette kald.
// rawAdc = 100; // Afvises: objektet er const.`}</CodeBlock>
      <p>
        <code>constexpr</code> kræver en værdi, der kan bruges som konstant udtryk.
        <code>const</code> forhindrer ændring gennem dette navn og kan også bruges om en værdi,
        som først bliver kendt under kørsel. Begge hjælper med at skelne konfiguration fra
        tilstand. Vælg typede konstanter frem for en makro til almindelige værdier; makroer
        har deres plads, fx i include guards, men følger ikke de samme typeregler som variabler.
      </p>

      <h2>3. Kommentarer skal forklare en beslutning</h2>
      <CodeBlock language="cpp">{`// Svag kommentar: gentager blot instruktionen.
// Sæt LED høj.
digitalWrite(LED_BUILTIN, HIGH);

// Nyttig kommentar: dokumenterer hardwarekontrakten.
// Knap mellem pin og GND; intern pullup giver LOW ved tryk.
pinMode(BUTTON_PIN, INPUT_PULLUP);

// Nyttig kommentar: en antagelse, der skal kunne efterprøves.
// Antaget ADC-reference på UNO R3. Mål den ved præcisionsarbejde.
constexpr float ADC_REFERENCE_V = 5.0f;`}</CodeBlock>
      <p>
        En kommentar kan forklare en begrænsning, et hardwarevalg eller et ikke åbenlyst
        kompromis. Den kan ikke reparere forkert kode. Kommentaren “debounce” oven på
        <code>delay(100)</code> beviser hverken, at tilstanden var stabil, eller at kun ét
        tryk-event bliver dannet. Når koden ændres, skal antagelser og kommentarer også gennemgås.
      </p>

      <h2>4. Formatering: gør strukturen ensartet</h2>
      <CodeBlock language="cpp">{`// Vores undervisningskonvention: 2 mellemrum og altid blokke.
if (temperatureCelsius > FAN_ON_C) {
  setFanLed(true);
} else {
  setFanLed(false);
}`}</CodeBlock>
      <p>
        Brug mellemrum omkring operatorer og en tydelig blok til hver gren. Det gør en senere
        ekstra linje mindre risikabel. Automatisk formatering kan vedligeholde stilen, men en
        formatter finder ikke en forkert sensorformel eller manglende strømbegrænsning i kredsløbet.
        I C++-projekter kan <code>clang-format</code> læse teamets <code>.clang-format</code>.
      </p>
      <details className="exercise"><summary>Eksempel på en lille formatterkonfiguration</summary>
        <CodeBlock language="yaml">{`BasedOnStyle: LLVM
IndentWidth: 2
ColumnLimit: 100`}</CodeBlock>
        <p>Gem som .clang-format i dit eget projekt, hvis værktøjet er installeret. Gennemgå diffen efter formatering.</p>
      </details>

      <h2>5. Loop skal give de andre opgaver en tur</h2>
      <p>
        Når du både skal reagere på en knap og måle en sensor, er lange ventetider en del af
        programmets adfærd. En nyttig standard er, at hver opdateringsfunktion udfører lidt
        arbejde og returnerer. Her aflæses et potentiometer løbende, mens status udskrives sjældnere.
      </p>
      <CodeBlock language="cpp">{`// UNO R3: potentiometer til A0, LED via modstand til PWM-pin 9.
constexpr int SENSOR_PIN = A0;
constexpr int LED_PIN = 9;
constexpr unsigned long REPORT_MS = 500UL;
unsigned long lastReportMs = 0;

int adcToPwm(int raw) {
  return static_cast<long>(raw) * 255 / 1023;
}

void setup() {
  Serial.begin(9600);
  pinMode(LED_PIN, OUTPUT);
}

void loop() {
  const unsigned long now = millis();
  const int raw = analogRead(SENSOR_PIN);
  analogWrite(LED_PIN, adcToPwm(raw));

  if (now - lastReportMs >= REPORT_MS) {
    lastReportMs = now;
    Serial.print(F("ADC: "));
    Serial.println(raw);
  }
}`}</CodeBlock>
      <p>
        Det er samarbejdende tidsstyring, ikke parallelle tråde. Vi gemmer kun historik, som
        er nødvendig mellem loop-kald, og holder den aktuelle måling lokal. <code>Serial</code>
        kan stadig vente, hvis dens buffer bliver fuld, og <code>analogRead</code> tager tid.
        Derfor kalder vi ikke løsningen hård realtid. Hvis reaktionstid er et krav, skal den måles.
      </p>

      <h2>6. Korrekt C++ kræver mere end pæn indrykning</h2>
      <p>
        Initialisér objekter, brug <code>bool</code> til logiske værdier, og vælg typer efter
        platform og værdiområde. På UNO R3 skal en stor mellemregning løftes til en bred type,
        før den udføres. Hold ressourcer og ejerskab tydelige; undgå at indføre rå
        <code>new</code>/<code>delete</code> i simple sketches, når faste data og almindelige
        objekter løser opgaven. På desktop er standardcontainere som <code>std::vector</code>
        gode værktøjer, mens små AVR-systemer kræver et konkret hukommelsesbudget.
      </p>
      <Callout type="tip">
        <p>
          En compileradvarsel er et spor. Undersøg typekonverteringer, ubrugte værdier og
          shadowing, før du skjuler advarslen med et cast. Skriv ned, hvorfor en konvertering
          er sikker i netop din kontrakt. En grøn compilation beviser ikke, at kredsløb og krav er korrekte.
        </p>
      </Callout>

      <h2>7. En konkret kodegennemgang</h2>
      <CodeBlock language="cpp">{`// Review-øvelse: et udsnit med flere problemer.
int t; // Er der en gyldig værdi, før den bruges?
// float voltage = analogRead(A0) * (5 / 1023);
// if(t > 30) digitalWrite(13,HIGH);
// delay(1000); // "non-blocking" ville være en forkert kommentar.`}</CodeBlock>
      <p>
        Start med korrekthed: heltalsdivisionen giver nul, og temperaturen er ikke beregnet.
        Derefter kommer forståelighed: manglende enheder, magiske tal og utydelig struktur.
        Til sidst ser du på responstid og krav. Lad ikke en navnediskussion skygge for en
        faktisk forkert beregning. Review-kommentarer skal foreslå en konkret forbedring og forklare hvorfor.
      </p>

      <h2>Missioner</h2>
      <h3>Niveau 1 · Lav teamets lille aftale</h3>
      <p>
        Aftal fem regler for navne, enheder, parenteser, konstanter og kommentarer. Brug dem på
        20 linjer fra dit eget projekt. Find mindst én ændring, der gør en antagelse synlig.
      </p>
      <details className="exercise"><summary>Forslag til en brugbar aftale</summary>
        <p>
          Navne beskriver ansvar. Tider slutter på Ms. Faste værdier er typede konstanter.
          Alle kontrolgrene bruger blokke. Kommentarer dokumenterer hardware og begrundelser.
          En aftale er først nyttig, når I kan vise et konkret eksempel på hver regel.
        </p>
      </details>
      <h3>Niveau 2 · Review med begrundelser</h3>
      <p>
        Giv tre review-kommentarer til fejludsnittet. Hver kommentar skal indeholde en risiko,
        en ændring og en kontrol. Adskil en korrekthedsfejl fra en stilpræference.
      </p>
      <details className="exercise"><summary>Eksempel på en præcis kommentar</summary>
        <p>
          “5 / 1023 udføres som heltalsdivision og bliver 0. Brug en float-reference og den
          valgte ADC-model, og kontrollér omregningen med en kendt råværdi.” Sammenlign med
          “det ser grimt ud”, som hverken forklarer konsekvensen eller hjælper makkeren videre.
        </p>
      </details>
      <h3>Niveau 3 · Budgettér reaktionstiden</h3>
      <p>
        Kravet er, at en indikator skal følge et input inden 50 ms. Find alle operationer i
        dit loop, der kan tage tid. Planlæg en måling, og undersøg hvordan Serial-udskrifter og
        venteløkker påvirker resultatet. Skeln mellem din forudsigelse og faktisk observeret tid.
      </p>
      <details className="exercise"><summary>Hint til undersøgelsen</summary>
        <p>
          Mål fx varigheden af et loop med micros, eller brug en ekstra pin og en logikanalysator.
          Mål gentagne gange under de mest belastende input. En langsom Serial-udskrift af hver
          måling kan selv påvirke målingen; saml eller udskriv resultater bagefter.
        </p>
      </details>

      <h2>Selvtest og refleksion</h2>
      <ol>
        <li>Hvad er forskellen på en sprogregel og en lokal kodestandard?</li>
        <li>Hvilke fejl kan en formatter ikke finde?</li>
        <li>Hvorfor skal en konstant eller variabel helst have enhed i navnet?</li>
        <li>Hvordan kan en kommentar være direkte vildledende?</li>
      </ol>
      <p><strong>Makker-review:</strong> Find én god beslutning i hinandens kode, og forklar præcis, hvilken fejl den hjælper med at undgå.</p>
      <h2>Kilder og videre læsning</h2>
      <ul>
        <li><a href="https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#f-functions" target="_blank" rel="noreferrer">C++ Core Guidelines: funktioner og tydelige kontrakter</a></li>
        <li><a href="https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#es20-always-initialize-an-object" target="_blank" rel="noreferrer">C++ Core Guidelines: initialisering</a></li>
        <li><a href="https://clang.llvm.org/docs/ClangFormat.html" target="_blank" rel="noreferrer">LLVM: clang-format og projektkonfiguration</a></li>
        <li><a href="https://docs.arduino.cc/built-in-examples/digital/BlinkWithoutDelay/" target="_blank" rel="noreferrer">Arduino: Blink Without Delay</a></li>
      </ul>
    </LessonLayout>
  )
}
