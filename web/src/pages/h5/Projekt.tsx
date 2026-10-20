import { Link } from 'react-router-dom'
import Callout from '../../components/Callout'
import CodeBlock from '../../components/CodeBlock'
import LessonLayout from '../../components/LessonLayout'
import { projectCmakeCode, projectData, projectDockerCode, projectHeaderCode, projectMainCode, projectModelCode } from './codeExamples'

export default function Projekt() {
  return (
    <LessonLayout module="h5">
      <p className="eyebrow">H5 · 04 · Projekt · 5–8 timer</p>
      <h1>SensorLog: dit eget kontrolrum</h1>
      <p className="lead">
        Byg en C++20-konsolapp, der kan modtage en fil fra skolens værksteder og fortælle,
        hvad temperaturen faktisk har været. En god løsning giver både det rigtige svar og
        en tydelig forklaring, når input ikke kan bruges.
      </p>
      <Callout type="info"><p>Dette er et desktopprojekt. Du behøver ingen Arduino, seriel port eller ekstern tjeneste. Når analyseprogrammet virker, kan du senere lade en Arduino levere samme filformat.</p></Callout>

      <h2>Opgaven fra værkstedet</h2>
      <p>
        Teknisk service har flere sensorer og vil vide, om der er for varmt i lokalerne.
        Filerne kan indeholde negative tidspunkter, ødelagte temperaturer og ufuldstændige
        linjer. Din app skal beholde de gyldige målinger, rapportere de afviste og beregne
        minimum, maksimum, gennemsnit og antal målinger over en aftalt alarmgrænse.
      </p>
      <p>
        Du må bygge videre på starterprojektet nedenfor. Det bygger og kører allerede, læser
        filen og validerer målinger. <strong>Statistik, sensorfilter og eksport er dit arbejde.</strong>
        Start med en fungerende kerne, og udvid i små skridt, som du kan demonstrere.
      </p>

      <h2>Dataformatet er en kontrakt</h2>
      <p>Gem som <code>measurements.csv</code>. Filen bruger et enkelt CSV-format uden citerede felter: tre felter pr. linje, komma som separator og punktum som decimaltegn.</p>
      <CodeBlock language="csv">{projectData}</CodeBlock>
      <ul>
        <li>Første linje er præcis <code>sensor,second,celsius</code>.</li>
        <li>Sensor-id er mindst ét ASCII-bogstav, ciffer, bindestreg eller underscore.</li>
        <li>Second er et heltal fra 0 og op. Celsius er endelig og mellem −50 og 150 inklusive.</li>
        <li>En ugyldig datalinje afvises med linjenummer; de andre linjer behandles stadig.</li>
        <li>En manglende fil eller ugyldig header er en filfejl, som afslutter med status 1.</li>
        <li>En fil med korrekt header og ingen datalinjer er et gyldigt, tomt datasæt.</li>
      </ul>
      <p>
        Starteren bevarer dubletter og filens rækkefølge. Beskriv denne politik i din README,
        eller udvid den med en klar regel for dubletter. Antag ikke, at CSV generelt er så
        enkelt: rigtige CSV-varianter kan tillade citering og separatorer inde i felter. Dette
        undervisningsformat gør netop disse ekstra regler unødvendige i første version.
      </p>

      <h2>Hent et kørende udgangspunkt</h2>
      <p><a className="btn btn--primary" href="/examples/h5/sensorlog-start.zip" download>Hent hele starterprojektet (.zip)</a></p>
      <p>Pak filen ud i en ny mappe. De enkelte filer kan også hentes her:</p>
      <ul>
        <li><a href="/examples/h5/projekt/main.cpp" download>main.cpp</a> — filgrænse, parser og konsoloutput.</li>
        <li><a href="/examples/h5/projekt/SensorLog.hpp" download>SensorLog.hpp</a> — modellens offentlige interface.</li>
        <li><a href="/examples/h5/projekt/SensorLog.cpp" download>SensorLog.cpp</a> — validering og ejerskab af målingerne.</li>
        <li><a href="/examples/h5/projekt/CMakeLists.txt" download>CMakeLists.txt</a> — projektets buildbeskrivelse.</li>
        <li><a href="/examples/h5/projekt/measurements.csv" download>measurements.csv</a> — fast datasæt med bevidste fejl.</li>
        <li><a href="/examples/h5/projekt/Dockerfile" download>Dockerfile</a> — byg og kør det samme program i en container.</li>
      </ul>
      <CodeBlock language="powershell">{`cmake -S . -B build
cmake --build build --config Debug
# Visual Studio-generator; koer fra mappen med measurements.csv:
.\\build\\Debug\\sensorlog.exe measurements.csv
# Enkeltkonfigurationsgenerator paa Linux/macOS:
./build/sensorlog measurements.csv
`}</CodeBlock>
      <p>Med Ninja på Windows er stien typisk <code>build\sensorlog.exe</code>. Se <Link to="/h5">startguiden</Link> for værktøjskæder og forskellen på generatorer.</p>
      <details className="exercise">
        <summary>Alternativ: byg starteren direkte eller brug Docker</summary>
        <CodeBlock language="bash">{`g++ -std=c++20 -Wall -Wextra -Wpedantic main.cpp SensorLog.cpp -o sensorlog
./sensorlog measurements.csv
`}</CodeBlock>
        <p>Docker fra startermappen, når Docker er tilgængelig:</p>
        <CodeBlock language="bash">{`docker build -t cpp-sensorlog .
docker run --rm cpp-sensorlog
`}</CodeBlock>
        <p>Den medfølgende fil kopieres ind i containeren under build. Byg billedet igen, hvis du ændrer kode eller dette datasæt. Docker er en ekstra måde at køre på; det ændrer ikke programmets krav til input.</p>
        <CodeBlock language="dockerfile">{projectDockerCode}</CodeBlock>
      </details>

      <h2>Forstå grænsen mellem input og model</h2>
      <p>
        Parseren oversætter tekst til tal. Modellen afgør, om tallene og sensornavnet giver
        mening i dette domæne. Det er to forskellige ansvar: <code>"-1"</code> er et gyldigt
        heltal i C++, men et ugyldigt tidspunkt i vores log.
      </p>
      <CodeBlock>{projectHeaderCode}</CodeBlock>
      <p>
        Loggen ejer en vector med målinger. Den giver kun et const-lån tilbage til læsere.
        Modellen skal leve under lånet, og du må ikke fortsætte med at bruge elementlån efter
        ændringer, der gør dem ugyldige. <code>add</code> tager en værdi, så loggen kan overtage
        den lagrede målings tekst.
      </p>
      <CodeBlock>{projectModelCode}</CodeBlock>
      <p>
        Måling er en åben datapakke ved inputgrænsen; loggens invariant er, at dens lagrede
        målinger har bestået valideringen. Metoden returnerer false ved forventet ugyldigt
        input. Du kan senere give en mere præcis fejltype eller genbruge Celsius fra
        <Link to="/h5/objekter"> objektlektionen</Link>, men vær tydelig om, hvor reglerne bor.
      </p>
      <details className="exercise">
        <summary>Se hele main.cpp med parseren</summary>
        <CodeBlock>{projectMainCode}</CodeBlock>
        <p><code>std::optional&lt;T&gt;</code> indeholder enten en T-værdi eller ingen værdi. En optional med heltallet 0 er stadig en tilstedeværende værdi. Operatoren <code>*</code> bruges først, når optional er kontrolleret.</p>
        <p>parseNumber er en færdig hjælpefunktion med en typeparameter, så samme mønster kan bruges til int og double. Du behøver ikke implementere et generelt templatebibliotek for at løse opgaven.</p>
        <p>Parseren kræver, at hele talfeltet er brugt. Derfor bliver <code>12abc</code> afvist. Kortslutningen i if-udtrykket sikrer også, at en tom optional ikke derefereres.</p>
      </details>
      <details className="exercise"><summary>Se CMakeLists.txt</summary><CodeBlock language="cmake">{projectCmakeCode}</CodeBlock><p>Begge .cpp-filer skal indgå i targetet. Headeren indeholder deklarationerne; SensorLog.cpp giver de definitioner, linkeren skal bruge.</p></details>

      <h2>Checkpoint 1: få et ærligt basissvar</h2>
      <p><strong>30–45 min.</strong> Byg starteren uændret, og kontrollér resultatet. Der er fire gyldige målinger og to afviste linjer. Fejlbeskeder sendes til stderr, resultatet til stdout; deres indbyrdes visningsrækkefølge kan variere.</p>
      <CodeBlock language="text">{`# stdout fra starteren:
Gyldige: 4, afvist: 2
A @ 0 s: 21.5 C
B @ 1 s: 24 C
A @ 2 s: 19.5 C
A @ 3 s: 26 C

# stderr:
Afvist linje 6
Afvist linje 7
`}</CodeBlock>
      <details className="exercise"><summary>Vis checkpointet til din makker</summary><p>Ændr én temperatur i filen og byg eller kør relevant igen. Peg på den kode, som afviser tidspunktet −1, og den kode, som afviser teksten fejl. Forklar, hvorfor de to fejl opdages forskellige steder.</p></details>

      <h2>Checkpoint 2: beregn uden at opfinde data</h2>
      <p>
        <strong>60–90 min.</strong> Design et statistikresultat med min, max, gennemsnit og
        alarmantal. Lav en læsende modeloperation, der returnerer statistik eller “ingen data”.
        Brug algoritmer fra <Link to="/h5/standardbibliotek">standardbiblioteket</Link>, hvor
        de gør koden klarere. Alarm betyder strengt større end 23,0 °C i grundopgaven.
      </p>
      <div className="lesson-table-scroll">
        <table>
          <thead><tr><th>For det medfølgende datasæt</th><th>Forventet resultat</th></tr></thead>
          <tbody>
            <tr><td>Gyldige / afviste</td><td>4 / 2</td></tr>
            <tr><td>Minimum / maksimum</td><td>19,50 °C / 26,00 °C</td></tr>
            <tr><td>Gennemsnit</td><td>22,75 °C</td></tr>
            <tr><td>Alarmer over 23,0 °C</td><td>2</td></tr>
          </tbody>
        </table>
      </div>
      <details className="exercise"><summary>Hint: et resultat med en tilstand</summary><p>Overvej en struct Statistics og <code>std::optional&lt;Statistics&gt;</code>. Nullopt kan repræsentere tomt datasæt. En tom logs minimum er ikke automatisk 0 °C: det ville være en opdigtet måling.</p></details>

      <h2>Checkpoint 3: vælg en sensor</h2>
      <p>
        <strong>45–60 min.</strong> Tilføj et sensorfilter uden at slette originaldata. Vælg
        selv en enkel brugerflade, eksempelvis et ekstra kommandolinjeargument eller en kort
        tekstmenu. Et ukendt sensor-id skal give en besked, som et menneske kan forstå.
      </p>
      <p>
        For sensor A alene er der tre gyldige målinger, gennemsnittet er cirka 22,33 °C, og
        én måling er over 23 °C. For sensor B er der én gyldig måling på 24 °C. De to afviste
        linjer skal stadig forklares som importfejl, ikke skjules af et visningsfilter.
      </p>
      <details className="exercise"><summary>Reviewspørgsmål</summary><p>Hvis din første filtrering ændrer loggens vector, hvad sker der, når brugeren bagefter vælger alle sensorer? Vis en løsning, hvor dataejer og præsentation ikke blandes sammen.</p></details>

      <h2>Checkpoint 4: eksport og fejlveje</h2>
      <p>
        <strong>60–90 min.</strong> Gem en kort rapport som tekst eller CSV. Brug en filtype,
        der håndterer ressourcen med RAII, og kontrollér også skrivefejl. Lad modellen
        beregne data, mens fil- og konsolkoden præsenterer dem. Se
        <Link to="/h5/hukommelse"> lektionen om filer og levetid</Link>.
      </p>
      <p>
        Hvis du vælger en menu, skal ugyldigt input kunne føre til en ny indtastning eller en
        tydelig afslutning. En EOF fra indtastningen er en tilstand, du også skal håndtere;
        ellers kan programmet sidde fast i en løkke, der aldrig modtager nye tegn.
      </p>

      <h2>Din afleveringskontrakt</h2>
      <ul>
        <li><strong>Bygbar:</strong> main, model, CMakeLists, Dockerfile og et eksempel-datasæt følger med. En anden elev kan bygge ud fra din README.</li>
        <li><strong>Korrekt:</strong> tallene ovenfor matcher, og alarmdefinitionen er skrevet ned.</li>
        <li><strong>Robust:</strong> tomme data, fejlformaterede tal og manglende filer giver forståelige svar.</li>
        <li><strong>Modelleret:</strong> vector ejer data; regler håndhæves ét tydeligt sted; læsende metoder er const.</li>
        <li><strong>Ressourcesikker:</strong> ingen rå new/delete og ingen lån til lokale objekter, der allerede er væk.</li>
        <li><strong>Forklaret:</strong> README viser buildkommando, filformat, resultater, fejlcases og én kendt begrænsning.</li>
      </ul>

      <h2>Prøv at ødelægge dit eget program</h2>
      <p>Gem input og faktisk output fra hver kontrol. Manuel afprøvning er tilstrækkelig i første version; tilføj små automatiske kontroller, når dine kernefunktioner er stabile.</p>
      <div className="lesson-table-scroll">
        <table>
          <thead><tr><th>Situation</th><th>Det skal du kunne demonstrere</th></tr></thead>
          <tbody>
            <tr><td>Kun korrekt header</td><td>Ingen gyldige målinger; ingen division med nul og ingen falske min/max-værdier.</td></tr>
            <tr><td>Én gyldig måling</td><td>Min, max og gennemsnit er den samme temperatur.</td></tr>
            <tr><td>−50 og 150 °C</td><td>Accepterede intervalgrænser; en værdi udenfor afvises.</td></tr>
            <tr><td>Præcis 23 °C</td><td>Ingen alarm med den aftalte strenge sammenligning.</td></tr>
            <tr><td>12abc, et ekstra felt eller forkert decimaltegn</td><td>Hele datalinjen afvises, og næste linje behandles.</td></tr>
            <tr><td>Ukendt sensorfilter</td><td>Tydelig “ingen data for denne sensor”-tilstand.</td></tr>
            <tr><td>Manglende fil, tom fil uden header</td><td>Filfejl med forklaring og mislykket exitstatus.</td></tr>
            <tr><td>Eksport til en sti, som ikke kan åbnes</td><td>Ingen falsk succesbesked; fejlen vises for brugeren.</td></tr>
          </tbody>
        </table>
      </div>

      <h2>Vælg dit næste niveau</h2>
      <div className="lesson-table-scroll">
        <table>
          <thead><tr><th>Niveau</th><th>Udvidelse</th><th>Fagligt fokus</th></tr></thead>
          <tbody>
            <tr><td>Kerne</td><td>Import, validering, statistik, filter og eksport.</td><td>En forklarlig løsning med korrekte grænser.</td></tr>
            <tr><td>Værkstedsmester</td><td>Rapport pr. sensor og valgfri alarmgrænse.</td><td>API-design, gruppering og genbrug af beregninger.</td></tr>
            <tr><td>Systembygger</td><td>Dubletpolitik, median og glidende gennemsnit.</td><td>Datasemantik, sortering og vinduers grænsetilfælde.</td></tr>
            <tr><td>Hardwarebro</td><td>En Arduino skriver samme format; desktopappen analyserer filen bagefter.</td><td>En tydelig kontrakt mellem to programmer med hver sine ressourcer.</td></tr>
          </tbody>
        </table>
      </div>
      <Callout type="tip"><p>Avanceret betyder her, at du kan begrunde og kontrollere løsningen. Et større program med uklart ejerskab er ikke et stærkere projekt end en lille, velforklaret app.</p></Callout>

      <h2>Demo: fem minutter som C++-udvikler</h2>
      <ol>
        <li>Vis en normal kørsel og forklar resultatet.</li>
        <li>Vis én ugyldig inputlinje og ét tomt datasæt.</li>
        <li>Peg på den type, der ejer målingerne, og forklar et konkret lån.</li>
        <li>Ændr alarmgrænsen eller én valideringsregel live.</li>
        <li>Forklar én begrænsning og den næste ændring, du ville lave.</li>
      </ol>
      <p>Efter demoen skal du kunne svare: hvad blev lettere at holde korrekt, fordi du valgte C++-typer og standardbiblioteket bevidst?</p>

      <h2>Primære referencer til projektet</h2>
      <ul>
        <li><a href="https://eel.is/c++draft/optional" target="_blank" rel="noreferrer">Standardudkast: optional</a> — et resultat kan være fraværende.</li>
        <li><a href="https://eel.is/c++draft/file.streams" target="_blank" rel="noreferrer">Standardudkast: file streams</a> — indlæsning, eksport og filressourcer.</li>
        <li><a href="https://cmake.org/cmake/help/latest/command/add_executable.html" target="_blank" rel="noreferrer">CMake: add_executable</a> — kilderne, som indgår i programmet.</li>
      </ul>
    </LessonLayout>
  )
}
