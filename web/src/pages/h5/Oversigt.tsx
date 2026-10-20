import { Link } from 'react-router-dom'
import Callout from '../../components/Callout'
import CodeBlock from '../../components/CodeBlock'
import LessonLayout from '../../components/LessonLayout'
import { cmakeCode } from './codeExamples'

export default function Oversigt() {
  return (
    <LessonLayout module="h5">
      <p className="eyebrow">H5 · Desktop · C++20</p>
      <h1>Fra kode, der virker, til C++ du kan stole på</h1>
      <p className="lead">
        Du har opdelt Arduino-kode i funktioner og filer. Nu flytter vi værkstedet over på din
        computer: rigtige objekter, tydeligt ejerskab, standardbiblioteket og en sensorlog, der
        kan overleve både dårlige input og din makkers næste ændring.
      </p>
      <Callout type="info">
        <p>
          <strong>H3 og H5 har forskellige rammer.</strong> H3 bruger Arduino og boardets
          værktøjer. H5 bruger en desktopcompiler med C++20, <code>main()</code> og
          standardbiblioteket. Her findes ingen <code>setup()</code>, <code>loop()</code> eller
          Arduino <code>String</code>. Vores <code>std::string</code> er en anden type.
        </p>
      </Callout>

      <h2>Din mission: byg et lille kontrolrum</h2>
      <p>
        En skole vil følge temperaturerne i sine værksteder. Data kommer fra sensorer, men
        analyseprogrammet skal kunne udvikles uden tilsluttet hardware. Din opgave er at indlæse
        målinger, afvise ødelagte data og give en forståelig rapport. Senere kan en Arduino levere
        filen; først gør du modellen og beregningerne solide med et fast datasæt.
      </p>
      <ul className="objectives">
        <li><span className="objectives__id">01</span><span>Design en type, hvis objekter altid har en gyldig tilstand.</span></li>
        <li><span className="objectives__id">02</span><span>Forklar forskellen på en værdi, et lån og et ejerskab.</span></li>
        <li><span className="objectives__id">03</span><span>Brug vector, string og algoritmer til at behandle et datasæt.</span></li>
        <li><span className="objectives__id">04</span><span>Byg og fejlfind et C++20-program med advarsler slået til.</span></li>
        <li><span className="objectives__id">05</span><span>Dokumentér din løsning med konkrete input, output og grænsetilfælde.</span></li>
      </ul>

      <h2>Ruten gennem H5</h2>
      <p>
        Planlæg cirka 15–22 timers arbejde inklusive projekt. Tiderne er vejledende; tag
        forklaringspauserne alvorligt. Du er klar til næste trin, når du kan forklare dit valg
        med et eksempel og selv ændre programmet.
      </p>
      <div className="lesson-table-scroll">
        <table>
          <thead><tr><th>Checkpoint</th><th>Tid</th><th>Det skal du kunne vise</th></tr></thead>
          <tbody>
            <tr><td>0 · Værktøjer og bro fra C#</td><td>1–2 t</td><td>Et program, du selv kan bygge, køre og ændre.</td></tr>
            <tr><td><Link to="/h5/objekter">1 · Objekter med regler</Link></td><td>3–4 t</td><td>En klasse med invariant, constructor og const-metoder.</td></tr>
            <tr><td><Link to="/h5/hukommelse">2 · Hukommelse og ejerskab</Link></td><td>3–4 t</td><td>Et levetidsdiagram og et korrekt lån af en ressource.</td></tr>
            <tr><td><Link to="/h5/standardbibliotek">3 · Data i standardbiblioteket</Link></td><td>3–4 t</td><td>En vector-pipeline med validering, statistik og sortering.</td></tr>
            <tr><td><Link to="/h5/projekt">4 · Sensorlog: byg og forsvar</Link></td><td>5–8 t</td><td>En kørende konsolapp med tydelige fejl og dokumenteret kvalitet.</td></tr>
          </tbody>
        </table>
      </div>

      <h2>Det har du med fra C# og H3</h2>
      <p>
        Du skal kunne bruge variabler, betingelser, løkker og funktioner. Fra H3 skal du kende
        forskellen på en deklaration og en definition samt formålet med en headerfil. Hvis
        filopdeling er rusten, genbesøg <Link to="/h3/filer">H3: filer og includes</Link>.
      </p>
      <div className="lesson-table-scroll">
        <table>
          <thead><tr><th>Du kender måske</th><th>I C++ skal du undersøge</th></tr></thead>
          <tbody>
            <tr><td>C# class og referencer</td><td>En C++ class kan være et lokalt værdiobjekt. Tildeling kopierer normalt værdien, hvis typen kan kopieres.</td></tr>
            <tr><td>Garbage collector</td><td>Objekter med automatisk levetid destrueres ved scope-slut. Ressourceejere rydder op i deres destructor.</td></tr>
            <tr><td>List&lt;T&gt;</td><td>std::vector&lt;T&gt; ejer en sammenhængende sekvens; vækst kan flytte elementerne.</td></tr>
            <tr><td>using / IDisposable</td><td>RAII gør oprydning til en del af objektets levetid, også for medlemmer som filer og vektorer.</td></tr>
            <tr><td>LINQ</td><td>Algoritmer og ranges udtrykker søgning, filtrering og sortering. Deres mutation og levetid skal stadig forstås.</td></tr>
          </tbody>
        </table>
      </div>

      <h2>Værktøjskassen: første desktopprogram</h2>
      <p>
        Du skal bruge en C++20-kompatibel compiler. På Windows kan du bruge Visual Studios
        C++-værktøjer og Developer PowerShell. På Linux kan du bruge GCC eller Clang. CMake er
        buildbeskrivelsen, der lader det samme projekt bruge forskellige compilere; CMake er
        ikke selv compileren. Brug skolens installerede værktøjer eller aftal installation med underviseren.
      </p>
      <p>Opret en tom mappe og gem dette som <code>main.cpp</code>:</p>
      <CodeBlock>{`#include <iostream>

int main() {
    const double temperature = 23.5;
    std::cout << "SensorLab online: " << temperature << " C\\n";
}
`}</CodeBlock>
      <p>
        <code>#include</code> gør deklarationerne fra en header tilgængelige. <code>std::</code>
        fortæller, at navnet hører til standardbibliotekets namespace. Programmet starter i
        <code> main</code>; når det når funktionens slutning, returnerer det her status 0 til
        operativsystemet. Det er ikke en Arduino-sketch, som et framework kalder igen og igen.
      </p>
      <p>Gem derefter dette som <code>CMakeLists.txt</code> ved siden af <code>main.cpp</code>:</p>
      <p><a href="/examples/h5/main.cpp" download>Hent main.cpp</a> og <a href="/examples/h5/CMakeLists.txt" download>CMakeLists.txt</a>, hvis du vil starte fra filerne.</p>
      <CodeBlock language="cmake">{cmakeCode}</CodeBlock>
      <CodeBlock language="powershell">{`cmake -S . -B build
cmake --build build --config Debug
# Visual Studio-generator paa Windows:
.\\build\\Debug\\sensorlab.exe
# Enkeltkonfigurationsgenerator paa Linux/macOS:
./build/sensorlab
`}</CodeBlock>
      <p>
        Kør kun den sidste kommando, som passer til din generator. Med Ninja på Windows ligger
        filen typisk i <code>build\sensorlab.exe</code>. Læs buildoutputtet frem for at gætte
        filstien. Hvis CMake allerede har valgt en forkert compiler, konfigurér i en ny buildmappe.
      </p>
      <details className="exercise">
        <summary>Alternativ: byg én fil direkte med compilerens kommandolinje</summary>
        <p>GCC/Clang-lignende kommandolinje (brug <code>clang++</code>, hvis det er din compiler):</p>
        <CodeBlock language="bash">{`g++ -std=c++20 -Wall -Wextra -Wpedantic main.cpp -o sensorlab
./sensorlab
`}</CodeBlock>
        <p>MSVC i Developer PowerShell:</p>
        <CodeBlock language="powershell">{`cl /std:c++20 /EHsc /W4 /permissive- /utf-8 main.cpp /Fe:sensorlab.exe
.\\sensorlab.exe
`}</CodeBlock>
        <p>En normal terminal kan mangle MSVC's miljøvariabler. Brug dens udviklerterminal.</p>
      </details>

      <h2>Læs fejlen som en detektiv</h2>
      <ol>
        <li><strong>Buildfejl:</strong> find første relevante fejl, fil og linje. En manglende semikolon kan skabe ti følgefejl.</li>
        <li><strong>Linkerfejl:</strong> kontrollér, at definitionens .cpp-fil indgår i dit executable, og at signaturerne matcher.</li>
        <li><strong>Runtimefejl:</strong> skriv input og forventet output ned. Sæt et breakpoint før den første forkerte værdi.</li>
        <li><strong>Logisk fejl:</strong> reducer datasættet til det mindste eksempel, hvor svaret stadig er forkert.</li>
      </ol>
      <details className="exercise">
        <summary>Startøvelse · få compileren på dit hold (20–30 min)</summary>
        <ol>
          <li>Byg programmet og gem outputtet.</li>
          <li>Fjern et semikolon. Find den første fejl og ret den.</li>
          <li>Ændr temperaturen og tilføj en grænseværdi. Udskriv ALARM, når temperaturen er større end grænsen.</li>
          <li>Prøv præcis grænsen. Aftal, om den er alarm eller OK, og begrund din sammenligningsoperator.</li>
        </ol>
        <details><summary>Hint</summary><p>Brug en <code>const double</code> til grænsen. Test under, på og over grænsen; én vellykket kørsel er ikke tre grænsetests.</p></details>
      </details>

      <h2>Sådan arbejder du med materialet</h2>
      <p>
        Før du kører et eksempel, forudsig outputtet. Kør det, og forklar én linje, som overraskede
        dig. Lav derefter en ændring uden at kopiere en løsning. I par skiftes I til at være
        udvikler og reviewer: revieweren spørger til gyldige tilstande, ejerskab og tomme datasæt.
        Byt roller efter hvert checkpoint.
      </p>
      <Callout type="tip"><p>Dit stærkeste afleveringsbevis er en lille ændring, du kan lave og forklare live. Start med <Link to="/h5/objekter">objekter med regler</Link>.</p></Callout>

      <h2>Kilder og værktøjsreferencer</h2>
      <ul>
        <li><a href="https://cmake.org/cmake/help/latest/command/target_compile_features.html" target="_blank" rel="noreferrer">CMake: target_compile_features</a> — hvorfor vi kræver C++20 på et bestemt target.</li>
        <li><a href="https://gcc.gnu.org/onlinedocs/gcc/Warning-Options.html" target="_blank" rel="noreferrer">GCC: Warning Options</a> — betydningen af advarselsflagene.</li>
        <li><a href="https://learn.microsoft.com/en-us/cpp/build/reference/std-specify-language-standard-version?view=msvc-170" target="_blank" rel="noreferrer">Microsoft: /std og sprogversioner</a> — C++20 med MSVC.</li>
      </ul>
      <p>H5 holder sig bevidst til C++20. Links til det løbende standardudkast kan også beskrive senere standarder; følg eksemplerne og den angivne sprogversion.</p>
    </LessonLayout>
  )
}
