import BeforeAfter from '../../components/BeforeAfter'
import Callout from '../../components/Callout'
import CodeBlock from '../../components/CodeBlock'
import LessonLayout from '../../components/LessonLayout'

const before1 = `int l = 13;
int b = 2;

void setup() {
  Serial.begin(9600);
  pinMode(l, OUTPUT);
  pinMode(b, INPUT_PULLUP);
}

void loop() {
  int x = digitalRead(b);
  if (x == LOW) {
    digitalWrite(l, HIGH);
    Serial.println("ON");
  } else {
    digitalWrite(l, LOW);
    Serial.println("OFF");
  }
  delay(100);
}`

const after1 = `constexpr int LED_PIN = 13;
constexpr int BUTTON_PIN = 2;
constexpr unsigned long POLL_DELAY_MS = 100UL;

bool isButtonPressed() {
  return digitalRead(BUTTON_PIN) == LOW;
}

void showButtonState(bool pressed) {
  digitalWrite(LED_PIN, pressed ? HIGH : LOW);
  Serial.println(pressed ? "ON" : "OFF");
}

void setup() {
  Serial.begin(9600);
  pinMode(LED_PIN, OUTPUT);
  pinMode(BUTTON_PIN, INPUT_PULLUP);
}

void loop() {
  const bool pressed = isButtonPressed();
  showButtonState(pressed);
  delay(POLL_DELAY_MS);
}`

const before2 = `void setup() {
  Serial.begin(9600);
  pinMode(13, OUTPUT);
}

void loop() {
  int v = analogRead(A0);
  float x = v * (5.0f / 1024.0f);
  float t = (x - 0.5f) * 100.0f;
  if (t > 30.0f) {
    digitalWrite(13, HIGH);
  } else {
    digitalWrite(13, LOW);
  }
  Serial.println(t);
  delay(500);
}`

const after2 = `constexpr int TEMP_PIN = A0;
constexpr int FAN_LED_PIN = 13;
constexpr float REFERENCE_V = 5.0f;
constexpr float ADC_STEPS = 1024.0f;
constexpr float TMP36_OFFSET_V = 0.5f;
constexpr float TMP36_C_PER_V = 100.0f;
constexpr float FAN_ON_C = 30.0f;
constexpr unsigned long SAMPLE_DELAY_MS = 500UL;

float tmp36Celsius(int raw) {
  const float voltage = raw * (REFERENCE_V / ADC_STEPS);
  return (voltage - TMP36_OFFSET_V) * TMP36_C_PER_V;
}

void setFanLed(bool on) {
  digitalWrite(FAN_LED_PIN, on ? HIGH : LOW);
}

void setup() {
  Serial.begin(9600);
  pinMode(FAN_LED_PIN, OUTPUT);
}

void loop() {
  const int raw = analogRead(TEMP_PIN);
  const float temperatureCelsius = tmp36Celsius(raw);
  setFanLed(temperatureCelsius > FAN_ON_C);
  Serial.println(temperatureCelsius);
  delay(SAMPLE_DELAY_MS);
}`

