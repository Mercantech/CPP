import Callout from '../components/Callout'
import Figure from '../components/Figure'
import LanguageLineage from '../components/LanguageLineage'
import LessonLayout from '../components/LessonLayout'

export default function Historie() {
  return (
    <LessonLayout module="historie">
      <h1>Historien bag C++</h1>
      <p>
        C++ er ikke bare “endnu et sprog”. Det er en direkte fortsættelse af C — designet til at give
        abstraktion uden at ofre hastighed. Den historie forklarer, hvorfor Arduino stadig kører C++,
        og hvorfor C# føles bekendt, når du allerede kender klasser og typer.
      </p>

      <LanguageLineage />

      <h2>Før C++: C og Bell Labs</h2>
      <div className="timeline">
        <article className="timeline__item">
          <span className="timeline__year">1972</span>
          <h3>C ser dagens lys</h3>
          <div className="timeline__grid">
            <div>
              <p>
                <strong>Dennis Ritchie</strong> skaber C på Bell Labs til at skrive Unix. Sproget er
                tæt på maskinen: pointers, manuel hukommelse, få abstraktioner — men ekstremt
                effektivt og portabelt.
              </p>
              <p>
                C bliver “lingua franca” for systemprogrammering. Problemet: store programmer bliver
                svære at strukturere. Der mangler stærkere værktøjer til at modellere data og adfærd
                sammen.
              </p>
            </div>
            <Figure
              src="/history/ritchie.jpg"
              alt="Dennis Ritchie"
              caption="Dennis Ritchie — skaberen af C"
              sourceUrl="https://commons.wikimedia.org/wiki/File:Dennis_Ritchie_2011.jpg"
              sourceLabel="Wikimedia Commons"
              variant="portrait"
            />
          </div>
          <Figure
            src="/history/c.svg"
            alt="C logo"
            caption="C-logo (Simple Icons)"
            variant="logo"
          />
        </article>

        <article className="timeline__item">
          <span className="timeline__year">1979–1985</span>
          <h3>C++ fødes hos Bjarne Stroustrup</h3>
          <div className="timeline__grid">
            <Figure
              src="/history/stroustrup.jpg"
              alt="Bjarne Stroustrup"
              caption="Bjarne Stroustrup — designer af C++"
              sourceUrl="https://commons.wikimedia.org/wiki/File:Bjarne_Stroustrup.jpg"
              sourceLabel="Wikimedia Commons"
              variant="portrait"
            />
            <div>
              <p>
                Danske <strong>Bjarne Stroustrup</strong> arbejder på Bell Labs. Han vil have C’s
                effektivitet <em>plus</em> Simula’s klasser. Resultatet starter som “C with Classes”
                og bliver til <strong>C++</strong> (udgivet offentligt midt i 1980’erne).
              </p>
              <p>
                Designmål: abstraktion (klasser, overloading, senere templates) uden at ofre
                kontrol og performance. “You don’t pay for what you don’t use” er stadig et
                kerneprincip.
              </p>
              <Callout type="tip">
                <p>
                  Navnet C++ er et ordspil: i C betyder <code>++</code> “øg med én” — så C++ er
                  bogstaveligt talt “næste version af C”.
                </p>
              </Callout>
            </div>
          </div>
          <Figure
            src="/history/cplusplus.svg"
            alt="C++ logo"
            caption="C++-logo (Simple Icons) — farven #00599C er brandets blå"
            variant="logo"
          />
        </article>

        <article className="timeline__item">
          <span className="timeline__year">1998 → i dag</span>
          <h3>Standardisering og levetid</h3>
          <p>
            ISO standardiserer C++ (C++98, C++11, C++17, C++20, C++23…). Sproget lever i
            spilmotorer, operativsystemer, high-frequency trading — og i <strong>embedded</strong>,
            hvor hver byte og mikrosekund tæller. Arduino bygger ovenpå præcis den tradition.
          </p>
        </article>

        <article className="timeline__item">
          <span className="timeline__year">2000-tallet</span>
          <h3>Arven videre: C#, Java og venner</h3>
          <div className="timeline__grid">
            <div>
              <p>
                Sprog som <strong>Java</strong> og <strong>C#</strong> arver idéer fra C-familien:
                krøllede parenteser, klasser, statisk typing, velkendt kontrolflow. Men de ændrer
                kontrakten:
              </p>
              <ul>
                <li>
                  <strong>Garbage collection</strong> i stedet for manuel <code>new</code>/
                  <code>delete</code>
                </li>
                <li>Stærkere runtime (JVM / .NET) i stedet for “bare metal”</li>
                <li>Ofte mere sikkerhed, mindre lavniveau-kontrol</li>
              </ul>
              <p>
                C# (Anders Hejlsberg m.fl. hos Microsoft) er bevidst “C-family”-agtigt, så
                programmører fra C/C++/Java hurtigt føler sig hjemme — uden at være en C++-klon.
              </p>
            </div>
            <div>
              <Figure
                src="/history/csharp.svg"
                alt="C# / .NET logo"
                caption=".NET / C#-mark (Simple Icons)"
                variant="logo"
              />
              <Figure
                src="/history/java.svg"
                alt="OpenJDK logo"
                caption="OpenJDK / Java-mark (Simple Icons)"
                variant="logo"
              />
            </div>
          </div>
          <Callout type="info">
            <p>
              Tænk det som et stamtræ: <strong>C</strong> er roden, <strong>C++</strong> tilføjer
              objekter og generisk kraft tæt på hardware, mens <strong>C#</strong> og{' '}
              <strong>Java</strong> tager de samme mentale modeller ind i managed runtimes.
            </p>
          </Callout>
        </article>

        <article className="timeline__item">
          <span className="timeline__year">Arduino</span>
          <h3>Broen til dit H3-pensum</h3>
          <div className="timeline__grid">
            <div>
              <p>
                En Arduino-sketch er <strong>C++</strong> (med Wiring-API’et: <code>pinMode</code>,{' '}
                <code>digitalWrite</code>, …). Derfor gælder de samme principper som i “rigtig” C++:
                funktioner, korrekte typer, scope, headers og klare navne.
              </p>
              <p>
                Når du strukturerer kode på Arduino, træner du færdigheder, der direkte overføres til
                større C++-projekter — og som gør det lettere at læse C# senere.
              </p>
            </div>
            <Figure
              src="/history/arduino.svg"
              alt="Arduino logo"
              caption="Arduino-logo (Simple Icons)"
              variant="logo"
            />
          </div>
        </article>
      </div>

      <h2>Hvad tager du med videre?</h2>
      <ul>
        <li>C++ er en bevidst evolution af C — skabt af Bjarne Stroustrup på Bell Labs.</li>
        <li>Effektivitet + abstraktion er ikke modsætninger i C++’s design.</li>
        <li>C# og Java står på samme familiære syntaks/idéer, men med managed hukommelse.</li>
        <li>Arduino er din indgang: samme sprogfamilie, konkrete pins og sensorer.</li>
      </ul>
    </LessonLayout>
  )
}
