import { Link } from 'react-router-dom'
import Callout from '../../components/Callout'
import CodeBlock from '../../components/CodeBlock'
import LessonLayout from '../../components/LessonLayout'

export default function Kontrolflow() {
  return <LessonLayout module="h3">
    <p className="eyebrow">H3 / 03 / BESLUTNINGER & GENTAGELSER</p>
    <h1>Lad data bestemme retningen.</h1>
    <p className="lesson-lead">En sensor giver dig et tal. Det interessante er, hvad dit program gør med tallet. Betingelser vælger en vej; løkker gentager et arbejde; arrays holder styr på flere værdier.</p>
    <h2>En betingelse er et spørgsmål</h2>
    <p><code>if</code> vælger en kodeblok, når et udtryk er sandt. Ved en kæde med <code>else if</code> undersøges betingelserne oppefra; den første sande gren vinder. Vælg dine grænser bevidst: <code>&gt;</code> udelukker grænsen, mens <code>&gt;=</code> medtager den.</p>
    <CodeBlock>{`// Eksempel inde i loop(): analogRead på UNO R3 giver 0..1023.
const int light = analogRead(A0);

if (light < 200) {
  Serial.println("Morkt");
} else if (light < 700) {
  Serial.println("Mellem");
} else {
  Serial.println("Lyst");
}`}</CodeBlock>
    <p>Ved værdien 200 er første spørgsmål falsk, så anden gren vælges. Ved 700 er de to første falske, så <code>else</code> vælges. Det er et godt sted at starte en test: lige under grænsen, på grænsen og lige over.</p>
    <Callout type="warn"><p><code>if (mode = 1)</code> tildeler værdien 1; <code>if (mode == 1)</code> sammenligner. Begge kan være lovlig C++, men de gør noget forskelligt. Brug compileradvarsler og kig efter, om du stiller et spørgsmål eller ændrer en værdi.</p></Callout>
    <h2>Logik uden dobbeltarbejde</h2>
    <p><code>&amp;&amp;</code> kræver, at begge sider er sande. <code>||</code> kræver, at mindst én er sand. <code>!</code> vender sand til falsk og omvendt. De logiske operatorer kortslutter: ved <code>&amp;&amp;</code> springes højre side over, hvis venstre er falsk. Det kan beskytte en beregning.</p>
    <CodeBlock>{`const int count = 0;
const int total = 42;

// Divisionen evalueres ikke, når count er 0.
if (count != 0 && total / count > 10) {
  // Gennemsnittet er over 10.
}

// Et interval: den samme værdi skal opfylde BEGGE krav.
const bool valid = light >= 0 && light <= 1023;`}</CodeBlock>
    <p>Den sidste linje forudsætter variablen <code>light</code> fra det foregående eksempel. Skriv ikke <code>0 &lt;= light &lt;= 1023</code>: C++ læser først venstre sammenligning som en bool-værdi og sammenligner derefter 0 eller 1 med 1023.</p>
    <h2>Arrays: flere værdier, ét navn</h2>
    <p>Et array har en fast størrelse. <code>samples[0]</code> er første element, og i et array med fem elementer er <code>samples[4]</code> det sidste. Indeks 5 er udenfor. Indbyggede C++-arrays laver ikke automatisk grænsekontrol: adgang udenfor kan give udefineret adfærd, også selv om programmet tilsyneladende kører.</p>
    <CodeBlock>{`// Et selvstændigt Arduino-program: faste testdata.
const int SAMPLE_COUNT = 5;
const int samples[SAMPLE_COUNT] = { 500, 510, 490, 505, 495 };

void setup() {
  Serial.begin(9600);
  long total = 0;

  for (int i = 0; i < SAMPLE_COUNT; ++i) {
    total += samples[i];
  }

  const float average = static_cast<float>(total) / SAMPLE_COUNT;
  Serial.println(average);  // 500.00
}

void loop() {
  // Intet arbejde her i dette ene forsog.
}`}</CodeBlock>
    <p>Læs <code>for</code> i fire trin: opret <code>i = 0</code> én gang; test <code>i &lt; SAMPLE_COUNT</code>; udfør kroppen; øg <code>i</code>. Gentag testen. Betingelsen er <code>&lt;</code>, fordi det sidste gyldige indeks er én mindre end antallet. Vi bruger <code>long</code> til summen, så der er plads, hvis antallet af 10-bit målinger vokser på et board med 16-bit <code>int</code>.</p>
    <div className="lesson-table-scroll"><table className="datatype-table"><caption>Spor løkken med de faste testdata</caption><thead><tr><th>i</th><th>samples[i]</th><th>total efter addition</th></tr></thead><tbody><tr><td>0</td><td>500</td><td>500</td></tr><tr><td>1</td><td>510</td><td>1010</td></tr><tr><td>2</td><td>490</td><td>1500</td></tr><tr><td>3</td><td>505</td><td>2005</td></tr><tr><td>4</td><td>495</td><td>2500</td></tr></tbody></table></div>
    <h2>Range-for, når indekset ikke er interessant</h2>
    <p>Når du kun har brug for værdierne i et lokalt array, kan en range-for udtrykke hensigten mere direkte. Størrelsen er kendt her. Et råt array, der sendes som en almindelig funktionsparameter, omdannes typisk til en pointer, og størrelsen følger ikke automatisk med — derfor skal en funktion have en længde eller et mere præcist interface.</p>
    <CodeBlock>{`// Samme sum, uden at skrive indeks selv:
long total = 0;
for (const int sample : samples) {
  total += sample;
}`}</CodeBlock>
    <p>I H5 møder du <code>std::array</code> og <code>std::vector</code>, som gør størrelse og ejerskab mere tydeligt. På H3 bruger vi små faste arrays og holder øje med boardets begrænsede RAM.</p>
    <h2>En løkke skal have en vej ud</h2>
    <p><code>while</code> gentager, så længe betingelsen er sand. Et program med <code>while (digitalRead(...))</code> kan blive hængende, mens du venter på en knap. Så kan resten af <code>loop()</code> ikke udføre arbejde. En kort, afgrænset <code>for</code>-løkke over fem værdier er noget andet end en ubegrænset venteløkke.</p>
    <CodeBlock>{`// Arduino loop() kaldes allerede igen og igen.
void loop() {
  const bool pressed = digitalRead(2) == LOW; // INPUT_PULLUP
  if (pressed) {
    // Arbejd kort med tilstanden og returner til loop().
  }
  // Her kan andre opgaver stadig blive undersogt.
}`}</CodeBlock>
    <p>Dette uddrag forudsætter <code>pinMode(2, INPUT_PULLUP)</code> i <code>setup()</code>. Det reagerer på et niveau, ikke ét enkelt tryk. I <Link to="/h3/mission">signalstationen</Link> skal du både filtrere kontaktprel og opdage overgangen til trykket.</p>
    <h2>Værksted: mål, sammenlign og forklar</h2>
    <p><strong>Basis:</strong> Brug de fem testmålinger til at finde antallet af værdier på mindst 500. Skriv det forventede resultat før du kører koden.</p>
    <details className="exercise"><summary>Hint og kontrol · Basis</summary><CodeBlock>{`int count = 0;
for (const int sample : samples) {
  if (sample >= 500) {
    ++count;
  }
}
// For testdataene: 3. Kontroller ogsa vaerdien 500.`}</CodeBlock></details>
    <p><strong>Byg videre:</strong> Find minimum og maksimum uden at sortere. Hvad skal dine startværdier være, hvis alle målinger er positive? Og hvis alle er negative?</p>
    <details className="exercise"><summary>Hint · Minimum og maksimum</summary><p>Start begge med <code>samples[0]</code> og gennemløb de øvrige. Det kræver, at arrayet ikke er tomt. For de viste data er minimum 490 og maksimum 510. Initialisering af minimum til 0 ville give et forkert resultat her.</p></details>
    <p><strong>Udfordring:</strong> Udskift de faste værdier med fem kald til <code>analogRead(A0)</code>. Sammenlign gennemsnittet med hver enkelt måling. Dokumentér, hvad gennemsnittet kan dæmpe, og hvad det ikke kan fortælle om fejlkalibrering.</p>
    <details className="exercise"><summary>Hint · Gennemsnit er ikke kalibrering</summary><p>Tilfældig støj kan udjævnes. En systematisk fejl følger med alle målingerne og fjernes ikke ved at tage deres gennemsnit. Lad en sensor være stabil, gem testdata og diskuter også forsinkelsen, når du samler målinger over tid.</p></details>
    <h2>Kan du forklare det uden at køre det?</h2>
    <ul><li>Hvilke indeks læses ved <code>i &lt;= SAMPLE_COUNT</code>, og hvorfor er det forkert?</li><li>Hvorfor bliver gennemsnittet ikke mere præcist af bare at skifte destinationen til <code>float</code>, hvis divisionen allerede var en heltalsdivision?</li><li>Hvornår er tre separate <code>if</code>-sætninger passende, og hvornår skal grenene være en <code>if / else if / else</code>-kæde?</li></ul>
    <h2>Primære kilder</h2><ul><li><a href="https://docs.arduino.cc/language-reference/en/structure/control-structure/for/" target="_blank" rel="noreferrer">Arduino: for-løkken</a></li><li><a href="https://docs.arduino.cc/built-in-examples/analog/Smoothing/" target="_blank" rel="noreferrer">Arduino: Smoothing med arrays og gennemsnit</a></li><li><a href="https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#es71-prefer-a-range-for-statement-to-a-for-statement-when-there-is-a-choice" target="_blank" rel="noreferrer">C++ Core Guidelines: range-for og tydelig hensigt</a></li></ul>
  </LessonLayout>
}