export default function Refaktorering() {
  return (
    <LessonLayout module="h3">
      <h1>Refaktorering: ombyg mens lyset er tændt</h1>
      <p>
        Refaktorering forbedrer strukturen, mens den aftalte, observerbare adfærd bevares.
        Vi ændrer navne, flytter ansvar og gør forudsætninger tydelige. En fejlrettelse eller
        en ny feature kan også være en god ændring, men den skal have sit eget mål og sin egen
        kontrol. Ellers ved du ikke, hvorfor programmet pludselig gør noget andet.
      </p>
      <Callout type="info">
        <p>
          <strong>Dit værksted:</strong> UNO R3, Arduino IDE og en kopi af sketchen, du kan
          vende tilbage til. For hvert skridt skal du kunne sige: “Dette ændrede jeg, denne
          adfærd skulle bevares, og sådan kontrollerede jeg det.” Ingen af tabellerne nedenfor
          er målelogs; de er forventninger, som du skal sammenholde med din egen afprøvning.
        </p>
      </Callout>

      <h2>1. Skriv kontrakten før du flytter kode</h2>
      <p>
        Observerbar adfærd omfatter mere end en returværdi. På Arduino kan det være LED-niveau,
        rækkefølge af hardwarekald, tekst på Serial og tidsstyring. To programmer kan se lige
        pæne ud og stadig være forskellige, hvis det ene skriver hver gang, og det andet kun
        skriver ved en ændring.
      </p>
      <ol>
        <li><strong>Beskriv:</strong> Hvilke input har vi, og hvilke output kan brugeren observere?</li>
        <li><strong>Fastlæg:</strong> Hvilke grænser og tilstandsskift skal bevares?</li>
        <li><strong>Ændr lidt:</strong> Omdøb, byg, udtræk én funktion, byg igen.</li>
        <li><strong>Sammenlign:</strong> Brug samme input og en konkret forventning.</li>
      </ol>

      <h2>Workshop 1 · Knap og LED uden skjulte featureændringer</h2>
      <p>
        Knap mellem pin 2 og GND, intern pullup. LOW betyder trykket. Begge versioner sætter
        LED og skriver én statuslinje for hver tur gennem loop, efterfulgt af 100 ms ventetid.
        LED på pin 13 er UNO R3's indbyggede LED. Skift mellem før og efter og find de bevarede handlinger.
      </p>
      <BeforeAfter
        before={before1}
        after={after1}
        beforeNotes={<>Lovlig kode, men navnene <code>l</code>, <code>b</code> og <code>x</code> skjuler rollerne. Tallet 100 har ingen forklaring.</>}
        afterNotes={<>Pin-valg og pollingpause er navngivne. Aflæsning og præsentation har hvert sit ansvar. LED, tekst og pause er bevaret.</>}
      />
      <div className="lesson-table-scroll"><table>
        <thead><tr><th>Input ved aflæsning</th><th>LED</th><th>Serial pr. iteration</th><th>Efter handling</th></tr></thead>
        <tbody>
          <tr><td>LOW, trykket</td><td>HIGH</td><td><code>ON</code> + linjeskift</td><td>100 ms delay</td></tr>
          <tr><td>HIGH, sluppet</td><td>LOW</td><td><code>OFF</code> + linjeskift</td><td>100 ms delay</td></tr>
        </tbody>
      </table></div>
      <p>
        Tidsplanen er ikke præcis 10 Hz: aflæsning og udskrift tager også tid. Udtræk af funktioner
        kan ændre små eksekveringsdetaljer, så et strengt timingkrav kræver særskilt måling.
        Her bevarer vi den aftalte sekvens og pause, ikke et løfte om identiske CPU-cyklusser.
      </p>
      <Callout type="warn">
        <p>
          Pausen er <strong>polling</strong>, ikke en dokumenteret debounce-algoritme.
          Hvis vi ændrer teksten til “LED ON”, skifter til kun at logge ved ændringer eller
          indfører et toggle pr. tryk, ændrer vi også adfærden. Det kan komme bagefter som en
          ny opgave med nye acceptkriterier.
        </p>
      </Callout>

      <h2>Workshop 2 · Temperatur med en tydelig model</h2>
      <p>
        Begge versioner forudsætter <strong>TMP36</strong> på A0, UNO R3's standard ADC og en
        antaget reference på 5,0 V. De bruger samme trinmodel med division med 1024 og samme
        sensorformel. Pin 13 er en indikator for ventilatorbeslutningen, ikke en udgang til at
        strømforsyne en motor. En rigtig ventilator kræver en egnet driver og strømforsyning.
      </p>
      <BeforeAfter
        before={before2}
        after={after2}
        beforeNotes={<>Alle trin ligger i loop. Navne og tal fortæller ikke, om værdierne er råmåling, volt eller Celsius.</>}
        afterNotes={<>Sensorens antagelser er navngivet. Omregningen kan kontrolleres med et råtal uden analogRead. Beslutningen er stadig strengt større end 30 °C.</>}
      />
      <p>
        Vi har bevidst bevaret regnerækkefølgen og float-konstanterne. At ændre til en anden
        kalibrering eller omskrive regneudtrykket kan være relevant, men er en separat ændring.
        En funktion med et godt navn gør det desuden lettere at opdage, at formlen er knyttet
        til TMP36 og ikke til enhver sensor med tre ben.
      </p>
      <div className="lesson-table-scroll"><table>
        <thead><tr><th>Kontrol</th><th>Forventning</th><th>Hvad opdager den?</th></tr></thead>
        <tbody>
          <tr><td>Beregn med raw = 0</td><td>−50 °C i denne matematiske model</td><td>Offset og regnerækkefølge</td></tr>
          <tr><td>Beregn med raw = 154</td><td>Cirka 25,20 °C</td><td>ADC-skalering og sensormodel</td></tr>
          <tr><td>Beslutning ved 29,9 / 30,0 / 30,1 °C</td><td>Sluk / sluk / tænd</td><td>Om &gt; utilsigtet er blevet til &gt;=</td></tr>
          <tr><td>En iteration</td><td>Læs → beregn → skriv LED → skriv Serial → vent</td><td>Flyttede eller ekstra sideeffekter</td></tr>
        </tbody>
      </table></div>
      <p>
        raw = 0 beviser ikke, at sensoren faktisk måler −50 °C. Det er en testværdi til
        beregningsmodellen og kan i praksis også skyldes et ledningsproblem. En matematisk kontrol
        og en hardwarekontrol svarer på forskellige spørgsmål.
      </p>

      <h2>2. Små sikre transformationer</h2>
      <h3>Omdøb med sammenhæng</h3>
      <p>
        Omdøb ét begreb ad gangen med editorens symbolfunktion. Søg bagefter efter det gamle
        navn og gennemgå diffen. En blind teksterstatning kan også ændre tekster, kommentarer
        eller andre symboler, der tilfældigvis har samme stavning.
      </p>
      <h3>Udtræk en funktion med eksplicit input</h3>
      <p>
        Flyt først en sammenhængende beregning. Spørg hvilke lokale værdier den læser, og hvad
        den producerer. Gør de læste data til parametre og resultatet til returværdi. Opret ikke
        nye globale variabler blot for at slippe for parametre.
      </p>
      <h3>Reducer gentagelse uden at skjule forskelle</h3>
      <p>
        To ens mønstre kan samles, når de repræsenterer samme idé. Hvis deres regler er på vej
        i hver sin retning, kan en fælles funktion blive sværere at forstå end to tydelige små
        funktioner. Refaktorering er et designvalg, ikke en konkurrence om færrest linjer.
      </p>

      <h2>3. Et nyt krav: hysterese er en feature</h2>
      <p>
        Ventilatorindikatoren kan skifte hurtigt, hvis målingen svinger omkring 30 °C. Et nyt
        krav kunne være: tænd over 30 °C, sluk under 28 °C, og behold tilstanden imellem.
        Det kræver historik og giver bevidst en anden adfærd end workshoppen.
      </p>
      <CodeBlock language="cpp">{`// Ny adfærd: en ren beslutningsfunktion med tidligere tilstand.
bool nextFanState(float celsius, bool currentlyOn) {
  if (celsius > 30.0f) { return true; }
  if (celsius < 28.0f) { return false; }
  return currentlyOn;
}

// Tilstandstabellen skal bl.a. dække:
// 29.0f og false -> false
// 29.0f og true  -> true
// 30.1f og false -> true
// 27.9f og true  -> false`}</CodeBlock>
      <p>
        Funktionen afhænger nu af både temperatur og tidligere tilstand, men skjuler ikke
        historikken i en global variabel. Du kan kontrollere hver kombination med kendte input.
        Definér også præcis, hvad der skal ske ved de to grænser; her bevares tilstanden ved
        nøjagtigt 28 og 30 °C.
      </p>

      <h2>Missioner</h2>
      <h3>Niveau 1 · Ét skridt ad gangen</h3>
      <p>
        Start med før-versionen af workshop 1. Omdøb først pins, byg og afprøv. Udtræk derefter
        aflæsningen, og til sidst præsentationen. Notér én observation efter hvert skridt.
      </p>
      <details className="exercise"><summary>Kontrolpunkter</summary>
        <p>
          Kontroller trykket og sluppet knap, den præcise Serial-tekst og at der fortsat er en
          pause pr. iteration. Ret ikke logfrekvens eller knaplogik undervejs. En mindre ændring
          gør det lettere at forklare, hvad der eventuelt gik galt.
        </p>
      </details>
      <h3>Niveau 2 · Udtræk beslutningen</h3>
      <p>
        Refaktorér workshop 2, så beslutningen ligger i <code>bool shouldRunFan(float celsius)</code>.
        Bevar den oprindelige regel. Lav en forventningstabel med under, på og over grænsen,
        og kontrollér, at ingen hardwarefunktioner gemmer sig i beregningen.
      </p>
      <details className="exercise"><summary>Løsningsforslag</summary>
        <CodeBlock language="cpp">{`bool shouldRunFan(float celsius) {
  return celsius > FAN_ON_C;
}

// I loop erstattes kun beslutningen:
// setFanLed(shouldRunFan(temperatureCelsius));`}</CodeBlock>
        <p>29,9 og 30,0 giver falsk; 30,1 giver sand. Den øvrige rækkefølge bevares.</p>
      </details>
      <h3>Niveau 3 · Refaktorering og feature i hver sin ændring</h3>
      <p>
        Lav først et lille sensor.h/sensor.cpp-modul uden ændret adfærd. Indfør derefter
        hysterese som et separat skridt. Dokumentér forskellen i acceptkriterierne, og demonstrér
        en inputsekvens, hvor de to versioner med vilje giver forskellige resultater.
      </p>
      <details className="exercise"><summary>Hint til en god demonstration</summary>
        <p>
          Start slukket og brug 31 → 29 → 27 °C. Den gamle regel giver tænd → sluk → sluk.
          Hysterese giver tænd → tænd → sluk. Det viser den nye tilstandsafhængighed tydeligt.
          Filopdelingen bør derimod bevare alle oprindelige resultater.
        </p>
      </details>

      <h2>Selvtest og refleksion</h2>
      <ol>
        <li>Er “kun udskriv, når tilstanden ændres” en ren refaktorering?</li>
        <li>Hvorfor skal en test af en tærskel også omfatte selve grænseværdien?</li>
        <li>Hvordan gør returværdier en beregning lettere at kontrollere end skjulte globale ændringer?</li>
        <li>Hvornår bør du stoppe med at udtrække flere funktioner?</li>
      </ol>
      <p>
        <strong>Exit ticket:</strong> Vis en før/efter-diff fra dit eget arbejde. Forklar én
        forbedret struktur og ét konkret bevis for bevaret adfærd. Skeln mellem det, du faktisk
        har afprøvet, og det, du endnu kun forventer.
      </p>
      <h2>Kilder og videre læsning</h2>
      <ul>
        <li><a href="https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#f-functions" target="_blank" rel="noreferrer">C++ Core Guidelines: funktioners ansvar og grænseflader</a></li>
        <li><a href="https://docs.arduino.cc/built-in-examples/digital/InputPullupSerial/" target="_blank" rel="noreferrer">Arduino: Input Pullup Serial og aktiv LOW</a></li>
        <li><a href="https://docs.arduino.cc/built-in-examples/digital/Debounce/" target="_blank" rel="noreferrer">Arduino: reel debounce frem for en navngiven pause</a></li>
        <li><a href="https://www.analog.com/media/en/technical-documentation/data-sheets/TMP35_36_37.pdf" target="_blank" rel="noreferrer">Analog Devices: TMP36-modellens forudsætninger</a></li>
      </ul>
    </LessonLayout>
  )
}
