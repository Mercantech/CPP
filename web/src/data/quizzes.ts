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
      'millis() returnerer unsigned long. På UNO R3 er det 32 bit og tælleren starter forfra efter cirka 49,7 døgn. Brug samme unsigned type til tidsstempler og differencer.',
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
      'Et lokalt navn begrænser synligheden. En almindelig automatisk variabel lever frem til blokkens afslutning; en static lokal har længere levetid, men stadig lokalt scope.',
  },
  {
    id: 'q5',
    question: 'Hvilket navn følger dette H3-forløbs konvention for en konstant pin?',
    options: ['ledPin', 'LED_PIN', 'Led_pin', 'lp'],
    correctIndex: 1,
    explanation: 'I H3 bruger vi UPPER_SNAKE_CASE til konstanter, fx LED_PIN. Det er en teamkonvention; C++ kræver den ikke, og andre projekter kan vælge en anden stil.',
  },
  {
    id: 'q6',
    question: 'Hvad gør et include guard (#ifndef / #define / #endif)?',
    options: [
      'Stopper programmet hvis pin er forkert',
      'Behandler headerindholdet højst én gang pr. oversættelsesenhed',
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
  {
    id: 'q9',
    question: 'Hvad bliver float average = 7 / 2;?',
    options: ['3,5', '3,0', '4,0', 'En compilerfejl'],
    correctIndex: 1,
    explanation: 'Begge operander er int, så divisionen giver 3. Derefter konverteres 3 til float. Skriv fx 7.0f / 2 for at få 3,5.',
  },
  {
    id: 'q10',
    question: 'void bonus(int n) { n += 5; } kaldes med score = 10. Hvad er score bagefter?',
    options: ['15', '5', '10', 'Udefineret'],
    correctIndex: 2,
    explanation: 'n er en selvstændig kopi. Funktionen ændrer kun kopien. Med int& n ville den være en reference til score og ændre det oprindelige objekt.',
  },
  {
    id: 'q11',
    question: 'Hvilken indeksværdi er den sidste gyldige i int samples[5]?',
    options: ['5', '4', '6', 'Det afhænger af boardet'],
    correctIndex: 1,
    explanation: 'Indeks er 0, 1, 2, 3 og 4. Adgang til samples[5] ligger udenfor arrayet og giver udefineret adfærd.',
  },
  {
    id: 'q12',
    question: 'Hvad betyder static int count = 0; inde i en funktion?',
    options: ['count nulstilles på hvert kald', 'count kan ses af alle funktioner', 'count beholder sin værdi mellem kald, med et lokalt navn', 'count kan aldrig ændres'],
    correctIndex: 2,
    explanation: 'static ændrer variablens levetid: objektet varer gennem programmet. Navnet er stadig begrænset til sit scope. Det er ikke det samme som const.',
  },
  {
    id: 'q13',
    question: 'På UNO R3: uint8_t n = 255; n = n + 1; Hvad gemmes i n?',
    options: ['256', '0', '−128', 'Altid en compilerfejl'],
    correctIndex: 1,
    explanation: 'Først regnes der med int efter heltalspromovering. 256 konverteres tilbage til en 8-bit unsigned type modulo 256, så n bliver 0. Signed overflow er derimod ikke lovet wrap.',
  },
  {
    id: 'q14',
    question: 'Med INPUT_PULLUP og en knap mellem pin 2 og GND: hvad læses ved tryk?',
    options: ['HIGH', 'LOW', 'Altid 1023', 'Det skifter til OUTPUT'],
    correctIndex: 1,
    explanation: 'Pullup holder pinnen HIGH ved slip. Tryk forbinder den til GND, så digitalRead giver LOW. Et niveau er ikke det samme som en enkelt trykhændelse.',
  },
  {
    id: 'q15',
    question: 'Hvilket mønster er egnet til periodiske opgaver hen over millis()-wrap?',
    options: ['now >= previous + interval uden hensyn til wrap', 'now - previous >= interval med unsigned tidsstempler og hyppige tjek', 'Gør now til int', 'Sammenlign kun now == interval'],
    correctIndex: 1,
    explanation: 'Unsigned differencer fungerer modulo tællerens størrelse. Der må ikke gå en hel tælleromgang siden previous, og opgaven skal tjekkes ofte nok. Mønstret gør ikke i sig selv resten af koden hurtig.',
  },
  {
    id: 'q16',
    question: 'Headeren erklærer readSensor(), men ingen .cpp definerer den. Hvornår opdages det typisk, når funktionen bruges?',
    options: ['Ved linkning: undefined reference', 'Kun når sensoren bliver varm', 'Include guards opretter selv funktionen', 'Aldrig'],
    correctIndex: 0,
    explanation: 'Deklarationen gør navnet og typen kendt for compileren. Linkeren skal stadig finde en definition af den kaldte funktion. Kontroller også identisk signatur.',
  },
]

const STORAGE_KEY = 'cpp-videnstjek'

export function loadQuizAnswers(): Record<string, number> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    const parsed: unknown = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {}
    const record = parsed as Record<string, unknown>
    const answers: Record<string, number> = {}
    for (const question of quizQuestions) {
      const optionIndex = record[question.id]
      if (Object.hasOwn(record, question.id) && typeof optionIndex === 'number'
        && Number.isInteger(optionIndex) && optionIndex >= 0 && optionIndex < question.options.length) {
        answers[question.id] = optionIndex
      }
    }
    return answers
  } catch {
    return {}
  }
}

export function saveQuizAnswer(id: string, optionIndex: number) {
  const question = quizQuestions.find((q) => q.id === id)
  if (!question || !Number.isInteger(optionIndex) || optionIndex < 0 || optionIndex >= question.options.length) return false
  try {
    const all = loadQuizAnswers()
    all[id] = optionIndex
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all))
    return true
  } catch {
    return false
  }
}

export function clearQuizAnswers() {
  try {
    localStorage.removeItem(STORAGE_KEY)
    return true
  } catch {
    return false
  }
}
