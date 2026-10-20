import { useEffect, useRef } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import PresentMode from '../../components/PresentMode'
import { DatatyperContent } from './Datatyper'
import { FilerContent } from './Filer'
import { FunktionerContent } from './Funktioner'
import { KodestandarderContent } from './Kodestandarder'
import { OversigtContent } from './Oversigt'
import { RefaktoreringContent } from './Refaktorering'
import { ScopeContent } from './Scope'
import { VidenstjekContent } from './VidenstjekPage'

const chapters = [
  { id: 'oversigt', num: '01', title: 'Oversigt', Content: OversigtContent },
  { id: 'funktioner', num: '02', title: 'Funktioner', Content: FunktionerContent },
  { id: 'datatyper', num: '03', title: 'Datatyper', Content: DatatyperContent },
  { id: 'scope', num: '04', title: 'Global vs lokal', Content: ScopeContent },
  { id: 'filer', num: '05', title: 'Filopdeling', Content: FilerContent },
  { id: 'kodestandarder', num: '06', title: 'Kodestandarder', Content: KodestandarderContent },
  { id: 'refaktorering', num: '07', title: 'Refaktorering', Content: RefaktoreringContent },
  { id: 'videnstjek', num: '08', title: 'Videnstjek', Content: VidenstjekContent },
] as const

export default function Praesentation() {
  const contentRef = useRef<HTMLElement>(null)
  const [params] = useSearchParams()
  const auto = params.get('auto') !== '0'

  useEffect(() => {
    document.title = 'H3 · Fuld præsentation | CPP'
  }, [])

  return (
    <div className="deck-page">
      <header className="deck-page__banner">
        <div>
          <p className="deck-page__eyebrow">H3 · Samlet præsentation</p>
          <h1 className="deck-page__heading">Hele pensummet som ét slideshow</h1>
          <p className="deck-page__lead">
            Fra oversigt til videnstjek — samme rækkefølge som i navigationsmenuen. Brug piletasterne
            eller Næste/Forrige. Esc lukker; F er fuldskærm.
          </p>
        </div>
        <div className="deck-page__actions">
          <PresentMode
            contentRef={contentRef}
            autoOpen={auto}
            compactChrome
            buttonLabel="Start slideshow"
          />
          <Link className="btn btn--ghost" to="/h3">
            Tilbage til H3
          </Link>
        </div>
      </header>

      <article ref={contentRef} className="deck-page__content lesson prose" aria-label="H3 deck">
        <h2 className="deck-chapter">H3 · Struktureret C++ til Arduino</h2>
        <p>
          Velkommen. Dette slideshow følger hele H3-pensummet i én sammenhængende gennemgang —
          baseret på Mercantech Oplà-templaten.
        </p>

        {chapters.map(({ id, num, title, Content }) => (
          <section key={id} className="deck-section" data-chapter={id}>
            <h2 className="deck-chapter">
              {num} · {title}
            </h2>
            <Content />
          </section>
        ))}

        <h2 className="deck-chapter">Tak — næste skridt</h2>
        <p>
          Åbn templaten i PlatformIO, hold <code>main.cpp</code> tynd, og byg videre i moduler. Quizzen
          på videnstjek-siden virker bedst uden for slideshow (interaktive knapper).
        </p>
        <p>
          <Link to="/h3/videnstjek">Gå til videnstjek →</Link>
        </p>
      </article>
    </div>
  )
}
