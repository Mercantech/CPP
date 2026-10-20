import {
  useCallback,
  useEffect,
  useId,
  useState,
  type RefObject,
} from 'react'
import { createPortal } from 'react-dom'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { getH3PresentNeighbors } from '../data/lessons'
import { buildSlides, type Slide } from '../lib/buildSlides'
import ImageLightbox, { type LightboxImage } from './ImageLightbox'

type PresentModeProps = {
  contentRef: RefObject<HTMLElement | null>
  buttonLabel?: string
  /** Chain Næste/Forrige across H3 lesson pages. */
  chainH3?: boolean
}

function imageFromClickTarget(target: EventTarget | null): LightboxImage | null {
  if (!(target instanceof Element)) return null
  const openBtn = target.closest('.figure__open')
  const imgEl =
    (openBtn?.querySelector('img') as HTMLImageElement | null) ??
    (target.closest('.figure img') as HTMLImageElement | null)
  if (!imgEl) return null

  const fig = imgEl.closest('figure')
  const captionEl = fig?.querySelector('figcaption')
  const captionSpan = captionEl?.querySelector('span:not(.figure__source)')
  const caption =
    captionSpan?.textContent?.trim() ||
    captionEl?.childNodes[0]?.textContent?.trim() ||
    undefined

  return {
    src: imgEl.currentSrc || imgEl.src,
    alt: imgEl.alt || '',
    caption: caption || undefined,
  }
}

