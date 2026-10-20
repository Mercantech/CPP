export type Slide = {
  html: string
  title: string
  chapter?: string
}

/** Split lesson DOM into slides at each H2 (and keep leading H1 with first section). */
export function buildSlides(root: HTMLElement): Slide[] {
  const kids = Array.from(root.children).filter(
    (el) => !(el instanceof HTMLElement && el.classList.contains('lesson-toolbar')),
  )
  if (kids.length === 0) return []

  const groups: Element[][] = []
  let current: Element[] = []
  let currentChapter: string | undefined

  const chapters: (string | undefined)[] = []

  for (const child of kids) {
    if (child.tagName === 'H2') {
      if (current.length) {
        groups.push(current)
        chapters.push(currentChapter)
      }
      current = [child]
      if (child.classList.contains('deck-chapter')) {
        currentChapter = child.textContent?.trim() || currentChapter
      }
    } else {
      current.push(child)
    }
  }
  if (current.length) {
    groups.push(current)
    chapters.push(currentChapter)
  }

  return groups.map((nodes, index) => {
    const titleEl =
      nodes.find((n) => n.tagName === 'H1' || n.tagName === 'H2') ?? nodes[0]
    const title =
      titleEl?.textContent?.trim() || (index === 0 ? 'Intro' : `Slide ${index + 1}`)
    const html = nodes.map((n) => (n as HTMLElement).outerHTML).join('')
    return { html, title, chapter: chapters[index] }
  })
}
