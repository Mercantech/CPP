import Callout from '../../components/Callout'
import CodeBlock from '../../components/CodeBlock'
import FileProjectExplorer from '../../components/FileProjectExplorer'
import LessonLayout from '../../components/LessonLayout'

const weatherProject = [
  {
    name: 'WeatherStation.ino',
    language: 'cpp',
    role: 'Sketch: initialisering og koordinering. Ligger i mappen WeatherStation.',
    code: `#include "sensor.h"

void setup() {
  Serial.begin(9600);
}

void loop() {
  Serial.println(readTemperatureCelsius());
  delay(1000);
}
`,
  },
  {
    name: 'sensor.h',
    language: 'cpp',
    role: 'Offentlig kontrakt: almindelige C++-deklarationer uden hardwaredetaljer.',
    code: `#ifndef WEATHER_STATION_SENSOR_H
#define WEATHER_STATION_SENSOR_H

// TMP36; raw: 0..1023; referenceVolts: faktisk ADC-reference.
float tmp36Celsius(int raw, float referenceVolts);
float readTemperatureCelsius();

#endif
`,
  },
  {
    name: 'sensor.cpp',
    language: 'cpp',
    role: 'Definitioner og private hardwarevalg. 5 V reference er en dokumenteret antagelse.',
    code: `#include "sensor.h"
#include <Arduino.h>

namespace {
  constexpr int TEMP_PIN = A0;
  constexpr float REFERENCE_V = 5.0f;
}

float tmp36Celsius(int raw, float referenceVolts) {
  const float voltage = raw * (referenceVolts / 1024.0f);
  return (voltage - 0.5f) * 100.0f;
}

float readTemperatureCelsius() {
  return tmp36Celsius(analogRead(TEMP_PIN), REFERENCE_V);
}
`,
  },
]

