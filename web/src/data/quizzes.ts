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
    question: 'Hvad er den vigtigste grund til at opdele kode i funktioner?',
    options: [
      'Arduino kræver det for at kompilere',
      'Koden bliver lettere at læse, genbruge og fejlsøge',
      'Funktioner kører altid hurtigere end loop()',
      'Det fjerner behovet for datatyper',
    ],
    correctIndex: 1,
    explanation:
      'Funktioner gør koden mere overskuelig, genbrugelig og lettere at teste — det er kernen i struktureret programmering.',
  },
  {
    id: 'q2',
    question: 'Hvilken datatype er bedst til en værdi fra millis()?',
    options: ['int', 'byte', 'unsigned long', 'boolean'],
    correctIndex: 2,
    explanation:
      'millis() returnerer unsigned long (0 til ~4 mia.). int bliver hurtigt for lille og overløber.',
  },
  {
    id: 'q3',
    question: 'Hvad hører typisk hjemme i en .h-fil?',
    options: [
      'Kun Serial.println-kald',
      'Funktionsprototyper, konstanter og include guards',
      'Hele loop()-funktionen',
      'Kun delay()-kald',
    ],
    correctIndex: 1,
    explanation:
      'Headeren er “indholdsfortegnelsen”: deklarationer og konstanter. Implementeringen ligger i .cpp.',
  },
  {
    id: 'q4',
    question: 'Hvornår bør du foretrække en lokal variabel?',
    options: [
      'Når data kun bruges inde i én funktion',
      'Altid — globale variabler er forbudt',
      'Kun i setup()',
      'Når værdien skal deles mellem alle filer',
    ],
    correctIndex: 0,
    explanation:
      'Lokale variabler begrænser synlighed og levetid til funktionen — det gør fejlsøgning lettere.',
  },
  {
    id: 'q5',
    question: 'Hvilken navngivning følger typisk Arduino/C++ kodestandard for en konstant pin?',
    options: ['ledPin', 'LED_PIN', 'Led_pin', 'lp'],
    correctIndex: 1,
    explanation: 'Konstanter skrives i UPPER_SNAKE_CASE, fx LED_PIN. Variabler/funktioner i camelCase.',
  },
  {
    id: 'q6',
    question: 'Hvad gør et include guard (#ifndef / #define / #endif)?',
    options: [
      'Stopper programmet hvis pin er forkert',
      'Forhindrer at headeren inkluderes flere gange og giver dobbeltdefinitioner',
      'Gør koden hurtigere ved runtime',
      'Erstatter behovet for #include <Arduino.h>',
    ],
    correctIndex: 1,
    explanation:
      'Guards sikrer at header-indhold kun behandles én gang pr. oversættelsesenhed, selv hvis flere filer inkluderer den.',
  },
  {
    id: 'q7',
    question: 'Hvad bør du undgå i loop() for at holde programmet responsivt?',
    options: [
      'Korte funktionskald',
      'Lange delay() og while(true)-fælder',
      'pinMode i setup()',
      'Serial.begin(9600)',
    ],
    correctIndex: 1,
    explanation:
      'Lange blokeringer forhindrer andre opgaver (knapper, sensorer, display). Foretræk hurtig event-loop-stil.',
  },
  {
    id: 'q8',
    question: 'Hvem skabte C++?',
    options: ['Dennis Ritchie', 'Bjarne Stroustrup', 'James Gosling', 'Anders Hejlsberg'],
    correctIndex: 1,
    explanation:
      'Bjarne Stroustrup designede C++ på Bell Labs (fra “C with Classes”). Dennis Ritchie skabte C; Anders Hejlsberg er central for C#.',
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
