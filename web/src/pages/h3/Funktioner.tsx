import Callout from '../../components/Callout'
import CodeBlock from '../../components/CodeBlock'
import LessonLayout from '../../components/LessonLayout'

export default function Funktioner() {
  return (
    <LessonLayout module="h3">
      <h1>Funktioner: giv din kode et sprog</h1>
      <p>
        En god funktion fortæller, hvad programmet gør, uden at læseren skal følge hver eneste
        instruktion. Du kender allerede <code>setup()</code> og <code>loop()</code>. Nu bygger vi
        et ordforråd af små funktioner, der kan måle, beregne og reagere. Målet er at kunne forklare
        både kontrakten, datavejen og konsekvensen af et kald.
      </p>
      <Callout type="info">
        <p>
          <strong>Fra C# til C++:</strong> En fri C++-funktion behøver ikke ligge i en klasse og
          har derfor ikke brug for <code>static</code> som en C#-hjælpemetode. Eksempler med
          <code>analogRead</code>, <code>Serial</code> og pins kræver Arduino. Selve beregningerne
          er almindelig C++ og kan også bruges i et desktopprogram.
        </p>
      </Callout>

      <h2>1. Læs en funktion som en kontrakt</h2>
      <CodeBlock language="cpp">{`float tmp36Celsius(float voltage) {
  return (voltage - 0.5f) * 100.0f;
}

float temperature = tmp36Celsius(0.75f);`}</CodeBlock>
      <p>
        <code>float</code> før navnet er returtypen. <code>voltage</code> er en parameter: det
        lokale navn, funktionen bruger om sit input. <code>0.75f</code> er argumentet i kaldet.
        <code>return</code> afslutter kaldet og giver resultatet tilbage. Her er den matematiske
        værdi 25 °C. Det er et gennemregnet eksempel, ikke en faktisk sensormåling.
      </p>
      <p>
        Kontrakten er vigtigere end syntaksen: input skal være volt fra en <strong>TMP36</strong>,
        og output er grader Celsius. Formlen passer ikke automatisk til en termistor, LM35 eller
        digital sensor. Navnet gør den forudsætning synlig.
      </p>
      <div className="lesson-table-scroll">
        <table>
          <thead><tr><th>Del</th><th>Spørgsmål til dig selv</th></tr></thead>
          <tbody>
            <tr><td>Navn</td><td>Beskriver det én bestemt operation?</td></tr>
            <tr><td>Parametre</td><td>Hvilke data og enheder skal kalderen levere?</td></tr>
            <tr><td>Returværdi</td><td>Hvad får kalderen tilbage, og i hvilken type?</td></tr>
            <tr><td>Sideeffekt</td><td>Skriver funktionen til hardware, Serial eller fælles tilstand?</td></tr>
            <tr><td>Forudsætning</td><td>Hvilke værdier kan den håndtere meningsfuldt?</td></tr>
          </tbody>
        </table>
      </div>

      <h2>2. Funktioner der gør noget, og funktioner der beregner noget</h2>
      <p>
        <code>void</code> betyder, at et kald ikke leverer en værdi. Det passer til en handling
        som at skrive til en LED. En beregningsfunktion returnerer derimod et resultat. Ved at
        adskille dem kan du undersøge matematikken uden at have et board tilsluttet.
      </p>
      <CodeBlock language="cpp">{`// Komplet sketch til UNO R3: LED på PWM-pin 9 via modstand.
constexpr int LED_PIN = 9;
constexpr int SENSOR_PIN = A0;

// Forudsætning: raw er mellem 0 og 1023.
int adcToPwm(int raw) {
  return static_cast<long>(raw) * 255 / 1023;
}

void setBrightness(int pwm) {
  analogWrite(LED_PIN, pwm);
}

void setup() {
  pinMode(LED_PIN, OUTPUT);
}

void loop() {
  const int raw = analogRead(SENSOR_PIN);
  const int pwm = adcToPwm(raw);
  setBrightness(pwm);
}`}</CodeBlock>
      <p>
        Følg dataene: spænding → ADC-tal → PWM-tal → lysstyrke.
        <code>adcToPwm(0)</code> giver 0, og <code>adcToPwm(1023)</code> giver 255. Mellemværdier
        afkortes ved heltalsdivision. Konverteringen til <code>long</code> sker <em>før</em>
        multiplikationen, fordi produktet ellers kan overskride en 16-bit <code>int</code> på UNO R3.
        PWM er pulser med varierende duty cycle, ikke en ægte analog udgangsspænding.
      </p>

      <h2>3. Parameteren er normalt en kopi</h2>
      <CodeBlock language="cpp">{`void increaseCopy(int value) {
  value += 1; // Ændrer kun den lokale kopi.
}

int increased(int value) {
  return value + 1;
}

// Inde i en funktion:
// int counter = 4;
// increaseCopy(counter);        // counter er stadig 4.
// counter = increased(counter); // counter bliver 5.`}</CodeBlock>
      <p>
        Værdiparametre minder om C#-parametre af simple værdityper. For små tal er kopiering
        normalt det klare valg. C++ har også referenceparametre, skrevet <code>int&amp;</code>,
        der kan ændre kalderens objekt. Brug dem bevidst: en skjult ændring af input gør et kald
        sværere at forstå. Når formålet er en beregning, er en returværdi ofte tydeligst.
      </p>
      <details className="exercise">
        <summary>Fordybelse: en reference kan ændre originalen</summary>
        <CodeBlock language="cpp">{`void resetCounter(int& counter) {
  counter = 0;
}

// int presses = 12;
// resetCounter(presses); // presses bliver 0.`}</CodeBlock>
        <p>
          <code>counter</code> er et andet navn for kalderens objekt. Et referencekald har ikke
          C#-nøgleordet <code>ref</code> på kaldestedet. Derfor er navn og dokumentation ekstra
          vigtige. Senere bruger vi <code>const T&amp;</code> til at læse større objekter uden
          at kopiere dem og uden at ændre dem gennem referencen.
        </p>
      </details>

      <h2>4. Fra sensor til temperatur — med synlige forudsætninger</h2>
      <CodeBlock language="cpp">{`// UNO R3, TMP36 på A0, fælles GND, standard ADC-reference.
// 5.0 V er en antagelse: mål referencen ved præcisionsarbejde.
constexpr float ADC_REFERENCE_V = 5.0f;

float adcToVoltage(int raw, float referenceVolts) {
  return raw * (referenceVolts / 1024.0f);
}

float tmp36Celsius(float voltage) {
  return (voltage - 0.5f) * 100.0f;
}

float readTemperatureCelsius() {
  const int raw = analogRead(A0);
  return tmp36Celsius(adcToVoltage(raw, ADC_REFERENCE_V));
}

void setup() {
  Serial.begin(9600);
}

void loop() {
  Serial.println(readTemperatureCelsius());
  delay(1000); // Bevidst enkelt, blokerende eksempel.
}`}</CodeBlock>
      <p>
        UNO R3 har 1024 ADC-trin med koder fra 0 til 1023. Division med 1024 bruger trinbredden
        som spændingsestimat. Du møder også division med 1023, når en model skalerer yderpunkterne
        0 og 1023 til præcis 0 og referenceværdien. Det er to forskellige tilnærmelser; ingen af
        dem fjerner sensorens tolerancer, ADC-usikkerhed eller en upræcis reference. TMP36 har
        nominelt 500 mV offset og 10 mV pr. °C. Kontrollér benrækkefølgen i databladet før opkobling.
      </p>

      <h2>5. Et knaptryk er ikke automatisk et enkelt event</h2>
      <CodeBlock language="cpp">{`constexpr int BUTTON_PIN = 2;

bool isButtonPressed() {
  return digitalRead(BUTTON_PIN) == LOW;
}

void setup() {
  pinMode(BUTTON_PIN, INPUT_PULLUP);
  // Knap forbindes mellem pin 2 og GND.
}

void loop() {
  // isButtonPressed() fortæller kun den aktuelle aflæsning.
}`}</CodeBlock>
      <Callout type="warn">
        <p>
          Med <code>INPUT_PULLUP</code> betyder LOW trykket. En funktion med en
          <code>while</code>-løkke, som venter på slip, blokerer resten af dit program og giver
          ikke i sig selv korrekt debounce. Debounce kræver fx, at en ny aflæsning har været
          stabil i en bestemt periode. Et tryk-event kræver desuden sammenligning med tidligere
          tilstand. Brug standardtypen <code>bool</code>; Arduinos <code>boolean</code> er et alias.
        </p>
      </Callout>

      <h2>6. Deklaration før brug</h2>
      <p>
        I almindelige <code>.cpp</code>-filer skal compileren kende funktionen før et kald.
        En deklaration fortæller navn og typer; definitionen tilføjer kroppen. Arduino genererer
        ofte deklarationer automatisk for <code>.ino</code>, men det er et værktøjstrin, ikke en
        særlig C++-regel. Lær at skrive kontrakten selv, før du deler projektet op i filer.
      </p>
      <CodeBlock language="cpp">{`int doubled(int value); // Deklaration / prototype.

int calculate() {
  return doubled(21);
}

int doubled(int value) { // Definition.
  return value * 2;
}`}</CodeBlock>

      <h2>Missioner: gør funktionerne til dine egne</h2>
      <h3>Niveau 1 · Lysmester</h3>
      <p>
        Skriv <code>bool isDark(int raw, int threshold)</code>. Den skal returnere sand, når
        <code>raw</code> er mindre end tærsklen. Forudsig resultatet ved 199, 200 og 201 med
        tærskel 200. Beskriv hvorfor det er en ren beregning uden hardwareafhængighed.
      </p>
      <details className="exercise"><summary>Hint og løsningsforslag</summary>
        <CodeBlock language="cpp">{`bool isDark(int raw, int threshold) {
  return raw < threshold;
}`}</CodeBlock>
        <p>Resultaterne er sand, falsk, falsk. Hardwarefunktionen skal levere raw separat.</p>
      </details>
      <h3>Niveau 2 · Robust PWM-kontrakt</h3>
      <p>
        Udvid <code>adcToPwm</code>, så negative input giver 0 og input over 1023 giver 255.
        Prøv mindst −1, 0, 511, 1023 og 1024. Forklar forskellen på at stole på en forudsætning
        og at håndhæve den inde i funktionen.
      </p>
      <details className="exercise"><summary>Hint og løsningsforslag</summary>
        <CodeBlock language="cpp">{`int adcToPwm(int raw) {
  if (raw < 0) { return 0; }
  if (raw > 1023) { return 255; }
  return static_cast<long>(raw) * 255 / 1023;
}`}</CodeBlock>
        <p>Ved 511 giver heltalsberegningen 127. Lav først en forventningstabel, og sammenlign derefter med dit program.</p>
      </details>
      <h3>Niveau 3 · Sensorlaboratoriet</h3>
      <p>
        Del TMP36-eksemplet i aflæsning, omregning og præsentation. Lad referenceværdien være
        et input til beregningen. Sammenlign den beregnede temperatur ved raw 154 med referencerne
        5,00 V og 4,80 V. Hvilken antagelse i den oprindelige kode blev dermed synlig?
      </p>
      <details className="exercise"><summary>Hint og faglig kontrol</summary>
        <p>
          Med trinmodellen bliver resultaterne cirka 25,20 °C og 22,19 °C. Det demonstrerer
          referencefølsomhed, ikke sensorens faktiske temperatur. Funktionen skal modtage raw og
          reference, mens kun en separat hardwarefunktion må kalde <code>analogRead</code>.
        </p>
      </details>

      <h2>Selvtest før du går videre</h2>
      <ol>
        <li>Hvad er forskellen på parameter, argument og returværdi?</li>
        <li>Hvorfor ændrer en værdiparameter ikke automatisk den oprindelige variabel?</li>
        <li>Hvilken af dine funktioner kan afprøves uden Arduino, og hvorfor?</li>
        <li>Hvorfor kan en pæn funktionsopdeling stadig skjule et blokerende program?</li>
      </ol>
      <p>
        <strong>Makker-review:</strong> Byt kun funktionsdeklarationer. Kan din makker forklare
        input, output, enheder og sideeffekter uden at se kroppen? Ret navnene, hvor svaret er uklart.
      </p>
      <h2>Kilder og videre læsning</h2>
      <ul>
        <li><a href="https://eel.is/c++draft/dcl.fct" target="_blank" rel="noreferrer">C++ standardudkast: funktionsdeklarationer</a></li>
        <li><a href="https://docs.arduino.cc/arduino-cli/sketch-build-process/" target="_blank" rel="noreferrer">Arduino: sketchens byggeproces og genererede prototyper</a></li>
        <li><a href="https://docs.arduino.cc/built-in-examples/digital/Debounce/" target="_blank" rel="noreferrer">Arduino: Debounce</a></li>
        <li><a href="https://www.analog.com/media/en/technical-documentation/data-sheets/TMP35_36_37.pdf" target="_blank" rel="noreferrer">Analog Devices: TMP35/TMP36/TMP37 datablad</a></li>
      </ul>
    </LessonLayout>
  )
}
