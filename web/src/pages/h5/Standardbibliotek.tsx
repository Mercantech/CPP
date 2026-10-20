import { Link } from 'react-router-dom'
import Callout from '../../components/Callout'
import CodeBlock from '../../components/CodeBlock'
import LessonLayout from '../../components/LessonLayout'
import { libraryCode } from './codeExamples'

export default function Standardbibliotek() {
  return (
    <LessonLayout module="h5">
      <p className="eyebrow">H5 · 03 · 3–4 timer</p>
      <h1>Standardbiblioteket er dit værksted</h1>
      <p className="lead">
        Du skal behandle målinger, ikke genopfinde en dynamisk liste eller en sorteringsalgoritme.
        Med vector, string og algoritmer kan koden vise opgavens hensigt. Til gengæld skal du
        kende kontrakterne: hvem ejer data, hvad ændres, og hvilke lån bliver ugyldige?
      </p>
      <ul className="objectives">
        <li><span className="objectives__id">01</span><span>Brug vector og string som ejende værdityper.</span></li>
        <li><span className="objectives__id">02</span><span>Behandl et datasæt med lambdaer, algoritmer og en tydelig rækkefølge.</span></li>
        <li><span className="objectives__id">03</span><span>Undgå ugyldige iteratorer, heltalsgennemsnit og fejl på tomme datasæt.</span></li>
      </ul>

      <h2>vector: en sekvens, som ejer sine elementer</h2>
      <p>
        <code>std::vector&lt;T&gt;</code> er en container til en sekvens af T-objekter. Elementerne
        ligger sammenhængende i hukommelsen. En vector har en størrelse, <code>size()</code>, og
        en kapacitet, <code>capacity()</code>, som beskriver, hvor mange elementer den kan have
        uden at allokere et nyt lager.
      </p>
      <CodeBlock>{`std::vector<double> temperatures{21.5, 24.0};
temperatures.push_back(19.5);

for (const double temperature : temperatures) {
    std::cout << temperature << '\\n';
}
`}</CodeBlock>
      <p>
        Range-for bruges, når du vil besøge elementerne frem for at manipulere et indeks.
        <code> const auto&amp; reading</code> giver typisk mening for en større Measurement med
        tekst, fordi hver iteration så læser det eksisterende objekt. Et lille double kan
        rimeligt kopieres med <code>const double</code>.
      </p>
      <div className="lesson-table-scroll">
        <table>
          <thead><tr><th>Operation</th><th>Hvad den gør</th><th>Fælde</th></tr></thead>
          <tbody>
            <tr><td><code>push_back(value)</code></td><td>Tilføjer et element og øger size.</td><td>Kan udløse reallokering.</td></tr>
            <tr><td><code>reserve(n)</code></td><td>Sikrer plads til mindst n elementer.</td><td>Ændrer ikke size; vector er stadig tom, hvis den var tom før.</td></tr>
            <tr><td><code>resize(n)</code></td><td>Ændrer antallet af elementer.</td><td>Nye elementer skal kunne initialiseres.</td></tr>
            <tr><td><code>at(i)</code></td><td>Giver adgang med grænsekontrol.</td><td>Kaster std::out_of_range, hvis indekset ikke findes.</td></tr>
            <tr><td><code>operator[](i)</code></td><td>Giver direkte indeksadgang.</td><td>I C++20 skal du selv sikre, at i er mindre end size.</td></tr>
          </tbody>
        </table>
      </div>
      <Callout type="warn"><p>Efter <code>std::vector&lt;int&gt; values; values.reserve(10);</code> er <code>values.size()</code> stadig 0. Du må ikke skrive til <code>values[0]</code>. Brug push_back eller opret de ønskede elementer med resize.</p></Callout>

      <h2>string ejer tekst, et view gør ikke</h2>
      <p>
        <code>std::string</code> ejer sin tekst. En kopieret string har sin egen tekstværdi,
        så en senere ændring af kopien ikke ændrer originalen. Det passer godt til en måling,
        der skal gemme sit sensornavn, efter inputlinjen er blevet genbrugt.
      </p>
      <CodeBlock>{`std::string input = "Vaerksted";
std::string storedName = input;
input = "Nyt input";
// storedName er stadig "Vaerksted".
`}</CodeBlock>
      <p>
        Et <code>std::string_view</code> ejer derimod ikke teksten. Det kan være nyttigt til
        korte læsende lån, men må ikke overleve tekstens ejer eller en ændring, som gør dets
        buffer ugyldig. Gem ikke views til en genbrugt <code>std::getline</code>-buffer som
        langsigtede sensornavne i projektet.
      </p>
      <p>
        String er heller ikke det samme som et antal synlige bogstaver: <code>size()</code>
        tæller char-elementer. I en UTF-8-tekst kan ét dansk tegn optage flere bytes. Vi bruger
        ASCII-sensor-id'er i starterdata, så dataformatet og tegnsættet ikke blandes sammen med
        projektets første mål.
      </p>

      <h2>Algoritmer gør hensigten tydelig</h2>
      <p>
        Skal du tælle alarmer, så brug en tællealgoritme. Skal du sortere, så brug en
        sorteringsalgoritme. En håndskrevet løkke er stadig fin, når den er det klareste valg,
        men en velvalgt algoritme fjerner flere detaljer, som ellers kan blive forkerte.
      </p>
      <CodeBlock>{`const double alarmLimit = 23.0;
const auto alarms = std::ranges::count_if(readings,
    [alarmLimit](const Measurement& reading) {
        return reading.celsius > alarmLimit;
    });
`}</CodeBlock>
      <p>
        Det lille funktionsobjekt mellem firkantede parenteser og afsluttende klamme er en
        lambda. <code>[alarmLimit]</code> indfanger en kopi af grænsen. Parameteren er et
        læsende lån til én måling, og resultatet er et bool. Algoritmen kalder lambdaen for
        elementerne i sekvensen og tæller de sande resultater.
      </p>
      <p>
        Vælg eksplicit capture til små undervisningseksempler: så kan man se, hvilke ydre
        værdier funktionen afhænger af. En referencecapture som <code>[&amp;alarmLimit]</code>
        låner den ydre variabel; det lån bliver et problem, hvis lambdaen gemmes og bruges,
        efter variablen er væk. Vores algoritmekald bruger lambdaen med det samme.
      </p>
      <CodeBlock>{`std::ranges::sort(readings, {}, &Measurement::celsius);
`}</CodeBlock>
      <p>
        C++20's ranges-overload modtager hele containeren. Den tomme comparator-argumentliste
        <code> {'{}'}</code> vælger standardens mindre-end-orden, og projektionen
        <code> &amp;Measurement::celsius</code> vælger feltet, der sorteres efter. En comparator
        skal opføre sig som en konsistent streng orden; <code>&lt;=</code> er ikke en gyldig
        erstatning for <code>&lt;</code>.
      </p>
      <p>
        Sortering ændrer rækkefølgen i readings. Skal den oprindelige tidsrækkefølge bevares,
        så sortér en kopi eller vælg en anden strategi. <code>std::ranges::sort</code> lover
        heller ikke at bevare rækkefølgen mellem lige store temperaturer. Brug en ekstra
        sorteringsnøgle eller en stabil algoritme, hvis den orden er et krav.
      </p>

      <h2>En pipeline med tydelige grænser</h2>
      <ol>
        <li><strong>Indlæs:</strong> få input ind som tekst eller et fast datasæt.</li>
        <li><strong>Validér:</strong> afvis værdier, som modellen ikke tillader.</li>
        <li><strong>Håndtér tomhed:</strong> tomt input er en rigtig tilstand.</li>
        <li><strong>Beregn:</strong> sum, gennemsnit og alarmantal fra de samme gyldige målinger.</li>
        <li><strong>Præsenter:</strong> sortér eventuelt og skriv et forståeligt resultat.</li>
      </ol>
      <p>
        I laboratoriet er det ugyldige input −999 °C. Vi fjerner også ikke-endelige tal før
        beregning og sortering. NaN-værdier kan både ødelægge statistik og bryde den orden, som
        en almindelig flydende mindre-end-sammenligning skal opfylde ved sortering.
      </p>
      <CodeBlock>{`const double sum = std::accumulate(readings.begin(), readings.end(), 0.0,
    [](double total, const Measurement& reading) {
        return total + reading.celsius;
    });
`}</CodeBlock>
      <p>
        Startværdien <code>0.0</code> gør akkumuleringens sum til double. En startværdi på
        <code> 0</code> kan i denne algoritme give en heltalsakkumulator, der mister decimaler
        ved hvert trin. Når du dividerer med <code>readings.size()</code>, gør et eksplicit
        cast hensigten klar. Tjek først, at størrelsen ikke er nul.
      </p>

      <h2>Kør laboratoriet: sortér kontrolrummet</h2>
      <p><a href="/examples/h5/standardbibliotek.cpp" download>Hent standardbibliotek.cpp</a> og byg med C++20. Der er fire inputmålinger, men kun tre hører til det gyldige datasæt. Beregn gennemsnittet selv, før programmet gør det.</p>
      <CodeBlock>{libraryCode}</CodeBlock>
      <CodeBlock language="text">{`Gyldige: 3, afvist: 1
Gennemsnit: 21.67
Alarmer: 1
A: 19.50
A: 21.50
B: 24.00
`}</CodeBlock>
      <p>
        <code>std::erase_if</code> fjerner her de elementer, hvor predikatet er sandt, og
        returnerer antallet af fjernede elementer. Den ændrer containeren. <code>count_if</code>
        tæller uden at fjerne elementer. Det er en væsentlig forskel, selv om de begge bruger en lambda.
      </p>

      <h2>Iteratorer og lån kan udløbe ved en ændring</h2>
      <p>
        En iterator er en måde at bevæge sig gennem en sekvens på. <code>begin()</code> peger
        mod første element; <code>end()</code> repræsenterer positionen efter sidste element
        og må ikke derefereres. For en tom vector er begin lig end. Et find-resultat skal
        sammenlignes med end, før det bruges.
      </p>
      <CodeBlock>{`const auto found = std::ranges::find_if(readings, [](const Measurement& reading) {
    return reading.sensor == "B";
});
if (found != readings.end()) {
    std::cout << found->celsius << '\\n';
}
`}</CodeBlock>
      <div className="lesson-table-scroll">
        <table>
          <thead><tr><th>Ændring i vector</th><th>Hvad sker der med tidligere lån?</th></tr></thead>
          <tbody>
            <tr><td>Vækst med reallokering</td><td>Alle iteratorer, referencer og pointere til elementer bliver ugyldige.</td></tr>
            <tr><td>push_back uden reallokering</td><td>Lån til eksisterende elementer bevares, men den gamle end-iterator bliver ugyldig.</td></tr>
            <tr><td>erase</td><td>Iteratorer og referencer ved eller efter sletningspunktet bliver ugyldige.</td></tr>
            <tr><td>reserve med større kapacitet</td><td>Reallokering gør alle elementlån ugyldige. Et reserve-kald uden reallokering gør det ikke.</td></tr>
            <tr><td>sortering</td><td>Objekter omarrangeres. Et lån kan stadig referere til samme position, men målingen på positionen kan være en anden.</td></tr>
          </tbody>
        </table>
      </div>
      <Callout type="danger"><p>Gem ikke en reference til første måling og kald derefter push_back uden at kende invalidationsreglerne. Den robuste begyndermodel er: afslut ændringerne, og find derefter det element, du vil låne.</p></Callout>
      <p>
        Reserve er en kapacitetsplan, ikke en universel sikkerhedslås. Den forhindrer ikke
        invalidation fra alle operationer, og du kan senere overskride den reserverede kapacitet.
        Et indeks kan findes igen efter reallokering, men sortering og sletning kan ændre,
        hvilken logisk måling indekset identificerer. Brug et stabilt ID, hvis identiteten er vigtig.
      </p>

      <h2>Værksted: gør pipeline og fejl synlige</h2>
      <details className="exercise">
        <summary>Øvelse 1 · det tomme kontrolrum (25 min)</summary>
        <p>Kør med en tom vector, én gyldig måling og fire ugyldige målinger. Beskriv outputtet, før du kører.</p>
        <p><strong>Accept:</strong> ingen division med nul eller adgang til et ikke-eksisterende element. Én målings gennemsnit er dens egen temperatur.</p>
        <details><summary>Hint</summary><p>Hold tomhedstjekket efter filtreringen. Fire inputlinjer er ikke ensbetydende med fire gyldige målinger.</p></details>
      </details>
      <details className="exercise">
        <summary>Øvelse 2 · min, max og et meningsfuldt filter (35 min)</summary>
        <p>Udskriv minimum og maksimum med algoritmer. Tilføj en valgt sensor, og beregn statistik kun for den sensors målinger uden at slette originaldata.</p>
        <p><strong>Accept:</strong> et ukendt sensor-id giver en forklarende besked. Filtrering ændrer ikke den oprindelige vector.</p>
        <details><summary>Hint</summary><p>Du kan opbygge en ny vector med std::ranges::copy_if og std::back_inserter fra &lt;iterator&gt;. Brug samme tomhedskontrol på det filtrerede datasæt.</p></details>
      </details>
      <details className="exercise">
        <summary>Øvelse 3 · orden betyder noget (30 min)</summary>
        <p>Tilføj to lige varme målinger med forskellige tidspunkter. Sortér først efter temperatur og ved lighed efter second. Bevar den originale rækkefølge i en anden vector.</p>
        <p><strong>Accept:</strong> din comparator returnerer false, når den sammenligner en måling med sig selv. Forklar, hvorfor &lt;= ikke opfylder dette.</p>
        <details><summary>Hint</summary><p>Hvis temperaturerne er forskellige, sammenlignes de. Ellers sammenlignes tidspunktet. Sørg for at have afvist NaN, før du bygger denne orden.</p></details>
      </details>
      <details className="exercise">
        <summary>Øvelse 4 · undersøg reallokering uden undefined behavior (25 min)</summary>
        <p>Opret en vector, og udskriv size og capacity, mens du tilføjer 20 målinger. Notér, hvornår kapaciteten vokser. Gem ingen elementreferencer på tværs af ændringerne.</p>
        <p><strong>Accept:</strong> beskriv reallokeringsrisikoen uden at kræve en bestemt vækstfaktor fra implementationen.</p>
        <details><summary>Ekstra udfordring</summary><p>Gentag med reserve(20). Antallet af synlige kapacitetsændringer falder, men programmets korrekte resultat må ikke afhænge af en bestemt vækststrategi.</p></details>
      </details>

      <h2>Stop op og forklar</h2>
      <details className="exercise"><summary>Hvorfor er 0.0 vigtig i accumulate?</summary><p>Startværdien bestemmer akkumulatortypen. En int-akkumulator kan afkorte decimalsummer. Den forkerte type kan give et forkert svar, selv om det afsluttende resultat gemmes som double.</p></details>
      <details className="exercise"><summary>Er en sorteret vector en kopi af den oprindelige?</summary><p>Nej. sort ændrer den sekvens, du giver den. Lav en eksplicit kopi, hvis både originalens tidsrækkefølge og temperaturvisningen skal eksistere.</p></details>
      <Callout type="tip"><p>Nu har du værktøjerne til <Link to="/h5/projekt">Sensorlog-projektet</Link>: en model med regler, en ejer af data og en pipeline, du kan forklare.</p></Callout>

      <h2>Læs videre i de primære kilder</h2>
      <ul>
        <li><a href="https://eel.is/c++draft/vector.capacity" target="_blank" rel="noreferrer">Standardudkast: vector capacity</a> og <a href="https://eel.is/c++draft/vector.modifiers" target="_blank" rel="noreferrer">vector modifiers</a> — reserve, vækst og invalidation.</li>
        <li><a href="https://eel.is/c++draft/strings" target="_blank" rel="noreferrer">Standardudkast: strings</a> — string og string_view.</li>
        <li><a href="https://eel.is/c++draft/expr.prim.lambda" target="_blank" rel="noreferrer">Standardudkast: lambda expressions</a> — capture og funktionsobjekter.</li>
        <li><a href="https://eel.is/c++draft/alg.sorting" target="_blank" rel="noreferrer">Standardudkast: sorting</a> — comparatorens orden og sorteringskrav.</li>
        <li><a href="https://eel.is/c++draft/accumulate" target="_blank" rel="noreferrer">Standardudkast: accumulate</a> — startværdi og akkumulering.</li>
      </ul>
      <p>Det løbende udkast indeholder også nyere ændringer. Vi forudsætter C++20-kontrakter; eksempelvis er ugyldig operator[]-adgang ikke en automatisk, sikker exception.</p>
    </LessonLayout>
  )
}
