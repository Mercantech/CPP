import { Link } from 'react-router-dom'
import { getModuleNav, lessonModules } from '../data/lessons'
import { useProgress } from '../lib/progress'

const courses = [
  { module: 'h3' as const, title: 'C++ til Arduino', description: 'Funktioner, typer og struktur. Eksemplerne tager udgangspunkt i Arduino UNO R3 og afsluttes med et samlet projekt.' },
  { module: 'h5' as const, title: 'Moderne C++', description: 'Objekter, hukommelse og standardbiblioteket. Vi arbejder med C++20 på computeren og bygger en sensorlog.' },
]

export default function Home() {
  const { progress } = useProgress()
  const lastModule = lessonModules.find((module) => module.items.some((item) => item.path === progress.lastPath))
  const last = lastModule?.items.find((item) => item.path === progress.lastPath)

  return (
    <div className="course-home">
      <header className="course-intro">
        <p className="course-kicker">Programmering · Mercantec</p>
        <h1>C++</h1>
        <p>Pensum, eksempler og øvelser til H3 og H5. Vælg dit forløb nedenfor, eller brug laboratoriet til at undersøge begreberne undervejs.</p>
        {last && <p className="course-resume">Sidst besøgt: <Link to={last.path}>{lastModule?.module.toUpperCase()} · {last.label}</Link></p>}
      </header>

      <div className="course-columns">
        {courses.map((course) => {
          const nav = getModuleNav(course.module)
          const completed = nav.items.filter((item) => progress.completed.includes(item.path)).length
          return (
            <section className="course-section" key={course.module} aria-labelledby={`${course.module}-title`}>
              <p className="course-level">{course.module.toUpperCase()}</p>
              <h2 id={`${course.module}-title`}>{course.title}</h2>
              <p className="course-description">{course.description}</p>
              <ol className="course-index">
                {nav.items.map((item) => <li key={item.path}>
                  <Link to={item.path}>
                    <span className="course-index__number" aria-hidden="true">{item.num}</span>
                    <span>{item.slug === 'oversigt' ? 'Introduktion og læringsmål' : item.label}</span>
                    {progress.completed.includes(item.path) && <span className="course-index__done" aria-label="Gennemført">✓</span>}
                  </Link>
                </li>)}
              </ol>
              {completed > 0 && <p className="course-progress-note">{completed} af {nav.items.length} afsnit markeret som gennemført.</p>}
            </section>
          )
        })}
      </div>

      <nav className="course-resources" aria-label="Supplerende materiale">
        <div><h2><Link to="/laboratorium">Laboratorium</Link></h2><p>Interaktive forsøg med værdier og referencer, datatyper og tidsstyring.</p></div>
        <div><h2><Link to="/historie">Sprogets historie</Link></h2><p>Fra C og Bell Labs til C++, Arduino og forbindelsen til C#.</p></div>
      </nav>

      <aside className="course-reading-note">
        <h2>Sådan bruger du materialet</h2>
        <p>Læs forklaringen, prøv eksemplet, og løs øvelsen. Hints og løsningsforslag kan foldes ud efter behov. Brug gerne en makker til at drøfte, hvad koden gør, og hvorfor.</p>
        <p>Du kan selv markere afsnit som gennemført. Kilder til videre læsning står ved de enkelte lektioner.</p>
      </aside>
    </div>
  )
}
