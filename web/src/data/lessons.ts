export type LessonModule = 'h3' | 'h5' | 'historie'

export type LessonNavItem = {
  slug: string
  label: string
  path: string
  num?: string
  duration?: string
  description?: string
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
      { slug: 'oversigt', label: 'Start her', path: '/h3', num: '00', description: 'Dit værksted, dine mål og dit første program.' },
      { slug: 'funktioner', label: 'Funktioner', path: '/h3/funktioner', num: '01', duration: '45–60 min', description: 'Fra gentaget kode til klare kontrakter og små byggesten.' },
      { slug: 'datatyper', label: 'Datatyper & bits', path: '/h3/datatyper', num: '02', duration: '45–60 min', description: 'Vælg typer med omtanke. Undersøg størrelser, præcision og konvertering.' },
      { slug: 'kontrolflow', label: 'Kontrolflow & arrays', path: '/h3/kontrolflow', num: '03', duration: '45–60 min', description: 'Betingelser, løkker og flere målinger uden gentagelser.' },
      { slug: 'scope', label: 'Scope & levetid', path: '/h3/scope', num: '04', duration: '30–45 min', description: 'Hvem kan se en variabel, og hvor længe findes den?' },
      { slug: 'filer', label: 'Headers & .cpp', path: '/h3/filer', num: '05', duration: '45–60 min', description: 'Følg din kode fra deklaration til compiler og linker.' },
      { slug: 'kodestandarder', label: 'Kode med omtanke', path: '/h3/kodestandarder', num: '06', duration: '30–45 min', description: 'Navne, fejl og tidsstyring, som din makker kan forstå.' },
      { slug: 'refaktorering', label: 'Refaktorering', path: '/h3/refaktorering', num: '07', duration: '45–60 min', description: 'Giv fungerende kode en bedre struktur, ét trin ad gangen.' },
      { slug: 'mission', label: 'Mission: Signalstation', path: '/h3/mission', num: '08', duration: '2–3 timer', description: 'Saml det hele i en station med knap, LED og tilstande.' },
      { slug: 'videnstjek', label: 'Videnstjek', path: '/h3/videnstjek', num: '09', duration: '15–25 min', description: 'Forudsig adfærd og forklar dine valg.' },
    ],
  },
  {
    module: 'h5',
    title: 'H5 · Moderne C++',
    items: [
      { slug: 'oversigt', label: 'Start her', path: '/h5', num: '00', duration: '1–2 timer' },
      { slug: 'objekter', label: 'Objekter & invariants', path: '/h5/objekter', num: '01', duration: '3–4 timer' },
      { slug: 'hukommelse', label: 'Hukommelse & RAII', path: '/h5/hukommelse', num: '02', duration: '3–4 timer' },
      { slug: 'standardbibliotek', label: 'Standardbiblioteket', path: '/h5/standardbibliotek', num: '03', duration: '3–4 timer' },
      { slug: 'projekt', label: 'Projekt: Sensorlog', path: '/h5/projekt', num: '04', duration: '5–8 timer' },
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
    text: 'Jeg kan vælge og begrunde datatyper (int, long, float, bool, char) ud fra værdier og den konkrete platform',
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
  {
    id: '6',
    text: 'Jeg kan bruge betingelser, løkker og arrays uden at læse uden for arrayets grænser',
  },
  {
    id: '7',
    text: 'Jeg kan bygge et responsivt program med tilstande, knaphændelser og unsigned tidsforskelle fra millis()',
  },
]
