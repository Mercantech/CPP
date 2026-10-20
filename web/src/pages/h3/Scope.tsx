import Callout from '../../components/Callout'
import CodeBlock from '../../components/CodeBlock'
import LessonLayout from '../../components/LessonLayout'

export default function Scope() {
  return (
    <LessonLayout module="h3">
      <h1>Scope og levetid: hvem må se hvad?</h1>
      <p>
        En LED skal huske sin tilstand mellem to ture gennem <code>loop()</code>. En
        mellemregning skal kun eksistere under en enkelt måling. Begge er variabler, men deres
        ansvar er forskelligt. Her lærer du at placere data, så det bliver tydeligt, hvem der
        ejer dem, hvem der kan ændre dem, og hvornår de stadig er gyldige.
      </p>
      <Callout type="info">
        <p>
          <strong>Tre forskellige begreber:</strong> Scope handler om, hvor et <em>navn</em>
          kan bruges. Levetid handler om, hvornår et <em>objekt</em> eksisterer. Storage duration
          beskriver varigheden af det lager, objektet bruger. En lokal <code>static</code> viser,
          hvorfor lokalt scope og kort levetid ikke er det samme.
        </p>
      </Callout>

      <h2>1. Krøllede parenteser tegner lokale områder</h2>
      <CodeBlock language="cpp">{`constexpr int LED_PIN = 13; // Navnet kan bruges efter deklarationen.

void setup() {
  pinMode(LED_PIN, OUTPUT);
}

void loop() {
  const int raw = analogRead(A0);

  if (raw > 700) {
    const int brightness = 255;
    digitalWrite(LED_PIN, brightness > 0 ? HIGH : LOW);
  }

  // raw kan bruges her.
  // brightness kan ikke bruges her: dens block scope er slut.
}`}</CodeBlock>
      <p>
        Et navn fra et ydre scope kan normalt findes i et indre scope. Det modsatte gælder
        ikke. <code>brightness</code> hører til blokkens egen beregning og kan ikke bruges efter
        dens afsluttende parentes. At holde den dér gør det umuligt for en anden del af løkken
        at ændre den ved et uheld.
      </p>
      <div className="scope-viz">
        <div className="scope-viz__box scope-viz__box--global">
          <h3>Namespace-scope, ofte kaldet globalt</h3>
          <p>Godt til faste pin-konstanter og bevidst delt programtilstand. Navne bliver kendt gennem synlige deklarationer.</p>
        </div>
        <div className="scope-viz__box scope-viz__box--local">
          <h3>Block scope, ofte kaldet lokalt</h3>
          <p>Godt til parametre og midlertidige resultater. En almindelig lokal variabel bliver oprettet på ny, når udførelsen når deklarationen.</p>
        </div>
      </div>

      <h2>2. Hvorfor din tæller glemmer</h2>
      <CodeBlock language="cpp">{`// Problem: et udsnit, der ikke gemmer tilstand mellem kald.
void countWrong() {
  int count = 0;
  ++count;
  Serial.println(count);
}

// Alternativ: samme objekt huskes mellem kald.
void countRemembered() {
  static unsigned long count = 0;
  ++count;
  Serial.println(count);
}`}</CodeBlock>
      <p>
        Ved hvert kald af <code>countWrong</code> oprettes et nyt lokalt objekt med værdien 0.
        I <code>countRemembered</code> initialiseres det statiske objekt én gang og husker værdien.
        Begge navne har lokalt scope; kun den anden variabel har statisk storage duration.
        Når unsigned tælleren til sidst når sin maksimumværdi, ruller den rundt.
      </p>
      <p>
        Fra C# kender du måske forskellen på en lokal variabel og et felt. C++ giver flere
        kombinationer: en lokal <code>static</code> er hverken et almindeligt lokalt objekt eller
        et felt i en bestemt objektinstans. Der er én gemt variabel for denne funktion, delt af
        alle dens kald.
      </p>

      <h2>3. Lav en tidsstyret funktion med privat hukommelse</h2>
      <CodeBlock language="cpp">{`constexpr unsigned long BLINK_MS = 500UL;

void updateHeartbeat(unsigned long now) {
  static unsigned long lastChange = 0;
  static bool ledOn = false;

  if (now - lastChange >= BLINK_MS) {
    lastChange = now;
    ledOn = !ledOn;
    digitalWrite(LED_BUILTIN, ledOn ? HIGH : LOW);
  }
}

void setup() {
  pinMode(LED_BUILTIN, OUTPUT);
}

void loop() {
  updateHeartbeat(millis());
  // Andre opgaver kan få en tur her.
}`}</CodeBlock>
      <p>
        Det aktuelle tidspunkt er input, så funktionen behøver ikke selv aflæse uret.
        <code>lastChange</code> og <code>ledOn</code> kan kun navngives inde i funktionen, men
        deres værdier overlever retur. Funktionen venter ikke på, at 500 ms går; den undersøger
        blot, om det er tid til at skifte. Det er forskellen på en hurtig opdatering og en venteløkke.
      </p>
      <Callout type="warn">
        <p>
          En lokal <code>static</code> gør ikke data automatisk nemme at teste eller genbruge.
          Kalder du funktionen for to forskellige LED'er, får de ikke automatisk hver sin timer.
          Desuden kan en test ikke uden videre nulstille den skjulte tilstand. Når flere ting
          skal huske hver deres data, så gør tilstanden til et eksplicit objekt.
        </p>
      </Callout>

      <h2>4. To LED'er får hver deres tilstand</h2>
      <CodeBlock language="cpp">{`struct BlinkState {
  unsigned long lastChange;
  bool on;
};

BlinkState first{0, false};
BlinkState second{0, false};

void updateBlink(int pin, unsigned long interval,
                 unsigned long now, BlinkState& state) {
  if (now - state.lastChange >= interval) {
    state.lastChange = now;
    state.on = !state.on;
    digitalWrite(pin, state.on ? HIGH : LOW);
  }
}

void setup() {
  pinMode(8, OUTPUT);
  pinMode(9, OUTPUT);
}

void loop() {
  const unsigned long now = millis();
  updateBlink(8, 300UL, now, first);
  updateBlink(9, 700UL, now, second);
}`}</CodeBlock>
      <p>
        <code>BlinkState</code> samler data, der hører sammen. Referenceparameteren
        <code>state</code> peger sprogligt på det objekt, som dette kald skal opdatere. De to
        objekter har hver sin historik, selv om de bruger samme funktion. På desktop gælder
        samme C++-regler; Arduino-funktionerne til pin og tid skal blot erstattes af den valgte platform.
      </p>

      <h2>5. Shadowing: samme navn, forskelligt objekt</h2>
      <CodeBlock language="cpp">{`int counter = 10;

void example() {
  int counter = 0; // Skjuler det ydre navn i denne blok.
  ++counter;      // Ændrer kun det lokale objekt til 1.
}

// Den globale counter er fortsat 10 efter example().`}</CodeBlock>
      <p>
        Koden kan være lovlig, men den er let at misforstå. En udvikler kan tro, at en global
        værdi bliver opdateret, mens kun en lokal kopi ændres. Giv forskellige roller forskellige
        navne, og aktivér compileradvarsler om shadowing, når værktøjet tilbyder det.
      </p>

      <h2>6. Levetid: returnér ikke et objekt, som er væk</h2>
      <CodeBlock language="cpp">{`// FORKERT: demonstrerer en dangling reference. Brug den ikke.
int& brokenReading() {
  int raw = 42;
  return raw;
}

// RIGTIGT: resultatet returneres som en værdi.
int reading() {
  int raw = 42;
  return raw;
}`}</CodeBlock>
      <p>
        Når <code>brokenReading</code> returnerer, er det lokale objekt ophørt med at eksistere.
        En reference til det forlænger ikke dets levetid. Det samme problem kan ramme en pointer
        til en lokal buffer. Returnér små resultater som værdier; ved større objekter skal ejerskab
        og levetid være en del af designet. Det er en væsentlig forskel fra at stole på C#'s garbage collector.
      </p>

      <h2>7. Hvad betyder “global” i flere filer?</h2>
      <p>
        En global variabel bliver ikke automatisk kendt i alle <code>.cpp</code>-filer. Hver
        oversættelsesenhed skal se en deklaration. Linkage afgør, om deklarationer i forskellige
        enheder kan referere til samme entitet. Det er et andet spørgsmål end scope.
        I et modul kan en unavngiven namespace holde interne hjælpere inde i én oversættelsesenhed.
      </p>
      <CodeBlock language="cpp">{`// Udsnit af sensor.cpp:
namespace {
  constexpr int SENSOR_PIN = A0;
  unsigned long lastSample = 0;
}

// Andre .cpp-filer kan ikke tilgå disse interne navne med extern.`}</CodeBlock>
      <p>
        Brug ikke <code>extern</code> som standardløsning på uklart dataejerskab. Et lille API
        med funktioner eller et tilstandsobjekt gør det ofte lettere at se, hvem der må ændre hvad.
      </p>

      <h2>Missioner</h2>
      <h3>Niveau 1 · Tegn områderne</h3>
      <p>
        Tegn bokse omkring scopes i første eksempel. Markér, hvor LED_PIN, raw og brightness
        kan navngives. Forklar derefter, hvilke objekter der bliver oprettet igen ved næste loop-kald.
      </p>
      <details className="exercise"><summary>Kontrol</summary>
        <p>
          LED_PIN har namespace-scope fra deklarationen. raw findes i loop-blokken efter sin
          deklaration. brightness findes kun i if-blokken efter sin deklaration. De to almindelige
          lokale objekter oprettes på ny, når udførelsen når deres deklarationer.
        </p>
      </details>
      <h3>Niveau 2 · Nulstil en timer</h3>
      <p>
        Udvid BlinkState-eksemplet med en funktion, der nulstiller et valgt objekt og slukker
        dets LED. Skal funktionen modtage en kopi eller en reference? Lad reset-tidspunktet være input.
      </p>
      <details className="exercise"><summary>Hint og løsningsforslag</summary>
        <CodeBlock language="cpp">{`void resetBlink(int pin, unsigned long now, BlinkState& state) {
  state.lastChange = now;
  state.on = false;
  digitalWrite(pin, LOW);
}`}</CodeBlock>
        <p>En reference ændrer det eksisterende objekt. En kopi ville efterlade originalens historik uændret.</p>
      </details>
      <h3>Niveau 3 · Hvem ejer hukommelsen?</h3>
      <p>
        Din makker vil gøre alle sensormålinger globale for at “slippe for parametre”. Foreslå
        en løsning med lokale værdier, returværdier og ét eksplicit tilstandsobjekt. Beskriv én
        fordel og én omkostning i forhold til en lokal static.
      </p>
      <details className="exercise"><summary>Diskussionsstøtte</summary>
        <p>
          Midlertidige råmålinger kan være lokale. En beregning returnerer sit resultat. Historik
          placeres i et objekt, som opdateringsfunktionen modtager ved reference. Det kræver mere
          eksplicitte parametre, men giver uafhængige instanser og mulighed for at nulstille historikken.
        </p>
      </details>

      <h2>Selvtest og refleksion</h2>
      <ol>
        <li>Kan et lokalt navn referere til et objekt, som overlever funktionen?</li>
        <li>Hvorfor er en global konstant mindre problematisk end delt, mutérbar tilstand?</li>
        <li>Hvad er problemet med at returnere en reference til en almindelig lokal variabel?</li>
        <li>Hvor mange timere får du ved at kalde samme funktion med én lokal static to gange?</li>
      </ol>
      <p><strong>Exit ticket:</strong> Find én variabel i dit projekt, der kan få et mindre scope uden at ændre adfærden.</p>
      <h2>Kilder og videre læsning</h2>
      <ul>
        <li><a href="https://eel.is/c++draft/basic.scope.scope" target="_blank" rel="noreferrer">C++ standardudkast: scope</a></li>
        <li><a href="https://eel.is/c++draft/basic.stc" target="_blank" rel="noreferrer">C++ standardudkast: storage duration</a></li>
        <li><a href="https://eel.is/c++draft/basic.life" target="_blank" rel="noreferrer">C++ standardudkast: objekters levetid</a></li>
        <li><a href="https://docs.arduino.cc/built-in-examples/digital/BlinkWithoutDelay/" target="_blank" rel="noreferrer">Arduino: Blink Without Delay</a></li>
      </ul>
    </LessonLayout>
  )
}
