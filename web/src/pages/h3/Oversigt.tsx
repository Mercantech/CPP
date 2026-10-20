import { Link } from 'react-router-dom'
import Callout from '../../components/Callout'
import LessonIntro from '../../components/LessonIntro'
import LessonLayout from '../../components/LessonLayout'
import { h3Objectives } from '../../data/lessons'

const route = [
  {
    to: '/h3/funktioner',
    num: '02',
    title: 'Funktioner',
    desc: 'Egne funktioner, parametre, return — hold loop() tynd',
  },
  {
    to: '/h3/datatyper',
    num: '03',
    title: 'Datatyper',
    desc: 'int, long, float, bool, char — og hvorfor millis() kræver unsigned long',
  },
  {
    to: '/h3/scope',
    num: '04',
    title: 'Global vs lokal',
    desc: 'Synlighed, levetid og static som kompromis',
  },
  {
    to: '/h3/filer',
    num: '05',
    title: 'Filopdeling',
    desc: '.h / .cpp, include guards, build-flow — i dybden',
  },
  {
    to: '/h3/kodestandarder',
    num: '06',
    title: 'Kodestandarder',
    desc: 'Navne, formatering, kommentarer, non-blocking loop',
  },
  {
    to: '/h3/refaktorering',
    num: '07',
    title: 'Refaktorering',
    desc: 'Før/efter-workshop med knap/LED og temperatur',
  },
  {
    to: '/h3/videnstjek',
    num: '08',
    title: 'Videnstjek',
    desc: 'Quiz på læringsmålene — gemmes i browseren',
  },
]

export default function Oversigt() {
  return (
    <LessonLayout module="h3">
      <h1>Struktureret kode i C++ til Arduino</h1>
      <LessonIntro>
        <p>
          Når projekter vokser, bliver alt-i-<code>loop()</code> uoverskueligt. H3 handler om at
          skrive kode, andre (og dig selv) kan læse, genbruge og fejlsøge — med samme disciplin som i
          større C++-projekter.
        </p>
      </LessonIntro>

      <h2>Læringsmål</h2>
      <ul className="objectives">
        {h3Objectives.map((o) => (
          <li key={o.id}>
            <span className="objectives__id">#{o.id}</span>
            <span>{o.text}</span>
          </li>
        ))}
      </ul>

      <h2>Hvorfor struktureret kode?</h2>
      <div className="why-grid">
        <div className="why-card">
          <h3>Læsbarhed</h3>
          <p>Små navngivne dele fortæller intentionen hurtigere end én lang procedure.</p>
        </div>
        <div className="why-card">
          <h3>Færre fejl</h3>
          <p>Fejl sidder i én funktion eller ét modul — nemmere at isolere og teste.</p>
        </div>
        <div className="why-card">
          <h3>Genbrug</h3>
          <p>
            <code>blinkLED</code> eller <code>readTemperature</code> kan flytte til næste sketch.
          </p>
        </div>
        <div className="why-card">
          <h3>Samarbejde</h3>
          <p>Fælles stil og filopdeling gør det muligt at arbejde flere på samme projekt.</p>
        </div>
      </div>

      <Callout type="tip">
        <p>
          Brug <strong>Præsentér</strong> i værktøjslinjen, når du underviser — indholdet splits i
          slides ved hvert H2.
        </p>
      </Callout>

      <h2>Ruten gennem H3</h2>
      <div className="path-list path-list--lesson">
        {route.map((r) => (
          <Link key={r.to} className="path-row" to={r.to}>
            <span className="path-row__num">{r.num}</span>
            <span className="path-row__body">
              <span className="path-row__label">{r.title}</span>
              <span className="path-row__desc">{r.desc}</span>
            </span>
            <span className="path-row__arrow" aria-hidden>
              →
            </span>
          </Link>
        ))}
      </div>
    </LessonLayout>
  )
}
