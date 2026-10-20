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

export function getModuleNav(module: LessonModule): LessonModuleNav {
  const found = lessonModules.find((m) => m.module === module)
  if (!found) throw new Error(`Unknown module: ${module}`)
  return found
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
