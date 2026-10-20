import { Link } from 'react-router-dom'
import Callout from '../../components/Callout'
import CodeBlock from '../../components/CodeBlock'
import LessonLayout from '../../components/LessonLayout'
import { objectsCode } from './codeExamples'

export default function Objekter() {
  return (
    <LessonLayout module="h5">
      <p className="eyebrow">H5 · 01 · 3–4 timer</p>
      <h1>Objekter med regler</h1>
      <p className="lead">
        En klasse er mere end en mappe til funktioner. Den kan gøre det svært at repræsentere
        en fejl: en temperatur uden enhed, en sensor uden navn eller en alarmgrænse, som ingen
        rigtig sensor kan måle. Det er her, typer begynder at arbejde for dig.
      </p>
      <ul className="objectives">
        <li><span className="objectives__id">01</span><span>Vælg struct til en åben datapakke og class til en tilstand med regler.</span></li>
        <li><span className="objectives__id">02</span><span>Etabler en invariant i en constructor, og bevar den i alle ændringer.</span></li>
        <li><span className="objectives__id">03</span><span>Brug const-metoder og komposition til at beskrive et lille domæne.</span></li>
      </ul>

      <h2>Fra parallelle variabler til en model</h2>
      <p>
        Forestil dig tre arrays: sensornavne, tidspunkter og temperaturer. Hvis du sorterer ét
        array alene, kan en temperatur pludselig tilhøre den forkerte sensor. Et objekt samler
        værdier, som skal følges ad. Det er modellering: koden får samme begreber som problemet.
      </p>
      <CodeBlock>{`struct Measurement {
    int second;
    double celsius;
};

Measurement original{10, 23.5};
Measurement copy = original;
copy.celsius = 24.0;
// original.celsius er stadig 23.5.
`}</CodeBlock>
      <p>
        I C++ bliver en almindelig kopierbar type kopieret ved denne initialisering.
        <code> original</code> og <code>copy</code> er to objekter. Det gælder også en kopierbar
        <code> class</code>: keywordet giver ikke automatisk C#-agtig referenceadfærd. Hvordan
        en bestemt type kopieres, afhænger af dens kopieringsoperationer og medlemmer.
      </p>
      <Callout type="info">
        <p><strong>struct og class har næsten samme værktøjskasse.</strong> Begge kan have metoder og constructors. Standardadgangen er public i struct og private i class; standardadgangen ved arv er også forskellig. Vi bruger valget til at signalere hensigt.</p>
      </Callout>

      <h2>En invariant er din models løfte</h2>
      <p>
        En invariant er en regel, der skal være sand for et færdigkonstrueret objekt og efter
        dets offentlige operationer. For vores <code>Celsius</code> vælger vi et sensorspecifikt
        interval fra −50 til 150 °C og kræver en endelig værdi. Det er et valg i denne opgave,
        ikke en fysisk grænse for temperaturer i almindelighed.
      </p>
      <p>
        Med et offentligt <code>double</code>-felt kan enhver kode indsætte −999, uendelig eller
        NaN. Med et privat felt og en validerende constructor kan du centralisere kontrollen.
        Et kald med en ugyldig værdi kaster her <code>std::invalid_argument</code>; der bliver
        ikke returneret et normalt, færdigt Celsius-objekt til kalderen.
      </p>
      <CodeBlock>{`class Celsius {
public:
    explicit Celsius(double value) : value_{value} {
        if (!std::isfinite(value) || value < -50.0 || value > 150.0) {
            throw std::invalid_argument{"Ugyldig temperatur"};
        }
    }
    double value() const noexcept { return value_; }
private:
    double value_;
};
`}</CodeBlock>
      <p>
        Dette udsnit kræver <code>&lt;cmath&gt;</code> og <code>&lt;stdexcept&gt;</code>; hele
        programmet kommer nedenfor. <code>std::isfinite</code> er vigtig: en NaN-værdi bliver
        ikke opfanget af kun <code>value &lt; -50 || value &gt; 150</code>, fordi de sammenligninger
        begge er falske for NaN. Valideringen skal passe til datatypens faktiske mulige værdier.
      </p>
      <p>
        <code>explicit</code> betyder her, at en almindelig <code>double</code> ikke stiltiende
        konverteres til Celsius ved et funktionskald. Du skriver <code>Celsius{'{'}23.5{'}'}</code>
        og gør enheden synlig. En stærkere type kan derfor fange nogle fejl allerede ved kompilering.
      </p>

      <h2>Constructoren bygger objektet</h2>
      <p>
        Udtrykket efter kolon er en <em>member initializer list</em>. Medlemmerne initialiseres,
        før constructorens krop udføres. Det er især nødvendigt for medlemmer, som ikke har en
        defaultconstructor, og for referencer eller const-datamedlemmer.
      </p>
      <CodeBlock>{`Sensor(std::string name, Celsius alarmLimit)
    : name_{std::move(name)}, alarmLimit_{alarmLimit} {
    if (name_.empty()) {
        throw std::invalid_argument{"Sensor skal have et navn"};
    }
}
`}</CodeBlock>
      <p>
        Sensorens navn flyttes fra parameteren ind i objektets eget <code>std::string</code>-medlem.
        <code> std::move</code> giver mulighed for at bruge en flytteoperation; det er ikke i sig
        selv en transport af bytes. Vi ser ejerskab og flytning i næste lektion. Efter dette
        udtryk bruger vi ikke parameterens gamle tekst igen.
      </p>
      <Callout type="warn">
        <p>Medlemmer initialiseres i den rækkefølge, de er deklareret i klassen, også hvis listen efter kolon står anderledes. Skriv rækkefølgerne ens. Ellers kan én initializer komme til at bruge et medlem, som endnu ikke er initialiseret.</p>
      </Callout>
      <p>
        En constructor har ikke nogen returtype. Den etablerer objektets første gyldige
        tilstand. En metode som <code>setAlarmLimit</code> er derimod en senere ændring, der
        stadig skal bevare invarianten. Her modtager metoden en <code>Celsius</code>, som allerede
        er valideret; klassen undgår at have to forskellige temperaturvalideringer.
      </p>

      <h2>const er en kontrakt om adgang</h2>
      <p>
        Når <code>const</code> står efter en medlemsfunktions parameterliste, kan metoden
        kaldes på et const-objekt. Gennem denne adgang må den ikke ændre objektets almindelige
        datamedlemmer. Derfor kan både <code>name()</code> og <code>isAlarm(...)</code> bruges
        på en <code>const Sensor</code>, mens en setter ikke kan.
      </p>
      <CodeBlock>{`const Sensor sensor{"Vaerksted", Celsius{25.0}};
const Measurement reading{10, Celsius{27.5}};
const bool alarm = sensor.isAlarm(reading); // OK: laesende metode.
// sensor.setAlarmLimit(Celsius{28.0});     // Compilefejl: aendring af const-objekt.
`}</CodeBlock>
      <p>
        Det er noget andet end at gøre selve datamedlemmet <code>const</code>. Et
        <code> const double value_</code> kunne ikke tildeles en ny værdi og ville begrænse
        klassens almindelige tildelingsoperationer. Vi bruger privat data og en læsende metode
        til at beskytte Celsius, mens værditypen fortsat kan erstattes af en anden gyldig Celsius.
      </p>
      <p>
        <code>noexcept</code> fortæller, at funktionen ikke må lade en exception slippe ud.
        Det er passende til den enkle aflæsning og sammenligning her. Sæt det ikke på en
        funktion, som kan fejle med en exception, blot for at få koden til at se professionel ud:
        en exception, der forlader en noexcept-funktion, terminerer programmet.
      </p>

      <h2>Komposition: en sensor har en grænse</h2>
      <p>
        Vores sensor <em>har et</em> navn og en alarmgrænse. Det er komposition: små typer indgår
        som medlemmer i en større type. En måling indeholder en Celsius. Ingen af disse forhold
        kræver arv. Start med den relation, der faktisk findes i problemet.
      </p>
      <p>
        En enkelt måling er en åben datapakke i dette eksempel. Dens sekundfelt har ingen
        indbygget validering; kaldende kode skal sikre et meningsfuldt tidspunkt. Det er en
        bevidst begrænsning, som du udvider i øvelsen. At én del af modellen er stærkt valideret
        betyder ikke, at alle andre felter automatisk er det.
      </p>
      <p>
        Vi skriver ingen destructor, copyconstructor eller egne tildelingsoperatorer. De
        eksisterende medlemmer håndterer deres ressourcer. Det kaldes ofte <em>Rule of Zero</em>:
        design din type, så standardoperationerne allerede gør det rigtige. Når du senere møder
        særlige ressourcer, skal den type, der ejer ressourcen, have en tydelig oprydningspolitik.
      </p>

      <h2>Kør laboratoriet: fra ALARM til OK</h2>
      <p>
        Gem som <code>objekter.cpp</code> og byg med C++20 fra
        <Link to="/h5"> startguiden</Link>. <a href="/examples/h5/objekter.cpp" download>Hent den komplette kildefil</a>.
        Forudsig alle tre outputlinjer før du kører.
      </p>
      <CodeBlock>{objectsCode}</CodeBlock>
      <CodeBlock language="text">{`Vaerksted: ALARM
Efter ny graense: OK
Afvist: Temperatur uden for sensorens interval
`}</CodeBlock>
      <p>
        Den første alarm skyldes sammenligningen 27,5 &gt; 25. Efter ændringen er 27,5 &gt; 28
        falsk. Til sidst demonstrerer den ugyldige temperatur fejlvejen. Catch-blokken står ved
        programmets grænse og gør fejlen læsbar; undgå at skjule den ved at returnere en falsk
        normalværdi som 0 °C.
      </p>

      <h2>Værksted: byg reglerne ind</h2>
      <details className="exercise">
        <summary>Øvelse 1 · temperaturens yderkanter (25 min)</summary>
        <p>Undersøg −50, 150, −50,1, 150,1 og en NaN-værdi. Lav et lille program, hvor hvert forsøg har sin egen try/catch, så ét afvist input ikke stopper de øvrige.</p>
        <p><strong>Accept:</strong> grænserne accepteres, værdierne udenfor og NaN afvises. Forklar hvorfor en test kun med 23,5 ikke viser, at valideringen virker.</p>
        <details><summary>Hint</summary><p>NaN kan laves med <code>std::numeric_limits&lt;double&gt;::quiet_NaN()</code> fra <code>&lt;limits&gt;</code>. Brug ikke division med nul som testdata-generator.</p></details>
      </details>
      <details className="exercise">
        <summary>Øvelse 2 · en måling må ikke rejse tilbage i tiden (35 min)</summary>
        <p>Lav en <code>Seconds</code>-type, som kun tillader heltal fra 0 og op. Lad Measurement indeholde Seconds frem for int. Opdater alle initialiseringer, og vis et accepteret og et afvist tidspunkt.</p>
        <p><strong>Accept:</strong> du kan ikke konstruere en normal Seconds med −1, og læsning af værdien kan udføres på et const-objekt.</p>
        <details><summary>Hint</summary><p>Genbrug mønstret fra Celsius. Et unsigned-felt alene er ikke hele en validering: et negativt input kan allerede være konverteret, inden du får mulighed for at afvise det.</p></details>
      </details>
      <details className="exercise">
        <summary>Øvelse 3 · designreview uden automatisk setter-generator (30 min)</summary>
        <p>Tilføj et sensornummer og beslut, om det må ændres efter oprettelse. Skriv først reglen i en sætning. Tilføj kun de operationer, din brugssituation behøver.</p>
        <p><strong>Accept:</strong> din makker kan forklare, hvilke tilstande API'et forhindrer, og hvorfor der er eller ikke er en setter.</p>
        <details><summary>Ekstra udfordring</summary><p>Lav en <code>rename</code>-metode. En tom tekst skal afvises, og sensorens gamle navn skal være bevaret efter fejlen. Valider parameteren, før du ændrer medlemmet.</p></details>
      </details>

      <h2>Stop op og forklar</h2>
      <details className="exercise"><summary>Hvorfor har Sensor både private medlemmer og en validerende constructor?</summary><p>Constructoren sikrer en gyldig start. Den private adgang forhindrer andre dele af programmet i bagefter at omgå reglerne. Offentlige ændringer skal selv bevare invarianten.</p></details>
      <details className="exercise"><summary>Hvorfor kan Measurement være struct, selv om den indeholder en class?</summary><p>struct/class afgør ikke, hvilke typer der kan være medlemmer. Celsius beskytter temperaturens regel. Measurement grupperer data; dens eventuelle tidsregler er et separat designvalg.</p></details>
      <details className="exercise"><summary>Hvorfor returnerer name() en std::string-værdi i eksemplet?</summary><p>Kalderen får sin egen tekstværdi. Et retur-lån med const-reference kunne undgå en kopi, men ville kræve, at Sensor stadig eksisterer. Vi vælger den enkle levetidskontrakt her.</p></details>
      <Callout type="tip"><p>Næste spørgsmål er: hvem ejer objekterne, og hvor længe må et lån bruges? Fortsæt med <Link to="/h5/hukommelse">hukommelse og ejerskab</Link>.</p></Callout>

      <h2>Læs videre i de primære kilder</h2>
      <ul>
        <li><a href="https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#Rc-struct" target="_blank" rel="noreferrer">Core Guidelines C.2</a> — designråd om class, struct og invariants.</li>
        <li><a href="https://eel.is/c++draft/class" target="_blank" rel="noreferrer">Standardudkast: classes</a> — selve klassesystemet og adgangsreglerne.</li>
        <li><a href="https://eel.is/c++draft/class.base.init" target="_blank" rel="noreferrer">Standardudkast: initialisering af medlemmer</a> — konstruktionsrækkefølgen.</li>
        <li><a href="https://eel.is/c++draft/class.mfct.non.static" target="_blank" rel="noreferrer">Standardudkast: non-static member functions</a> — const og medlemsfunktioner.</li>
      </ul>
      <p>Kilderne skelner mellem sprogregler og designråd. Det løbende standardudkast kan indeholde nyere funktioner end C++20; vores eksempler bruger C++20.</p>
    </LessonLayout>
  )
}