export default function Filer() {
  return (
    <LessonLayout module="h3">
      <h1>Fra sketch til C++-projekt: .h, .cpp og linker</h1>
      <p>
        Når du opdeler et projekt, designer du grænser mellem ansvarsområder. Headeren beskriver,
        hvad andre må kalde. Implementationen bestemmer, hvordan det virker. Sketchens
        <code>loop()</code> koordinerer. Det giver dig mulighed for at ændre en sensor uden
        samtidig at omskrive resten af programmet.
      </p>
      <Callout type="info">
        <p>
          <strong>Bro fra C#:</strong> C++-compileren læser ikke automatisk alle projektets
          deklarationer samlet. Hver <code>.cpp</code> oversættes med de deklarationer, den
          selv inkluderer. Derefter samler linkeren den oversatte kode. En header er hverken en
          C#-interface-type eller en selvstændig færdig programdel.
        </p>
      </Callout>

      <h2>1. Udforsk en komplet lille filopdeling</h2>
      <p>
        Opret mappen <code>WeatherStation</code> med de tre filer nedenfor. Hovedsketchens navn
        matcher mappen. Eksemplet forudsætter UNO R3, TMP36 på A0, fælles GND og en antaget
        standardreference på 5,0 V. Omregningen bruger 1024 ADC-trin; mål reference og kontrollér
        sensorens benrækkefølge, når du bygger kredsløbet.
      </p>
      <FileProjectExplorer files={weatherProject} title="WeatherStation / tre filer, ét program" />
      <p>
        Læg mærke til, at <code>sensor.h</code> ikke kender <code>A0</code> eller
        <code>analogRead</code>. Hardwaredetaljerne findes kun i <code>sensor.cpp</code>.
        Dermed er kontrakten lille. Beregningsfunktionen kan senere flyttes til et selvstændigt
        modul, hvis den skal testes på desktop uden Arduino.
      </p>

      <h2>2. Deklaration og definition er to forskellige løfter</h2>
      <CodeBlock language="cpp">{`// Deklaration: lover at funktionen findes med disse typer.
float tmp36Celsius(int raw, float referenceVolts);

// Definition: leverer selve funktionen.
float tmp36Celsius(int raw, float referenceVolts) {
  const float volts = raw * (referenceVolts / 1024.0f);
  return (volts - 0.5f) * 100.0f;
}`}</CodeBlock>
      <p>
        Et semikolon afslutter deklarationen. En krop med krøllede parenteser gør den til en
        definition. Kalderen skal kende deklarationen; linkeren skal kunne finde en passende
        definition. Hvis du ændrer parametertypen i kun én fil, kan du ende med at love én
        funktion og definere en anden.
      </p>

      <h2>3. Include er tekstuel indsættelse</h2>
      <div className="include-flow" aria-label="Fra kildefiler til færdigt program">
        <span className="include-flow__chip include-flow__chip--active">.cpp + headers</span>
        <span aria-hidden="true">→</span><span className="include-flow__chip">oversættelsesenhed</span>
        <span aria-hidden="true">→</span><span className="include-flow__chip">objektfil</span>
        <span aria-hidden="true">→</span><span className="include-flow__chip">linker</span>
      </div>
      <p>
        Preprocessoren indsætter indholdet af <code>#include "sensor.h"</code>. Efter
        preprocessing udgør en kildefil med inkluderet indhold en oversættelsesenhed, også kaldet
        en translation unit. <code>sensor.cpp</code> bliver sin egen oversættelsesenhed;
        sketchens genererede <code>.cpp</code> bliver en anden. De oversættes hver for sig.
      </p>
      <p>
        Anførselstegn bruges normalt til egne headers og vinkelparenteser til installerede
        biblioteker eller systemheaders. De konkrete søgestier bestemmes af værktøj og buildopsætning.
        Inkludér de headers, som filen selv har brug for. At en anden header tilfældigvis
        inkluderer Arduino, er en skrøbelig afhængighed.
      </p>

      <h2>4. Include guards beskytter én oversættelsesenhed</h2>
      <CodeBlock language="cpp">{`#ifndef WEATHER_STATION_SENSOR_H
#define WEATHER_STATION_SENSOR_H

float readTemperatureCelsius();

#endif`}</CodeBlock>
      <p>
        Første gang headeren læses, defineres makroen, og indholdet medtages. Ved næste include
        af samme header i <em>samme preprocessing</em> springes indholdet over. Når en anden
        <code>.cpp</code> oversættes, starter dens preprocessing forfra.
      </p>
      <Callout type="danger">
        <p>
          Include guards løser <strong>ikke</strong> flere almindelige funktionsdefinitioner
          på tværs af oversættelsesenheder. Skriver du <code>void beep() {'{}'}</code> i en
          header og inkluderer den fra to <code>.cpp</code>-filer, hjælper guarden ikke mod
          brud på One Definition Rule. Læg den almindelige definition i én <code>.cpp</code>.
        </p>
      </Callout>
      <p>
        Der findes vigtige undtagelser: fx kan korrekt definerede <code>inline</code>-funktioner
        og templates have definitioner i headers under deres respektive ODR-betingelser.
        <code>inline</code> betyder ikke, at compileren er tvunget til at indsætte kroppen ved
        hvert kald. Til de første moduler er deklaration i header og én definition i cpp den klare model.
      </p>

      <h2>5. Delt variabel: deklarér ét sted, definér ét sted</h2>
      <CodeBlock language="cpp">{`// status.h — erklærer et objekt, der defineres andetsteds.
#ifndef WEATHER_STATION_STATUS_H
#define WEATHER_STATION_STATUS_H
extern unsigned long sampleCount;
#endif

// status.cpp — én definition i hele programmet.
// #include "status.h"
// unsigned long sampleCount = 0;`}</CodeBlock>
      <p>
        <code>extern</code>-deklarationen opretter ikke i sig selv den delte variabel.
        Den rigtige definition skal ligge i én kildefil. Men spørg først, om variablen overhovedet
        skal være offentlig. En funktion som <code>getSampleCount()</code> og en intern tæller
        kan beskytte modulets regler bedre end fri adgang til at skrive værdien.
      </p>

      <h2>6. Hvad gør Arduino-værktøjet ekstra?</h2>
      <ol>
        <li><strong>Preprocessing:</strong> Sketchens ino-filer samles, Arduino-header tilføjes om nødvendigt, og funktionsprototyper genereres i mange tilfælde.</li>
        <li><strong>Compilation:</strong> Den genererede kildefil og projektets cpp-filer oversættes separat sammen med de nødvendige biblioteker.</li>
        <li><strong>Link:</strong> Referencer mellem funktioner og objekter forbindes i det færdige program.</li>
        <li><strong>Upload:</strong> Det byggede program overføres til boardet. En uploadfejl er ikke nødvendigvis en C++-fejl.</li>
      </ol>
      <p>
        Almindelige <code>.cpp</code>-filer får ikke ino-forbehandlingen. Derfor inkluderer
        <code>sensor.cpp</code> selv <code>&lt;Arduino.h&gt;</code>. Headers i sketchmappen
        bliver heller ikke automatisk inkluderet i din sketch. <code>#include</code> er din
        eksplicitte forbindelse. Inkludér normalt aldrig en <code>.cpp</code>-fil.
      </p>

      <h2>7. Fejldetektiv: hvilket trin fejlede?</h2>
      <div className="lesson-table-scroll"><table>
        <thead><tr><th>Symptom, typisk formulering</th><th>Hvor leder du?</th><th>Undersøg først</th></tr></thead>
        <tbody>
          <tr><td>“not declared”</td><td>Compilation</td><td>Er den nødvendige deklaration synlig før kaldet?</td></tr>
          <tr><td>“undefined reference”</td><td>Link</td><td>Findes definitionen, bygges filen med, og passer signaturen?</td></tr>
          <tr><td>“multiple definition”</td><td>Link</td><td>Er en almindelig definition kopieret til flere enheder?</td></tr>
          <tr><td>“redefinition” i samme enhed</td><td>Compilation</td><td>Mangler guarden, eller findes definitionen to gange?</td></tr>
          <tr><td>Port eller board kan ikke kontaktes</td><td>Upload</td><td>Boardvalg, port, kabel og anden software på porten</td></tr>
        </tbody>
      </table></div>
      <p>
        Formuleringerne er kategorier, ikke log fra et faktisk build. Læs den første relevante
        fejl og dens fil/linje. Ti efterfølgende fejl kan være følgefejl fra én manglende deklaration.
        Cirkulære includes løses ved at reducere afhængigheder, fx flytte fælles typer til en tredje
        header eller bruge forward declarations, når en fuld type ikke behøves.
      </p>

      <h2>Missioner</h2>
      <h3>Niveau 1 · Find hjemmet til hver linje</h3>
      <p>
        Placér en funktionsprototype, en intern pin-konstant, setup og en sensorfunktions krop
        i de tre filer. Forklar din placering til en makker før du bygger projektet.
      </p>
      <details className="exercise"><summary>Løsningsforslag</summary>
        <p>Den offentlige prototype bor i headeren. Den interne pin og kroppen bor i sensor.cpp. setup bor i hovedsketchen.</p>
      </details>
      <h3>Niveau 2 · Byg et lysmodul</h3>
      <p>
        Tilføj light.h og light.cpp med <code>int readLightLevel()</code>. A1 skal være en
        intern detalje. Hovedsketchen må kende funktionens navn, men skal ikke behøve at kende pinnen.
      </p>
      <details className="exercise"><summary>Hint og løsningsforslag</summary>
        <CodeBlock language="cpp">{`// light.h
#ifndef WEATHER_STATION_LIGHT_H
#define WEATHER_STATION_LIGHT_H
int readLightLevel();
#endif

// light.cpp (læg nedenstående i den separate fil)
// #include "light.h"
// #include <Arduino.h>
// namespace { constexpr int LIGHT_PIN = A1; }
// int readLightLevel() { return analogRead(LIGHT_PIN); }`}</CodeBlock>
        <p>Inkludér light.h i sketchen, og læs resultatet dér. Headers skal kunne inkluderes uden en bestemt rækkefølge.</p>
      </details>
      <h3>Niveau 3 · Fremprovokér tre forskellige fejl</h3>
      <p>
        Arbejd i en kopi: fjern header-include, fjern derefter en definition, og flyt til sidst
        en almindelig definition til en header, som to kildefiler inkluderer. Ret mellem hvert
        forsøg. Notér den faktiske fejl, build-trinnet og din forklaring.
      </p>
      <details className="exercise"><summary>Hvad skal din undersøgelse vise?</summary>
        <p>
          Du skal skelne en ukendt deklaration fra en manglende definition og fra flere definitioner.
          De præcise beskeder varierer med toolchain. Include guards bør være til stede i sidste
          forsøg, så du demonstrerer, at de ikke løser ODR på tværs af enheder.
        </p>
      </details>

      <h2>Selvtest og refleksion</h2>
      <ol>
        <li>Hvorfor er en header ikke det samme som en objektfil?</li>
        <li>Hvorfor kan en funktion være kendt af compileren og stadig mangle ved link?</li>
        <li>Hvad beskytter en include guard, og hvad beskytter den ikke?</li>
        <li>Hvilken del af dit modul kan du ændre uden at ændre dets offentlige kontrakt?</li>
      </ol>
      <h2>Kilder og videre læsning</h2>
      <ul>
        <li><a href="https://docs.arduino.cc/arduino-cli/sketch-build-process/" target="_blank" rel="noreferrer">Arduino: Sketch build process</a></li>
        <li><a href="https://docs.arduino.cc/arduino-cli/sketch-specification/" target="_blank" rel="noreferrer">Arduino: Sketch specification og filnavne</a></li>
        <li><a href="https://eel.is/c++draft/basic.def.odr" target="_blank" rel="noreferrer">C++ standardudkast: One Definition Rule</a></li>
        <li><a href="https://www.analog.com/media/en/technical-documentation/data-sheets/TMP35_36_37.pdf" target="_blank" rel="noreferrer">Analog Devices: TMP36-datablad og overføringsfunktion</a></li>
      </ul>
    </LessonLayout>
  )
}
