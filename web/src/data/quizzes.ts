export type QuizQuestion = {
  id: string
  question: string
  options: string[]
  correctIndex: number
  explanation: string
}

export const quizQuestions: QuizQuestion[] = [
  {
    id: 'q1',
    question: 'Hvad må main.cpp gøre ifølge H3-templaten?',
    options: [
      'Al sensor-matematik og display-layout inline',
      'Kun wiring: læse sensorer og kalde moduler',
      'Indeholde WiFi-password hardcodet',
      'Erstatte alle .h-filer',
    ],
    correctIndex: 1,
    explanation:
      'README’en siger det klart: main.cpp er kun wiring — tung logik hører hjemme i moduler.',
  },
  {
    id: 'q2',
    question: 'Hvilken datatype er bedst til millis()-tidsstempler (som lastDisplayUpdateMs)?',
    options: ['int', 'byte', 'unsigned long', 'boolean'],
    correctIndex: 2,
    explanation:
      'millis() er unsigned long. int overløber hurtigt. Templaten bruger unsigned long til timestamps.',
  },
  {
    id: 'q3',
    question: 'Hvor ligger headers i PlatformIO H3-projektet?',
    options: [
      'Kun i lib/',
      'I include/ (automatisk include-path)',
      'Kun inde i secrets.h',
      'På SD-kortet',
    ],
    correctIndex: 1,
    explanation: 'PlatformIO: src/ til .cpp, include/ til .h — include-path sættes automatisk.',
  },
  {
    id: 'q4',
    question: 'Hvad er fordelen ved det anonyme namespace i main.cpp?',
    options: [
      'Det gør variabler synlige i alle .cpp-filer',
      'State er synlig i main.cpp men eksporteres ikke til andre oversættelsesenheder',
      'Det erstatter behovet for types.h',
      'Det slår WiFi til',
    ],
    correctIndex: 1,
    explanation:
      'Anonymt namespace giver fil-privat state — bedre end et hav af ægte globals til resten af projektet.',
  },
  {
    id: 'q5',
    question: 'Hvilken kodestandard gælder for identifikatorer i H3-templaten?',
    options: [
      'Danske variabelnavne',
      'Engelsk for variabler, funktioner, filer og typer',
      'Kun UPPER_SNAKE til funktioner',
      'Emoji i funktionsnavne',
    ],
    correctIndex: 1,
    explanation:
      'Variabler/funktioner/filer/typer på engelsk; kommentarer og README gerne på dansk.',
  },
  {
    id: 'q6',
    question: 'Hvorfor kan temperature_color testes med pio test -e native?',
    options: [
      'Den kræver Oplà-skærmen',
      'Den er pure logic uden Arduino-hardware-afhængigheder',
      'Den ligger kun i secrets.h',
      'Native env bygger hele src/ inklusive WiFi',
    ],
    correctIndex: 1,
    explanation:
      'build_src_filter inkluderer kun temperature_color.cpp — ren C++ uden carrier/WiFi.',
  },
  {
    id: 'q7',
    question: 'Hvad hører hjemme i types.h?',
    options: [
      'WiFi-password',
      'Fælles structs som SensorReading uden hardware',
      'Hele loop()',
      'Kun #include <Arduino.h>',
    ],
    correctIndex: 1,
    explanation:
      'types.h deler datamodellen mellem moduler uden at trække hardware ind.',
  },
  {
    id: 'q8',
    question: 'Hvor skal WiFi-password ligge?',
    options: [
      'I config.h (commit OK)',
      'I secrets.h (fra example, ikke i git)',
      'I types.h',
      'Som kommentar i main.cpp',
    ],
    correctIndex: 1,
    explanation: 'config.h er safe to commit; secrets hører i secrets.h som er gitignored.',
  },
]

const STORAGE_KEY = 'cpp-videnstjek'

export function loadQuizAnswers(): Record<string, number> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    return JSON.parse(raw) as Record<string, number>
  } catch {
    return {}
  }
}

export function saveQuizAnswer(id: string, optionIndex: number) {
  const all = loadQuizAnswers()
  all[id] = optionIndex
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all))
}

export function clearQuizAnswers() {
  localStorage.removeItem(STORAGE_KEY)
}
