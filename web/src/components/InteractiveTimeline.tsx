import { useId, useState } from 'react'
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

function shortTitle(title: string) {
  const base = title.split('—')[0]?.trim() ?? title
  return base.length > 28 ? `${base.slice(0, 26)}…` : base
}

export default function InteractiveTimeline() {
  const [activeId, setActiveId] = useState(historyErasSorted[0]?.id ?? '')
  const labelId = useId()

  const active = historyErasSorted.find((e) => e.id === activeId) ?? historyErasSorted[0]
  const activeIndex = historyErasSorted.findIndex((e) => e.id === activeId)

  function select(era: HistoryEra) {
    setActiveId(era.id)
  }

  function go(delta: number) {
    const next = Math.min(
      historyErasSorted.length - 1,
      Math.max(0, activeIndex + delta),
    )
    select(historyErasSorted[next])
  }

  return (
    <div
      className="interactive-timeline"
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
      <div className="timeline-picker">
        <p className="timeline-picker__hint" id={labelId}>
          Vælg et årstal — eller brug Forrige/Næste og piletasterne
        </p>
        <div
          className="timeline-picker__years"
          role="tablist"
          aria-labelledby={labelId}
        >
          {historyErasSorted.map((era) => (
            <button
              key={era.id}
              type="button"
              role="tab"
              aria-selected={era.id === activeId}
              className={
                era.id === activeId
                  ? 'timeline-year timeline-year--active'
                  : 'timeline-year'
              }
              onClick={() => select(era)}
            >
              <span className="timeline-year__when">{era.year}</span>
              <span className="timeline-year__what">{shortTitle(era.title)}</span>
            </button>
          ))}
        </div>
        <div className="timeline-picker__nav">
          <button
            type="button"
            className="btn btn--ghost"
            disabled={activeIndex <= 0}
            onClick={() => go(-1)}
          >
            Forrige
          </button>
          <span className="timeline-picker__count">
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
    </div>
  )
}
