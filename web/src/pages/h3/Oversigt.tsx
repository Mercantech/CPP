import { Link } from 'react-router-dom'
import Callout from '../../components/Callout'
import LessonIntro from '../../components/LessonIntro'
import LessonLayout from '../../components/LessonLayout'
import { h3Objectives } from '../../data/lessons'
import { TEMPLATE_REPO_URL } from '../../data/projects'

const route = [
  {
    to: '/h3/funktioner',
    num: '02',
    title: 'Funktioner',
    desc: 'Modulers API — som readEnvironmentSensors og renderSensorScreen',
  },
  {
    to: '/h3/datatyper',
    num: '03',
    title: 'Datatyper',
    desc: 'float, bool, unsigned long — og SensorReading i types.h',
  },
  {
    to: '/h3/scope',
    num: '04',
    title: 'Global vs lokal',
    desc: 'Anonymt namespace i main.cpp, static, hvornår state må deles',
  },
  {
    to: '/h3/filer',
    num: '05',
    title: 'Filopdeling',
    desc: 'PlatformIO include/ + src/ — hele Oplà-modularkitekturen',
  },
  {
    to: '/h3/kodestandarder',
    num: '06',
    title: 'Kodestandarder',
    desc: 'Engelsk i kode, dansk i kommentarer, tynd main.cpp',
  },
  {
    to: '/h3/refaktorering',
    num: '07',
    title: 'Refaktorering',
    desc: 'Fra spaghetti til samme stil som templaten',
  },
  {
    to: '/h3/videnstjek',
    num: '08',
    title: 'Videnstjek',
    desc: 'Quiz på læringsmål + template-begreber',
  },
]

export function OversigtContent() {
  return (
    <>
      <h1>Struktureret C++ til Arduino (H3)</h1>
      <LessonIntro>
        <p>
          I kommer fra C#. Her træner I den samme disciplin — struktur, typer, ansvar — i C++ på
          Arduino. Pensummet bygger på jeres rigtige projekt-skabelon:{' '}
          <a href={TEMPLATE_REPO_URL} target="_blank" rel="noreferrer">
            Mercantech/H3 → Arduino
          </a>
          . Oplà IoT Carrier-demoen viser, hvordan professionel filopdeling ser ud i praksis.
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

      <h2>Template som facit</h2>
      <div className="why-grid">
        <div className="why-card">
          <h3>main.cpp</h3>
          <p>Kun wiring — læs, kald, returnér. Ingen spaghetti.</p>
        </div>
        <div className="why-card">
          <h3>Moduler</h3>
          <p>Sensors, display, LEDs, input, WiFi, pure logic — hvert sit .h/.cpp-par.</p>
        </div>
        <div className="why-card">
          <h3>types.h</h3>
          <p>
            Fælles structs som <code>SensorReading</code> uden hardware.
          </p>
        </div>
        <div className="why-card">
          <h3>Native test</h3>
          <p>
            <code>temperature_color</code> testes på PC med PlatformIO.
          </p>
        </div>
      </div>

      <Callout type="tip">
        <p>
          Tryk <strong>Præsentér</strong> — når du er færdig med sektionerne på denne side, går{' '}
          <strong>Næste</strong> automatisk videre til Funktioner, så hele H3 hænger sammen. Klon
          templaten, når I skal kode.
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
    </>
  )
}

export default function Oversigt() {
  return (
    <LessonLayout module="h3">
      <OversigtContent />
    </LessonLayout>
  )
}

