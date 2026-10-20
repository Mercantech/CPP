import { Link } from 'react-router-dom'
import CodeBlock from '../components/CodeBlock'
import { lessonModules } from '../data/lessons'
import { useProgress } from '../lib/progress'

const tracks = [
  { id: 'h3', tag: '01 / HARDWARE & HÅNDVÆRK', title: 'Få koden til at leve.', text: 'Fra den første funktion til en responsiv signalstation. Lær at tænke i typer, tilstande og små, stærke byggesten.', chips: ['Arduino', 'Funktioner', 'Bits & bytes'], action: 'Åbn H3', to: '/h3', code: 'void loop()' },
  { id: 'h5', tag: '02 / MODERNE C++', title: 'Tag kontrollen.', text: 'Forstå objekter, levetid og ejerskab. Byg en sensorlog med standardbiblioteket og lad RAII passe på ressourcerne.', chips: ['C++20', 'RAII', 'std::vector'], action: 'Åbn H5', to: '/h5', code: 'std::move(ideas)' },
]

export default function Home() {
  const { progress } = useProgress()
  const last = lessonModules.flatMap((module) => module.items).find((item) => item.path === progress.lastPath)
  return (
    <>
      <section className="workshop-hero" aria-labelledby="hero-title">
        <div className="workshop-hero__copy">
          <p className="eyebrow"><span className="status-dot" /> MERCANTEC / H3 + H5 / C++</p>
          <h1 id="hero-title">Tættere på<br /><span>maskinen.</span><br />Længere med koden.</h1>
          <p className="workshop-hero__lead">Her bliver nysgerrighed til kode. Byg noget, du kan tænde. Forstå hver byte. Og opdag, hvorfor et lille <code>++</code> åbner en stor verden.</p>
          <div className="cta-row">
            <Link className="btn btn--primary" to={last?.path ?? '/h3'}>{last ? `Fortsæt: ${last.label}` : 'Find dit første byggeprojekt'} <span aria-hidden>→</span></Link>
            <Link className="btn btn--ghost" to="/laboratorium">&gt;_ Prøv laboratoriet</Link>
          </div>
          <div className="hero-footnote"><span>Du behøver ikke kunne det hele.</span> Du skal bare være klar til at prøve.</div>
        </div>
        <div className="hero-editor" aria-label="Eksempel på en Arduino-sketch">
          <div className="hero-editor__tabs"><span><i /> <i /> <i /></span><span>nysgerrighed.ino</span><span>C++</span></div>
          <div className="hero-editor__intro"><img src="/brand/cplusplus.svg" width="48" height="48" alt="C++" /><span>SMÅ LINJER.<br /><strong>STOR FORSKEL.</strong></span></div>
          <CodeBlock language="cpp">{`// Dit næste øjeblik: "Aha!"
const int LED_PIN = LED_BUILTIN;

void setup() {
  pinMode(LED_PIN, OUTPUT);
}

void loop() {
  digitalWrite(LED_PIN, HIGH);
  delay(500);
  digitalWrite(LED_PIN, LOW);
  delay(500);
}`}</CodeBlock>
          <div className="hero-editor__footer"><span className="status-dot" /> Ét blink. To tilstande. Dit første system.</div>
          <div className="hero-sticker"><strong>while (curious)</strong><span>keepBuilding();</span></div>
        </div>
      </section>
      <div className="concept-strip" aria-label="Forløbets nøglebegreber"><span>DET HER KOMMER DU TIL AT FORSTÅ</span><code>types</code><code>functions()</code><code>&references</code><code>objects</code><code>RAII</code></div>
      <section className="tracks-section" aria-labelledby="tracks-title">
        <div className="section-heading"><div><p className="eyebrow">DIT NÆSTE NIVEAU</p><h2 id="tracks-title">To forløb. Masser af aha.</h2></div><p>Læs det. Forudsig det. Byg det.<br />Så sidder det fast.</p></div>
        <div className="track-grid">{tracks.map((track) => {
          const lessons = lessonModules.find((module) => module.module === track.id)!.items
          const completed = lessons.filter((item) => progress.completed.includes(item.path)).length
          return <Link className={`track-card track-card--${track.id}`} to={track.to} key={track.id}>
            <div className="track-card__top"><span className="eyebrow">{track.tag}</span><span className="track-card__level">{track.id.toUpperCase()}</span></div>
            <h3>{track.title}</h3><p>{track.text}</p>
            <div className="track-card__chips">{track.chips.map((chip) => <span key={chip}>{chip}</span>)}</div>
            <div className="track-card__bottom"><span>{track.action} <span aria-hidden>↗</span></span><code>{track.code}</code></div>
            {completed > 0 && <p className="track-card__progress">{completed} af {lessons.length} trin gennemført</p>}
          </Link>
        })}</div>
      </section>
      <section className="lab-banner" aria-labelledby="lab-banner-title">
        <div className="lab-banner__symbol" aria-hidden>&amp;</div>
        <div><p className="eyebrow">MINDRE GÆTTERI. MERE EKSPERIMENT.</p><h2 id="lab-banner-title">Hvad sker der egentlig i hukommelsen?</h2><p>Se forskellen på en kopi og en reference. Skru på bits. Send uret rundt om nul. Tre små laboratorier, hvor du styrer næste skridt.</p><Link className="btn btn--warm" to="/laboratorium">Gå på opdagelse <span aria-hidden>→</span></Link></div>
      </section>
      <section className="learning-principles" aria-label="Sådan arbejder vi"><div><span>01</span><h3>Forudsig først</h3><p>Hvad tror du, koden gør? En forkert hypotese er en god begyndelse.</p></div><div><span>02</span><h3>Ændr én ting</h3><p>Byg, kør og undersøg forskellen. Fejl er data, du kan lære af.</p></div><div><span>03</span><h3>Forklar til en makker</h3><p>Når du kan forklare hvorfor, har du mere end et program, der virker.</p></div></section>
      <Link className="history-link" to="/historie"><span>FRA BELL LABS TIL DIT SKRIVEBORD</span><strong>Et dansk navn. Et globalt sprog.</strong><span>Mød historien bag C++ →</span></Link>
    </>
  )
}
