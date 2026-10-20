import { useCallback, useState } from 'react'
import ImageLightbox from './ImageLightbox'

type FigureProps = {
  src: string
  alt: string
  caption?: string
  sourceUrl?: string
  sourceLabel?: string
  variant?: 'default' | 'portrait' | 'logo'
  className?: string
}

export default function Figure({
  src,
  alt,
  caption,
  sourceUrl,
  sourceLabel,
  variant = 'default',
  className,
}: FigureProps) {
  const [failed, setFailed] = useState(false)
  const [open, setOpen] = useState(false)

  const openLightbox = useCallback(() => setOpen(true), [])
  const closeLightbox = useCallback(() => setOpen(false), [])

  if (failed) return null

  const classes = [
    'figure',
    variant === 'portrait' ? 'figure--portrait' : null,
    variant === 'logo' ? 'figure--logo' : null,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <>
      <figure className={classes}>
        <button
          type="button"
          className="figure__open"
          onClick={openLightbox}
          aria-label="Forstør billede"
          title="Forstør billede"
        >
          <img src={src} alt={alt} loading="lazy" onError={() => setFailed(true)} />
          <span className="figure__zoom-hint" aria-hidden="true">
            Forstør
          </span>
        </button>
        {caption || sourceUrl ? (
          <figcaption>
            {caption ? <span>{caption}</span> : null}
            {sourceUrl ? (
              <span className="figure__source">
                {caption ? ' · ' : null}
                <a href={sourceUrl} target="_blank" rel="noreferrer">
                  {sourceLabel ?? 'Kilde'}
                </a>
              </span>
            ) : null}
          </figcaption>
        ) : null}
      </figure>
      {open ? <ImageLightbox image={{ src, alt, caption }} onClose={closeLightbox} /> : null}
    </>
  )
}
