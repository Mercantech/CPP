const nodes = [
  { src: '/history/c.svg', label: 'C' },
  { src: '/history/cplusplus.svg', label: 'C++' },
  { src: '/history/csharp.svg', label: 'C#' },
  { src: '/history/java.svg', label: 'Java' },
  { src: '/history/arduino.svg', label: 'Arduino' },
]

export default function LanguageLineage() {
  return (
    <div className="lineage" aria-label="Sprogslægtsskab">
      {nodes.map((n, i) => (
        <div key={n.label} style={{ display: 'contents' }}>
          {i > 0 ? (
            <span className="lineage__arrow" aria-hidden>
              →
            </span>
          ) : null}
          <div className="lineage__node">
            <img src={n.src} alt={`${n.label} logo`} width={56} height={56} />
            <span>{n.label}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
