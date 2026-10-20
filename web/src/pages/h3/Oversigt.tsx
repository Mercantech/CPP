import { Link } from 'react-router-dom'
import Callout from '../../components/Callout'
import LessonLayout from '../../components/LessonLayout'
import { h3Objectives } from '../../data/lessons'

export default function Oversigt() {
  return (
    <LessonLayout module="h3">
      <h1>Struktureret kode i C++ til Arduino</h1>
      <p>
        Når Arduino-projekter vokser, bliver det uoverskueligt med alt i <code>setup()</code> og{' '}
        <code>loop()</code>. H3 handler om at skrive kode, der er læsbar, genbrugelig og professionel.
      </p>

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
      <p>Struktureret programmering opdeler koden i mindre, genbrugelige dele der:</p>
      <ul>
        <li>Gør koden lettere at læse og forstå</li>
        <li>Reducerer fejl og forenkler fejlsøgning</li>
        <li>Gør det nemmere at genbruge kode på tværs af projekter</li>
        <li>Forbedrer samarbejde i teams</li>
      </ul>

      <Callout type="tip">
        <p>
          Brug <strong>Præsentér</strong> øverst til højre, når du underviser — siden splits i slides
          ved hvert H2.
        </p>
      </Callout>

      <h2>Ruten gennem H3</h2>
      <ol>
        <li>
          <Link to="/h3/funktioner">Funktioner</Link> — byggestenene
        </li>
        <li>
          <Link to="/h3/datatyper">Datatyper</Link> — vælg den rigtige størrelse og betydning
        </li>
        <li>
          <Link to="/h3/scope">Global vs lokal</Link> — hvor data lever
        </li>
        <li>
          <Link to="/h3/filer">Filopdeling</Link> — .h, .cpp og include i dybden
        </li>
        <li>
          <Link to="/h3/kodestandarder">Kodestandarder</Link> — professionel stil
        </li>
        <li>
          <Link to="/h3/refaktorering">Refaktorering</Link> — før/efter workshop
        </li>
        <li>
          <Link to="/h3/videnstjek">Videnstjek</Link> — test dig selv
        </li>
      </ol>
    </LessonLayout>
  )
}
