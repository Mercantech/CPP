import { useEffect, useId, useRef, useState } from 'react'
import { historyErasSorted, type HistoryEra } from '../data/history'
import Figure from './Figure'

function EraBody({ era }: { era: HistoryEra }) {
  return (
    <div className="era-panel__body">
      <p className="era-panel__summary">{era.summary}</p>
      {(era.image || era.logo) && (
        <div className="era-panel__media">
          {era.image ? (
            <Figure
              src={era.image.src}
              alt={era.image.alt}
              caption={era.image.caption}
              sourceUrl={era.image.sourceUrl}
              sourceLabel="Wikimedia Commons"
              variant="portrait"
            />
          ) : null}
          {era.logo ? (
            <Figure src={era.logo} alt={`${era.title} logo`} variant="logo" />
          ) : null}
        </div>
      )}
      <ul className="era-panel__details">
        {era.detail.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
      <div className="era-panel__tags">
        {era.tags.map((t) => (
          <span key={t} className="era-tag">
            {t}
          </span>
        ))}
      </div>
    </div>
  )
}

export default function InteractiveTimeline() {
  const [activeId, setActiveId] = useState(historyErasSorted[0]?.id ?? '')
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    [historyErasSorted[0]?.id ?? '']: true,
  })
  const railRef = useRef<HTMLDivElement>(null)
  const labelId = useId()

  const active = historyErasSorted.find((e) => e.id === activeId) ?? historyErasSorted[0]
  const activeIndex = historyErasSorted.findIndex((e) => e.id === activeId)

  function select(era: HistoryEra) {
    setActiveId(era.id)
    setExpanded((prev) => ({ ...prev, [era.id]: true }))
    const el = document.getElementById(`era-${era.id}`)
    el?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }

  function go(delta: number) {
    const next = Math.min(
      historyErasSorted.length - 1,
      Math.max(0, activeIndex + delta),
    )
    select(historyErasSorted[next])
  }

  useEffect(() => {
    const btn = railRef.current?.querySelector<HTMLButtonElement>(
      `[data-era-id="${activeId}"]`,
    )
    btn?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
  }, [activeId])

  return (
    <div className="interactive-timeline">
      <div className="timeline-rail-wrap">
        <p className="timeline-rail__hint" id={labelId}>
          Klik et årstal — eller brug piletasterne når tidslinjen er i fokus
        </p>
        <div
          className="timeline-rail"
          ref={railRef}
          role="tablist"
          aria-labelledby={labelId}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
              e.preventDefault()
              go(1)
            }
            if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
              e.preventDefault()
              go(-1)
            }
            if (e.key === 'Home') {
              e.preventDefault()
              select(historyErasSorted[0])
            }
            if (e.key === 'End') {
              e.preventDefault()
              select(historyErasSorted[historyErasSorted.length - 1])
            }
          }}
        >
          <div className="timeline-rail__track" aria-hidden />
          {historyErasSorted.map((era) => (
            <button
              key={era.id}
              type="button"
              role="tab"
              data-era-id={era.id}
              aria-selected={era.id === activeId}
              className={
                era.id === activeId
                  ? 'timeline-rail__node timeline-rail__node--active'
                  : 'timeline-rail__node'
              }
              onClick={() => select(era)}
            >
              <span className="timeline-rail__year">{era.year}</span>
              <span className="timeline-rail__title">{era.title.split('—')[0].trim()}</span>
            </button>
          ))}
        </div>
        <div className="timeline-rail__nav">
          <button
            type="button"
            className="btn btn--ghost"
            disabled={activeIndex <= 0}
            onClick={() => go(-1)}
          >
            Forrige
          </button>
          <span className="timeline-rail__count">
            {activeIndex + 1} / {historyErasSorted.length}
          </span>
          <button
            type="button"
            className="btn btn--ghost"
            disabled={activeIndex >= historyErasSorted.length - 1}
            onClick={() => go(1)}
          >
            Næste
          </button>
        </div>
      </div>

      {active ? (
        <article className="era-spotlight" aria-live="polite">
          <header className="era-spotlight__head">
            <span className="era-spotlight__year">{active.year}</span>
            <h3 className="era-spotlight__title">{active.title}</h3>
          </header>
          <EraBody era={active} />
        </article>
      ) : null}

      <h2>Hele tidslinjen</h2>
      <p>Udvid et punkt for at læse detaljerne — eller hop via årstalsbjælken ovenfor.</p>
      <div className="timeline timeline--interactive">
        {historyErasSorted.map((era) => {
          const open = !!expanded[era.id]
          return (
            <article
              key={era.id}
              id={`era-${era.id}`}
              className={
                era.id === activeId
                  ? 'timeline__item timeline__item--focus'
                  : 'timeline__item'
              }
            >
              <button
                type="button"
                className="timeline__toggle"
                aria-expanded={open}
                onClick={() => {
                  setActiveId(era.id)
                  setExpanded((prev) => ({ ...prev, [era.id]: !prev[era.id] }))
                }}
              >
                <span className="timeline__year">{era.year}</span>
                <span className="timeline__toggle-title">{era.title}</span>
                <span className="timeline__chevron" aria-hidden>
                  {open ? '−' : '+'}
                </span>
              </button>
              {open ? <EraBody era={era} /> : <p className="timeline__teaser">{era.summary}</p>}
            </article>
          )
        })}
      </div>
    </div>
  )
}
