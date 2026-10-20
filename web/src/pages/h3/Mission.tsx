import { Link } from 'react-router-dom'
import Callout from '../../components/Callout'
import CodeBlock from '../../components/CodeBlock'
import LessonLayout from '../../components/LessonLayout'
import { signalStationSolution } from '../../data/mission'

export default function Mission() {
  return <LessonLayout module="h3">
    <p className="eyebrow">H3 / 08 / BYG NOGET, DU KAN FORKLARE</p>
    <h1>Mission: Signalstation.</h1>
    <p className="lesson-lead">En knap. En LED. Tre tilstande. Du bygger en lille station, som reagerer på tryk, mens den holder sin egen rytme. Nu skal typer, funktioner og tidsstyring spille sammen.</p>
    <div className="lesson-meta"><span>2–3 timer</span><span>1–2 elever</span><span>UNO R3 + trykknap</span></div>
    <h2>Opgaven fra din kunde</h2>
    <p>Et værksted skal bruge en indikator med tre tilstande. Den starter i <strong>RO</strong>, hvor LED'en er slukket. Ét tryk skifter til <strong>PULS</strong>, hvor LED'en skifter hver 500 ms. Næste tryk vælger <strong>ALARM</strong>, med skift hver 150 ms. Et tredje tryk går tilbage til RO. Et langt tryk skal tælle som ét tryk.</p>
    <p>Intervallerne er tid mellem skift, så den fulde blinkperiode er 1000 ms i PULS og 300 ms i ALARM. Hver ny tilstand starter med slukket LED; det første lysskift kommer efter ét interval. Tilstanden skal skrives til Serial Monitor ved opstart og ved hvert tilstandsskift — uden at oversvømme output på hver tur i <code>loop()</code>.</p>
    <h2>Forbind det enkelt</h2>
    <p>Brug den indbyggede LED via <code>LED_BUILTIN</code>. Forbind trykknappen mellem <strong>digital pin 2 og GND</strong>, og brug <code>INPUT_PULLUP</code>. Modstanden i mikrocontrolleren holder pinnen HIGH, når knappen ikke trykkes; et tryk forbinder til GND, så du læser LOW. Brug knappens datablad eller gennemgangsmåling til at finde de ben, som faktisk forbindes ved tryk.</p>
    <Callout type="tip"><p>Start uden tidsstyring: udskriv <code>digitalRead(2)</code> med et roligt interval og kontroller, at du får HIGH ved slip og LOW ved tryk. Fjern ventetiden, når du går videre til den responsive løsning.</p></Callout>
    <h2>Fire milepæle, du kan demonstrere</h2>
    <div className="mission-grid"><div className="mission-card"><p className="eyebrow">01 / BESKRIV</p><h3>Tegn tilstandene</h3><p>Tegn RO → PULS → ALARM → RO. Skriv, hvilken hændelse der skifter tilstand, og hvad hver tilstand gør ved LED'en.</p></div><div className="mission-card"><p className="eyebrow">02 / AFGRÆNS</p><h3>Lav funktionernes kontrakter</h3><p>Én funktion finder et nyt tryk, én vælger næste tilstand, og én opdaterer LED. <code>loop()</code> binder det sammen.</p></div><div className="mission-card"><p className="eyebrow">03 / UNDERSØG</p><h3>Fjern blokeringerne</h3><p>Læs <code>millis()</code> én gang pr. tur. Brug unsigned tidsforskelle. En LED må ikke stoppe læsningen af knappen.</p></div><div className="mission-card"><p className="eyebrow">04 / FORKLAR</p><h3>Bevis adfærden</h3><p>Afprøv korte og lange tryk og hurtige slip. Gem en lille tabel med forventning, observation og næste ændring.</p></div></div>
    <h2>Fra et niveau til en hændelse</h2>
    <p>En knap kan være LOW gennem tusindvis af ture i <code>loop()</code>. Et tilstandsskift ved hvert LOW giver derfor mange skift. Du skal opdage <strong>overgangen</strong> fra stabilt HIGH til stabilt LOW. Kontakten kan også prelle: signalet skifter kort frem og tilbage ved et fysisk tryk.</p>
    <p>En enkel debounce-model husker seneste rå aflæsning. Når den ændrer sig, startes en 30 ms stabilitetsperiode forfra. Først når den samme rå værdi har været set gennem hele perioden, accepteres den som en ny stabil tilstand. Funktionen giver kun en trykhændelse, hvis den nye stabile værdi er LOW. Slip skal også stabiliseres, før næste tryk kan registreres.</p>
    <Callout type="info"><p>30 ms er et startvalg til dette forsøg, ikke en universel naturlov for knapper. Meget korte tryk eller slip kan filtreres væk. Hvis knappen holdes nede under opstart, bliver det i referenceforslaget registreret som ét tryk, når signalet er stabilt.</p></Callout>
    <h2>Vælg din udfordring</h2>
    <ul><li><strong>Basis:</strong> Implementér tre tilstande og et stabilt tryk, som skifter præcis én gang. Hold alle funktioner i én sketch, mens du finder adfærden.</li><li><strong>Byg videre:</strong> Flyt knaplogikken til <code>button.h</code> og <code>button.cpp</code>. Bevar samme adfærd og forklar, hvilke variabler der kan være private i implementationen.</li><li><strong>Udfordring:</strong> Tilføj et langt tryk på mindst to sekunder som en separat hændelse. Beslut først, om et kort tryk udløses ved tryk eller ved slip, så et langt tryk ikke utilsigtet giver begge hændelser.</li></ul>
    <p>Prøv <Link to="/laboratorium#millis">tidslaboratoriet</Link>, hvis wrap eller forskellen mellem et blink og et skift stadig er svær at se.</p>
    <details className="exercise"><summary>Hint · Gør tilstandene til en type</summary><CodeBlock>{`enum class Mode { idle, pulse, alarm };
Mode mode = Mode::idle;

// En enum class goer mulige tilstande tydelige.
// Brug switch til at beskrive de tre overgange.`}</CodeBlock><p><code>enum class</code> grupperer navngivne værdier i en særskilt type. Du undgår at skulle huske, at eksempelvis tallet 2 betyder alarm. Enum'en sørger for typen; du skriver selv reglerne for overgangene.</p></details>
    <h2>Hvornår er løsningen færdig?</h2>
    <div className="lesson-table-scroll"><table className="datatype-table"><thead><tr><th>Forsøg</th><th>Forventet adfærd</th></tr></thead><tbody><tr><td>Genstart uden tryk</td><td>RO, LED slukket, én opstartsbesked</td></tr><tr><td>Ét stabilt tryk</td><td>PULS, én besked, skift cirka hver 500 ms</td></tr><tr><td>Hold knappen i tre sekunder</td><td>Ingen gentagne tilstandsskift</td></tr><tr><td>Slip stabilt, tryk igen</td><td>ALARM, én besked, skift cirka hver 150 ms</td></tr><tr><td>Slip og tryk igen</td><td>RO og LED straks slukket efter accepteret tryk</td></tr><tr><td>Læs koden med en makker</td><td>I kan forklare scope, typer og alle funktioners ansvar</td></tr></tbody></table></div>
    <p>Kontrollér også, at der ikke er et langt <code>delay()</code> eller en venteløkke i den færdige løsning. I må gerne have debounce-forsinkelsen i reaktionstiden: filtreringen skal acceptere signalet, før tilstanden skifter.</p>
    <details className="exercise"><summary>Løsningsforslag · Samlet Arduino-sketch</summary><p>Forslaget er et udgangspunkt for samtale. Det bruger globale tilstandsdata for at holde H3-eksemplet enkelt. Din opgave på næste niveau er at flytte passende state ind i et modul. Tidsstempler bruger <code>unsigned long</code>, og sammenligninger bruger differencer hen over wrap. Programmet indhenter ikke missede blink.</p><CodeBlock>{signalStationSolution}</CodeBlock><a className="btn btn--ghost" href="/examples/h3/Signalstation/Signalstation.ino" download>Hent løsningsforslag (.ino)</a><p>Gem i mappen <code>Signalstation</code>, så sketch og mappe har samme navn. Verificér og upload i Arduino IDE med dit board valgt.</p></details>
    <h2>Aflever noget, du kan stå på mål for</h2>
    <ul><li>Kildekode med beskrivende navne og kort begrundelse for valgte typer.</li><li>Et tilstandsdiagram og din udfyldte afprøvningstabel.</li><li>Tre minutters demonstration: respons under blink, langt tryk og en fejl, du fandt og rettede.</li><li>En refleksion: hvad ville du ændre, hvis der kom fem knapper og ti LED'er?</li></ul>
    <h2>Primære kilder</h2><ul><li><a href="https://docs.arduino.cc/built-in-examples/digital/Debounce/" target="_blank" rel="noreferrer">Arduino: Debounce</a></li><li><a href="https://docs.arduino.cc/built-in-examples/digital/StateChangeDetection/" target="_blank" rel="noreferrer">Arduino: State Change Detection</a></li><li><a href="https://docs.arduino.cc/built-in-examples/digital/InputPullupSerial/" target="_blank" rel="noreferrer">Arduino: INPUT_PULLUP og aktiv LOW-knap</a></li><li><a href="https://docs.arduino.cc/built-in-examples/digital/BlinkWithoutDelay/" target="_blank" rel="noreferrer">Arduino: Blink Without Delay</a></li></ul>
  </LessonLayout>
}
