import { useCallback, useEffect, useRef, useState } from 'react'
import type { MemoryDemo } from '../data/memoryDemos'
import CodeBlock from './CodeBlock'

type MemoryStageProps = {
  demo: MemoryDemo
}

export default function MemoryStage({ demo }: MemoryStageProps) {
  const [step, setStep] = useState(0)
  const [playing, setPlaying] = useState(false)
  const timer = useRef<number | null>(null)
  const reduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const current = demo.steps[step] ?? demo.steps[0]
  const total = demo.steps.length

  const go = useCallback(
    (next: number) => {
      setStep(Math.max(0, Math.min(total - 1, next)))
    },
    [total],
  )

  useEffect(() => {
    if (!playing || reduced) return
    timer.current = window.setInterval(() => {
      setStep((s) => {
        if (s >= total - 1) {
          setPlaying(false)
          return s
        }
        return s + 1
      })
    }, 1600)
    return () => {
      if (timer.current) window.clearInterval(timer.current)
    }
  }, [playing, total, reduced])

  return (
    <section className="memory-stage" aria-label={demo.title}>
      <header className="memory-stage__header">
        <div>
          <h3 className="memory-stage__title">{demo.title}</h3>
          <p className="memory-stage__sub">{demo.subtitle}</p>
        </div>
        <div className="memory-stage__controls">
          <button type="button" className="btn btn--ghost btn--sm" onClick={() => go(step - 1)} disabled={step === 0}>
            Forrige
          </button>
          <button
            type="button"
            className="btn btn--primary btn--sm"
            onClick={() => {
              if (reduced) {
                go(step >= total - 1 ? 0 : step + 1)
                return
              }
              if (step >= total - 1) {
                setStep(0)
                setPlaying(true)
              } else {
                setPlaying((p) => !p)
              }
            }}
          >
            {playing ? 'Pause' : step >= total - 1 ? 'Genstart' : 'Afspil'}
          </button>
          <button
            type="button"
            className="btn btn--ghost btn--sm"
            onClick={() => {
              setPlaying(false)
              go(step + 1)
            }}
            disabled={step >= total - 1}
          >
            Næste
          </button>
          <span className="memory-stage__count">
            {step + 1} / {total}
          </span>
        </div>
      </header>

      <div className="memory-stage__grid">
        <div className="memory-stage__code">
          <CodeBlock
            language="cpp"
            filename={demo.filename}
            highlightLines={[current.line]}
          >
            {demo.code}
          </CodeBlock>
        </div>

        <div className="memory-stage__viz" aria-live="polite">
          <p className="memory-stage__caption">{current.caption}</p>
          {current.warn ? <p className="memory-stage__warn">{current.warn}</p> : null}

          <div className="memory-frames">
            {current.frames.map((frame) => (
              <div key={frame.id} className="memory-frame">
                <h4 className="memory-frame__title">{frame.title}</h4>
                <div className="memory-cells">
                  {frame.cells.map((cell) => (
                    <div
                      key={cell.id}
                      id={`mem-${demo.id}-${cell.id}`}
                      className={`memory-cell memory-cell--${cell.kind ?? 'stack'}`}
                    >
                      <div className="memory-cell__label">{cell.label}</div>
                      <div className="memory-cell__bytes">
                        {cell.bytes.map((b, i) => (
                          <span key={i} className="memory-byte">
                            {b}
                          </span>
                        ))}
                      </div>
                      {cell.note ? <div className="memory-cell__note">{cell.note}</div> : null}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {current.arrow ? (
            <p className="memory-stage__arrow" aria-hidden>
              <span className="memory-stage__arrow-label">{current.arrow.label ?? '→'}</span>
              <span>
                {current.arrow.from} → {current.arrow.to}
              </span>
            </p>
          ) : null}
        </div>
      </div>

      <input
        className="memory-stage__scrub"
        type="range"
        min={0}
        max={total - 1}
        value={step}
        aria-label="Skridt i memory-demo"
        onChange={(e) => {
          setPlaying(false)
          go(Number(e.target.value))
        }}
      />
    </section>
  )
}