export default function PresentMode({
  contentRef,
  buttonLabel = 'Præsentér',
  chainH3 = false,
}: PresentModeProps) {
  const titleId = useId()
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams, setSearchParams] = useSearchParams()
  const neighbors = chainH3 ? getH3PresentNeighbors(location.pathname) : null

  const [open, setOpen] = useState(false)
  const [slides, setSlides] = useState<Slide[]>([])
  const [index, setIndex] = useState(0)
  const [lightbox, setLightbox] = useState<LightboxImage | null>(null)

  const clearPresentParam = useCallback(() => {
    if (!searchParams.has('present')) return
    const next = new URLSearchParams(searchParams)
    next.delete('present')
    setSearchParams(next, { replace: true })
  }, [searchParams, setSearchParams])

  const close = useCallback(() => {
    setLightbox(null)
    setOpen(false)
    setIndex(0)
    clearPresentParam()
    if (document.fullscreenElement) {
      void document.exitFullscreen().catch(() => undefined)
    }
  }, [clearPresentParam])

  const openPresent = useCallback(
    (start: 'start' | 'end' = 'start') => {
      const root = contentRef.current
      if (!root) return
      const next = buildSlides(root)
      if (next.length === 0) return
      setSlides(next)
      setIndex(start === 'end' ? next.length - 1 : 0)
      setLightbox(null)
      setOpen(true)
      if (chainH3 && !searchParams.has('present')) {
        const params = new URLSearchParams(searchParams)
        params.set('present', start === 'end' ? 'end' : '1')
        setSearchParams(params, { replace: true })
      }
    },
    [contentRef, chainH3, searchParams, setSearchParams],
  )

  // Auto-open when arriving via ?present=1|end (page chain)
  useEffect(() => {
    const flag = searchParams.get('present')
    if (flag !== '1' && flag !== 'end') return
    const t = window.setTimeout(() => {
      openPresent(flag === 'end' ? 'end' : 'start')
    }, 60)
    return () => window.clearTimeout(t)
    // Only react to pathname + present flag, not openPresent identity
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, searchParams.get('present')])

  const goAdjacentLesson = useCallback(
    (dir: 'prev' | 'next') => {
      if (!neighbors) return
      const target = dir === 'next' ? neighbors.next : neighbors.prev
      if (!target) return
      const wasFs = Boolean(document.fullscreenElement)
      navigate(`${target.path}?present=${dir === 'next' ? '1' : 'end'}`)
      // Fullscreen ends on navigation; user can press F again
      void wasFs
    },
    [navigate, neighbors],
  )

  const go = useCallback(
    (delta: number) => {
      setIndex((i) => {
        const next = i + delta
        if (next > slides.length - 1) {
          if (chainH3 && neighbors?.next) {
            queueMicrotask(() => goAdjacentLesson('next'))
            return i
          }
          return slides.length - 1
        }
        if (next < 0) {
          if (chainH3 && neighbors?.prev) {
            queueMicrotask(() => goAdjacentLesson('prev'))
            return i
          }
          return 0
        }
        return next
      })
    },
    [slides.length, chainH3, neighbors, goAdjacentLesson],
  )

  useEffect(() => {
    if (!open) return

    const onKey = (e: KeyboardEvent) => {
      if (lightbox || document.querySelector('[data-image-lightbox]')) return

      if (e.key === 'Escape') {
        e.preventDefault()
        close()
        return
      }
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ' || e.key === 'PageDown') {
        e.preventDefault()
        go(1)
        return
      }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault()
        go(-1)
        return
      }
      if (e.key === 'Home') {
        e.preventDefault()
        setIndex(0)
        return
      }
      if (e.key === 'End') {
        e.preventDefault()
        setIndex(slides.length - 1)
        return
      }
      if (e.key === 'f' || e.key === 'F') {
        e.preventDefault()
        if (document.fullscreenElement) {
          void document.exitFullscreen().catch(() => undefined)
        } else {
          const el = document.querySelector('.present-mode')
          if (el instanceof HTMLElement) {
            void el.requestFullscreen().catch(() => undefined)
          }
        }
      }
    }

    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [open, close, go, slides.length, lightbox])

  useEffect(() => {
    if (!open) return
    const stage = document.querySelector('.present-mode__stage')
    if (!stage) return

    const onClick = (e: Event) => {
      const image = imageFromClickTarget(e.target)
      if (!image) return
      e.preventDefault()
      e.stopPropagation()
      setLightbox(image)
    }

    stage.addEventListener('click', onClick)
    return () => stage.removeEventListener('click', onClick)
  }, [open, index])

  useEffect(() => {
    setLightbox(null)
  }, [index])

  const slide = slides[index]
  const atFirstSlide = index <= 0
  const atLastSlide = index >= slides.length - 1
  const canPrev = !atFirstSlide || Boolean(neighbors?.prev)
  const canNext = !atLastSlide || Boolean(neighbors?.next)

  const lessonProgress =
    neighbors && slides.length
      ? ((neighbors.index + (index + 1) / slides.length) / neighbors.total) * 100
      : slides.length
        ? ((index + 1) / slides.length) * 100
        : 0

  return (
    <>
      <button
        type="button"
        className="btn btn--primary present-mode__trigger"
        onClick={() => openPresent('start')}
      >
        {buttonLabel}
      </button>

      {open && slide
        ? createPortal(
            <div
              className="present-mode"
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
            >
              <div className="present-mode__chrome">
                <div className="present-mode__titles">
                  {neighbors ? (
                    <p className="present-mode__chapter">
                      {neighbors.current.num} · {neighbors.current.label}
                      <span className="present-mode__chapter-meta">
                        {' '}
                        · lektion {neighbors.index + 1}/{neighbors.total}
                      </span>
                    </p>
                  ) : slide.chapter ? (
                    <p className="present-mode__chapter">{slide.chapter}</p>
                  ) : null}
                  <p id={titleId} className="present-mode__title">
                    {slide.title}
                  </p>
                </div>
                <p className="present-mode__progress" aria-live="polite">
                  {index + 1} / {slides.length}
                  {atLastSlide && neighbors?.next ? (
                    <span className="present-mode__next-hint">
                      {' '}
                      → {neighbors.next.label}
                    </span>
                  ) : null}
                </p>
                <div className="present-mode__actions">
                  <button
                    type="button"
                    className="btn btn--ghost"
                    onClick={() => go(-1)}
                    disabled={!canPrev}
                  >
                    Forrige
                  </button>
                  <button
                    type="button"
                    className="btn btn--ghost"
                    onClick={() => go(1)}
                    disabled={!canNext}
                  >
                    Næste
                  </button>
                  <button type="button" className="btn btn--primary" onClick={close}>
                    Afslut
                  </button>
                </div>
              </div>

              <div className="present-mode__bar" aria-hidden="true">
                <span style={{ width: `${lessonProgress}%` }} />
              </div>

              <div className="present-mode__stage">
                <div
                  className="present-mode__slide prose lesson"
                  dangerouslySetInnerHTML={{ __html: slide.html }}
                />
              </div>

              <p className="present-mode__hint">
                ← → skifter sektion
                {chainH3 ? ' og går videre til næste H3-side' : ''}
                {' · '}Esc luk · F fuldskærm
              </p>

              {slides.length <= 24 ? (
                <div className="present-mode__dots" aria-hidden="true">
                  {slides.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      className={
                        i === index
                          ? 'present-mode__dot present-mode__dot--active'
                          : 'present-mode__dot'
                      }
                      onClick={() => setIndex(i)}
                      tabIndex={-1}
                    />
                  ))}
                </div>
              ) : null}
            </div>,
            document.body,
          )
        : null}

      {open && lightbox ? (
        <ImageLightbox image={lightbox} onClose={() => setLightbox(null)} />
      ) : null}
    </>
  )
}
