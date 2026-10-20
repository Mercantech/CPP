export type LessonModule = 'h3' | 'historie'

export type LessonNavItem = {
  slug: string
  label: string
  path: string
  num?: string
}

export type LessonModuleNav = {
  module: LessonModule
  title: string
  items: LessonNavItem[]
}

export const lessonModules: LessonModuleNav[] = [
  {
    module: 'historie',
    title: 'Historie',
    items: [{ slug: 'historie', label: 'C → C++ → arv', path: '/historie', num: '01' }],
  },
  {
    module: 'h3',
    title: 'H3 · Struktureret C++',
    items: [
      { slug: 'oversigt', label: 'Oversigt', path: '/h3', num: '01' },
      { slug: 'funktioner', label: 'Funktioner', path: '/h3/funktioner', num: '02' },
      { slug: 'datatyper', label: 'Datatyper', path: '/h3/datatyper', num: '03' },
      { slug: 'scope', label: 'Global vs lokal', path: '/h3/scope', num: '04' },
      { slug: 'filer', label: 'Filopdeling', path: '/h3/filer', num: '05' },
      { slug: 'kodestandarder', label: 'Kodestandarder', path: '/h3/kodestandarder', num: '06' },
      { slug: 'refaktorering', label: 'Refaktorering', path: '/h3/refaktorering', num: '07' },
      { slug: 'videnstjek', label: 'Videnstjek', path: '/h3/videnstjek', num: '08' },
    ],
  },
]

/** H3-lektioner i præsentationsrækkefølge (Næste skifter side automatisk). */
export const h3PresentSequence = lessonModules
  .find((m) => m.module === 'h3')!
  .items.map((item) => ({ path: item.path, label: item.label, num: item.num ?? '' }))

export function getModuleNav(module: LessonModule): LessonModuleNav {
  const found = lessonModules.find((m) => m.module === module)
  if (!found) throw new Error(`Unknown module: ${module}`)
  return found
}

export function getH3PresentNeighbors(pathname: string) {
  const idx = h3PresentSequence.findIndex((s) => s.path === pathname)
  if (idx < 0) return null
  return {
    index: idx,
    total: h3PresentSequence.length,
    current: h3PresentSequence[idx],
    prev: idx > 0 ? h3PresentSequence[idx - 1] : null,
    next: idx < h3PresentSequence.length - 1 ? h3PresentSequence[idx + 1] : null,
  }
}

export const h3Objectives = [
  {
    id: '1',
    text: 'Jeg kan strukturere Arduino-kode med funktioner for at gøre koden mere læsbar og genanvendelig',
  },
  {
    id: '2',
    text: 'Jeg kan anvende korrekte datatyper (int, long, float, boolean, char) baseret på det data jeg skal arbejde med',
  },
  {
    id: '3',
    text: 'Jeg kan organisere større Arduino-projekter ved at opdele kode i flere filer (.h og .cpp)',
  },
  {
    id: '4',
    text: 'Jeg forstår forskellen mellem globale og lokale variabler, og hvornår hver type skal bruges',
  },
  {
    id: '5',
    text: 'Jeg kan følge kodestandarder og navngivningskonventioner for at skrive professionel Arduino-kode',
  },
]
