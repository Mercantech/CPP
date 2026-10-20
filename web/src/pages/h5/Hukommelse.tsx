import { Link } from 'react-router-dom'
import Callout from '../../components/Callout'
import CodeBlock from '../../components/CodeBlock'
import LessonLayout from '../../components/LessonLayout'
import { fileCode, memoryCode } from './codeExamples'

export default function Hukommelse() {
  return (
    <LessonLayout module="h5">
      <p className="eyebrow">H5 · 02 · 3–4 timer</p>
      <h1>Hukommelse uden mavepine</h1>
      <p className="lead">
        C++ beder dig tage stilling til, hvor længe noget findes, og hvem der har ansvaret for
        det. Du behøver ikke starte med at administrere rå hukommelse. Start med værdier,
        afgrænsede lån og typer, som rydder op efter sig selv.
      </p>
      <ul className="objectives">
        <li><span className="objectives__id">01</span><span>Skeln mellem scope, levetid og ejerskab.</span></li>
        <li><span className="objectives__id">02</span><span>Vælg mellem værdi, const-reference, reference og valgfri pointer.</span></li>
        <li><span className="objectives__id">03</span><span>Forklar RAII og flyt et unique_ptr-ejerskab uden at skabe et ugyldigt lån.</span></li>
      </ul>

      <h2>Tre spørgsmål, du skal kunne besvare</h2>
      <div className="lesson-table-scroll">
        <table>
          <thead><tr><th>Begreb</th><th>Spørgsmål</th><th>Eksempel</th></tr></thead>
          <tbody>
            <tr><td>Scope</td><td>Hvor kan navnet bruges i kildekoden?</td><td>Et navn deklareret inde i en if-blok er normalt kun synligt i den blok.</td></tr>
            <tr><td>Levetid</td><td>Hvornår eksisterer et gyldigt objekt?</td><td>En lokal Reading eksisterer fra sin initialisering til scope-slut.</td></tr>
            <tr><td>Ejerskab</td><td>Hvilken kode har ansvaret for at afslutte ressourcens brug?</td><td>En vector ejer sine elementer; et unique_ptr ejer sit dynamiske objekt.</td></tr>
          </tbody>
        </table>
      </div>
      <p>
        Et navn kan være synligt, selv om det peger på noget, der ikke længere eksisterer. Det
        er præcis derfor, scope alene ikke er nok til at bevise, at en pointer er sikker.
        Omvendt kan et dynamisk objekt fortsætte med at eksistere, efter dets første ejers navn
        er ude af scope, hvis ejerskabet blev flyttet til en anden ejer.
      </p>
      <CodeBlock>{`Reading* borrowed = nullptr;
{
    Reading local{21.0};
    borrowed = &local;
    // borrowed maa bruges her.
}
// local er destrueret. borrowed er nu dangling.
// print(*borrowed); // FEJL: maa ikke koeres, selv om borrowed ikke er nullptr.
`}</CodeBlock>
      <Callout type="danger"><p>En ikke-null pointer er ikke et bevis på et levende objekt. At læse gennem en dangling pointer har undefined behavior: sproget stiller ikke krav til resultatet. Et program, der ser ud til at virke én gang, kan stadig være forkert.</p></Callout>

      <h2>Værdi: dit udgangspunkt</h2>
      <p>
        En almindelig lokal værdi er ofte det rigtige valg: <code>Reading reading{'{'}20.0{'}'};</code>.
        Du får en enkel levetid og automatisk destruktion. Du kan returnere en værdi fra en
        funktion uden at udlevere en reference til funktionens lokale objekt.
      </p>
      <CodeBlock>{`Reading makeReading() {
    return Reading{23.5}; // Returnerer et vaerdiresultat, ikke et laan.
}

Reading copy = original;  // Et nyt objekt.
Reading& alias = original; // Samme objekt gennem et andet navn.
`}</CodeBlock>
      <p>
        Hvis du ændrer <code>copy</code>, ændrer du ikke <code>original</code>. Hvis du ændrer
        gennem <code>alias</code>, ændrer du originalen. En reference kan ikke senere sættes
        til at referere til et andet objekt: <code>alias = copy</code> tildeler værdien til
        originalen. En pointervariabel kan derimod skifte, hvilket objekt den peger på.
      </p>
      <p>
        Undgå reglen “class på heap, struct på stack”. Begge kan have forskellig lagringsvarighed.
        Et lokalt <code>std::vector</code>-objekt har eksempelvis automatisk levetid, samtidig med
        at det administrerer dynamisk lager til sine elementer. Ordene stack og heap kan hjælpe
        med implementationens layout, men ejerskab og objektlevetid er de vigtigste sprogmodeller her.
      </p>

      <h2>Lån i en funktions signatur</h2>
      <div className="lesson-table-scroll">
        <table>
          <thead><tr><th>Parameter</th><th>Hensigt i denne kode</th><th>Dit ansvar som kalder</th></tr></thead>
          <tbody>
            <tr><td><code>Reading value</code></td><td>Funktionen arbejder med sin egen værdi.</td><td>Forstå kopierings- eller flytteomkostningen.</td></tr>
            <tr><td><code>const Reading&amp; value</code></td><td>Påkrævet, læsende lån.</td><td>Objektet skal være gyldigt under brugen.</td></tr>
            <tr><td><code>Reading&amp; value</code></td><td>Påkrævet lån, som funktionen må ændre.</td><td>Forvent en ændring af dit objekt.</td></tr>
            <tr><td><code>const Reading* value</code></td><td>Valgfrit, læsende lån; nullptr betyder ingen værdi.</td><td>Send en gyldig adresse eller nullptr.</td></tr>
          </tbody>
        </table>
      </div>
      <p>
        Dette er API-konventioner, vi vælger; en rå pointer beskriver ikke automatisk ejerskab
        i sproget. Vores lånefunktioner gemmer ikke referencen eller pointeren til senere brug.
        Det gør levetidskontrakten enkel: kalderens objekt skal leve under funktionskaldet.
      </p>
      <CodeBlock>{`void calibrate(Reading& reading, double offset) {
    reading.celsius += offset; // Synlig aendring hos kalderen.
}

void printIfPresent(const Reading* reading) {
    if (reading != nullptr) {
        std::cout << reading->celsius << '\\n';
    }
}
`}</CodeBlock>
      <p>
        <code>&amp;reading</code> som et udtryk tager en adresse. <code>*pointer</code> giver
        adgang til det objekt, pointeren peger på. <code>pointer-&gt;celsius</code> svarer til
        <code> (*pointer).celsius</code>. Tjek den valgfrie pointer, før den derefereres.
        En gyldig reference har ikke en tilsvarende “ingen værdi”-tilstand.
      </p>
      <details className="exercise">
        <summary>const-puslespil: hvad må du ændre?</summary>
        <CodeBlock>{`const Reading* first = &original; // Objektet laeses gennem first; first kan flyttes.
Reading* const second = &original; // second bliver her; objektet maa aendres.
const Reading& third = original; // Laesende alias til original.
`}</CodeBlock>
        <p>Const gælder den adgang, du har. En anden, ikke-const adgang kan stadig ændre det underliggende objekt, hvis selve objektet oprindeligt er ikke-const.</p>
      </details>

      <h2>RAII: bind ressourcen til et objekt</h2>
      <p>
        RAII står for <em>Resource Acquisition Is Initialization</em>. Et ressourceejende objekt
        etablerer eller overtager en ressource og frigiver den igen i sin destructor. En fil
        kan have et åbent operativsystemhåndtag; en vector kan have et dynamisk lager. De har
        forskellige ressourcer, men samme nyttige levetidsidé.
      </p>
      <p>
        Når almindelige lokale objekter forlader scope, destrueres de i omvendt konstruktionsrækkefølge.
        Det sker også for færdigkonstruerede lokale objekter under normal exception-unwinding.
        Derfor behøver hver fejlvej ikke sin egen manuelle oprydningssekvens.
      </p>
      <p>
        <strong>C#-broen:</strong> du kan sammenligne hensigten med <code>using</code> og
        <code> IDisposable</code>. I C++ er den deterministiske destructor en del af almindelige
        objektlevetider. Det er ikke en garbage collector, der på et ubestemt tidspunkt finder
        et uopnåeligt objekt.
      </p>

      <h2>unique_ptr: når dynamisk ejerskab er nødvendigt</h2>
      <p>
        Har du brug for et dynamisk objekt med én ejer, så brug <code>std::unique_ptr</code>.
        <code> std::make_unique</code> opretter objektet og giver en ejer tilbage. Ejerens
        destructor frigiver objektet. Du skriver hverken rå <code>new</code> eller
        <code> delete</code> i dette forløb.
      </p>
      <CodeBlock>{`auto owner = std::make_unique<Reading>(Reading{23.0});
// auto duplicate = owner; // Compilefejl: ejerskab kan ikke kopieres.
auto nextOwner = std::move(owner);
// owner er nu tom. nextOwner ejer stadig det samme Reading-objekt.
`}</CodeBlock>
      <p>
        <code>std::move</code> gør udtrykket egnet til flytning. Det er unique_ptrs flyttekonstruktion,
        der faktisk overfører ejerskabet og gør kilden tom. Antag ikke, at alle andre flyttede
        typer bliver tomme på samme måde; deres kontrakter kan være anderledes.
      </p>
      <p>
        <code>owner.get()</code> giver en rå pointer til et lån. Den skaber ikke en ny ejer og
        forlænger ikke levetiden. Flytningen ovenfor flytter ejerskabet, ikke Reading-objektet,
        så et tidligere lån kan stadig være gyldigt, mens nextOwner ejer objektet. Et
        <code> reset()</code> eller ejerens destruktion vil gøre lånet ugyldigt.
      </p>
      <Callout type="tip"><p>Spørg først, om en almindelig værdi eller vector allerede løser problemet. unique_ptr vises for at lære ejerskab; en enkelt lokal Reading i sensorprojektet behøver normalt ingen dynamisk allokering.</p></Callout>

      <h2>Kør laboratoriet og tegn ejerskabet</h2>
      <p><a href="/examples/h5/hukommelse.cpp" download>Hent hukommelse.cpp</a>. Tegn kasser for objekterne og pile for lån. Brug en anden piletype til ejerskab. Sæt kryds ved det tidspunkt, hvor et objekt destrueres.</p>
      <CodeBlock>{memoryCode}</CodeBlock>
      <CodeBlock language="text">{`20.5 C
20 C
Ingen maaling
23 C
owner er tom: true
23 C
`}</CodeBlock>
      <p>Der er to selvstændige lokale Reading-objekter og ét dynamisk Reading-objekt i dette eksempel. alias er ikke et ekstra Reading-objekt. Den rå observer-pointer ejer intet.</p>

      <h2>En fil er også en ressource</h2>
      <p>
        <code>std::ofstream</code> er en ejer af en filforbindelse. Dens oprydning beskytter
        scope-udgange, men en rapport er først nyttig, når du også opdager skrivefejl. Derfor
        kontrollerer vi åbningen og udfører flush og close, mens programmet stadig kan reagere
        på deres fejlstatus. Destructor-oprydning alene er ikke en kvittering for en vellykket skrivning.
      </p>
      <p><a href="/examples/h5/filer.cpp" download>Hent filer.cpp</a>. Eksemplet opretter eller overskriver <code>report.txt</code> i programmets aktuelle arbejdsmappe.</p>
      <CodeBlock>{fileCode}</CodeBlock>
      <p>
        Ved succes skrives <code>Skrev report.txt</code>. Åbn filen og kontrollér header og
        datalinje. Hvis en exception forlader writeReport før close, bliver det lokale filobjekt
        stadig destrueret under unwinding. Vi skriver ikke en ekstra catch alene for at lukke filen.
      </p>

      <h2>Værksted: lån med en slutdato</h2>
      <details className="exercise">
        <summary>Øvelse 1 · kopien, lånet og originalen (20 min)</summary>
        <p>Forudsig værdierne efter tre kald: calibrate på copy, calibrate på alias, og print på original. Kør og forklar hver ændring med en tegning.</p>
        <p><strong>Accept:</strong> tegningen viser forskellige objekter for kopien og originalen, men samme objekt for alias og original.</p>
        <details><summary>Hint</summary><p>Sæt breakpoint lige før hvert kald. Se på værdierne. Du behøver ikke sammenligne numeriske adresser for at forstå modellen.</p></details>
      </details>
      <details className="exercise">
        <summary>Øvelse 2 · reparér et farligt API (30 min)</summary>
        <p>En funktion returnerer <code>const std::string&amp;</code> til sin egen lokale navnestreng. Forklar fejlen uden at køre ugyldig kode. Ret signaturen og implementeringen til at returnere en værdi.</p>
        <p><strong>Accept:</strong> kalderen må bruge resultatet efter funktionens afslutning. Forklar, hvorfor const-reference ikke i sig selv redder den lokale strengs levetid.</p>
        <details><summary>Hint</summary><p>En reference, der returneres fra funktionen, forlænger ikke automatisk dens lokale objekts levetid. Lad kalderen få et std::string-resultat, som selv ejer sin tekst.</p></details>
      </details>
      <details className="exercise">
        <summary>Øvelse 3 · flyt en ejer, og luk alle lån (30 min)</summary>
        <p>Udvid laboratoriet med en ekstra scope-blok omkring nextOwner. Flyt ejerskabet ind i blokken, brug Reading der, og sæt observer til nullptr før blokken slutter. Forklar, hvorfor nulstillingen af lånet ikke frigiver Reading.</p>
        <p><strong>Accept:</strong> der findes aldrig to unique_ptr-ejere til objektet, og intet lån derefereres efter destruktionen.</p>
        <details><summary>Ekstra udfordring</summary><p>Fjern make_unique og implementér samme beregning med en lokal Reading. Forklar, hvilken udgave du ville vælge til den konkrete brugssituation.</p></details>
      </details>
      <details className="exercise">
        <summary>Øvelse 4 · se RAII ske (25 min)</summary>
        <p>Lav en lille Trace-klasse, der udskriver et navn i constructor og destructor. Opret to Trace-objekter i en funktion og kast derefter std::runtime_error. Fang den i main.</p>
        <p><strong>Accept:</strong> forudsig og bekræft den omvendte destruktionsrækkefølge. Dine destructors må ikke kaste exceptions.</p>
        <details><summary>Hint</summary><p>Giv hvert objekt sin egen std::string. Du skal ikke selv eje nogen rå ressource i denne observationsøvelse.</p></details>
      </details>

      <h2>Stop op og forklar</h2>
      <details className="exercise"><summary>Skal en funktion modtage unique_ptr, hvis den blot vil udskrive en måling?</summary><p>Nej. Et const Reading&amp; beskriver et påkrævet læsende lån, uden at koble funktionen til den konkrete ejer. En unique_ptr-parameter ved værdi ville signalere overførsel af ejerskab.</p></details>
      <details className="exercise"><summary>Er et lån sikkert, fordi det er const?</summary><p>Const begrænser ændringer gennem den adgang. Det garanterer ikke, at ejeren lever længe nok. Levetiden skal stadig være gyldig under hele brugen.</p></details>
      <Callout type="tip"><p>Næste levetidsfælde gemmer sig i en vector, der vokser. Fortsæt med <Link to="/h5/standardbibliotek">standardbiblioteket</Link>.</p></Callout>

      <h2>Læs videre i de primære kilder</h2>
      <ul>
        <li><a href="https://eel.is/c++draft/basic.life" target="_blank" rel="noreferrer">Standardudkast: object lifetime</a> — hvornår objekter eksisterer og må bruges.</li>
        <li><a href="https://eel.is/c++draft/unique.ptr.single" target="_blank" rel="noreferrer">Standardudkast: unique_ptr</a> — ejerskab, flytning og adgang.</li>
        <li><a href="https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#Rr-raii" target="_blank" rel="noreferrer">Core Guidelines R.1</a> — designråd om automatisk ressourcehåndtering.</li>
        <li><a href="https://eel.is/c++draft/file.streams" target="_blank" rel="noreferrer">Standardudkast: file streams</a> — filobjekter, lukning og fejlstatus.</li>
      </ul>
    </LessonLayout>
  )
}
