export type HistoryEra = {
  id: string
  year: string
  yearSort: number
  title: string
  summary: string
  detail: string[]
  tags: string[]
  image?: { src: string; alt: string; caption: string; sourceUrl?: string }
  logo?: string
}

export const historyEras: HistoryEra[] = [
  {
    id: 'simula',
    year: '1967',
    yearSort: 1967,
    title: 'Simula — klasser før C++',
    summary:
      'Simula 67 introducerer klasser og objekter. Stroustrup møder idéerne senere og vil have dem uden at miste C’s hastighed.',
    detail: [
      'Simula blev udviklet i Norge til simulationsprogrammering.',
      'Det er et af de første objektorienterede sprog — men ikke tæt nok på hardware til systemkode.',
      'C++’s “classes” er direkte inspireret herfra, kombineret med C’s model.',
    ],
    tags: ['OOP', 'inspiration'],
  },
  {
    id: 'unix',
    year: '1969–71',
    yearSort: 1969,
    title: 'Unix på Bell Labs',
    summary:
      'Bell Labs bygger Unix. Behovet for et portabelt systemsprog vokser — assembly er for tungt på tværs af maskiner.',
    detail: [
      'Ken Thompson og Dennis Ritchie arbejder på Unix i Murray Hill, New Jersey.',
      'Tidlige versioner er skrevet i assembly; portabilitet bliver et problem.',
      'Det skaber plads til et sprog, der er “højt nok” til mennesker, men “lavt nok” til OS-kernen.',
    ],
    tags: ['Bell Labs', 'Unix'],
  },
  {
    id: 'c',
    year: '1972',
    yearSort: 1972,
    title: 'C ser dagens lys',
    summary:
      'Dennis Ritchie skaber C. Pointers, manuel hukommelse, få abstraktioner — ekstremt effektivt og snart lingua franca for systemprogrammering.',
    detail: [
      'C erstatter B og bliver det sprog, Unix skrives om i.',
      'Styrken er kontrol: du kan næsten se maskinkoden i spejlet.',
      'Svagheden i store projekter: få værktøjer til at modellere data og adfærd sammen — spaghetti vokser.',
      'K&R-bogen (1978) spreder C til hele verden.',
    ],
    tags: ['C', 'Dennis Ritchie'],
    image: {
      src: '/history/ritchie.jpg',
      alt: 'Dennis Ritchie',
      caption: 'Dennis Ritchie — skaberen af C',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Dennis_Ritchie_2011.jpg',
    },
    logo: '/history/c.svg',
  },
  {
    id: 'c-with-classes',
    year: '1979',
    yearSort: 1979,
    title: '“C with Classes”',
    summary:
      'Danske Bjarne Stroustrup starter på Bell Labs. Målet: C’s effektivitet + Simula’s klasser.',
    detail: [
      'Stroustrup har skrevet Simula-agtig kode og savner abstraktion i C.',
      'Første skridt er en præprocessor oven på C — ikke et helt nyt sprog endnu.',
      'Designprincippet formes tidligt: du betaler ikke for det, du ikke bruger.',
    ],
    tags: ['Bjarne Stroustrup', 'Bell Labs'],
    image: {
      src: '/history/bjarnestroustrup.jpg',
      alt: 'Bjarne Stroustrup',
      caption: 'Bjarne Stroustrup — designer af C++',
      sourceUrl: 'https://da.wikipedia.org/wiki/Fil:BjarneStroustrup.jpg',
    },
  },
  {
    id: 'cpp-named',
    year: '1983–85',
    yearSort: 1983,
    title: 'Navnet C++ og første udgivelse',
    summary:
      'Sproget får navnet C++ (ordspil på ++-operatoren). Kommercielle compilere og bøger følger midt i 80’erne.',
    detail: [
      'C++ betyder bogstaveligt “C plus én” — næste version af C.',
      'Virtuelle funktioner, overloading og reference-typer lander i denne periode.',
      'Sproget spredes i industrien: telekom, finans, CAD og senere spil.',
    ],
    tags: ['C++', 'navngivning'],
    logo: '/history/cplusplus.svg',
  },
  {
    id: 'cpp2',
    year: '1989–90',
    yearSort: 1989,
    title: 'C++ 2.0 — mere sprogkraft',
    summary:
      'Multiple inheritance, abstrakte klasser og bedre type-system. C++ bliver et “rigtigt” industrielt sprog.',
    detail: [
      'Templatede biblioteker er stadig på vej, men OOP-modellen er moden.',
      'Diskussionen om kompleksitet starter — og er aldrig rigtig stoppet.',
      'Samtidig skriver flere store codebases stadig blandet C og C++.',
    ],
    tags: ['evolution'],
  },
  {
    id: 'cpp98',
    year: '1998',
    yearSort: 1998,
    title: 'ISO C++98',
    summary:
      'Første ISO-standard. STL (containere, iteratorer, algorithms) gør generisk programmering mainstream.',
    detail: [
      'Standardisering betyder portabilitet mellem compilere.',
      'STL ændrer, hvordan man skriver biblioteker — templates bliver centrale.',
      'C++ er nu både system- og applikationssprog i stor skala.',
    ],
    tags: ['ISO', 'STL'],
  },
  {
    id: 'java',
    year: '1995',
    yearSort: 1995,
    title: 'Java — managed C-familie',
    summary:
      'Java tager C-agtig syntaks og klasser, men kører på JVM med garbage collection. “Write once, run anywhere”.',
    detail: [
      'James Gosling m.fl. designer Java hos Sun.',
      'Samme familiære look (krøllede parenteser, klasser) — anden kontrakt: ingen rå pointers.',
      'Viser at C-familiens mentale model kan leve i managed runtimes.',
    ],
    tags: ['Java', 'JVM'],
    logo: '/history/java.svg',
  },
  {
    id: 'csharp',
    year: '2000–02',
    yearSort: 2000,
    title: 'C# og .NET',
    summary:
      'Anders Hejlsberg m.fl. hos Microsoft laver C#: C-family syntaks, stærke typer, GC — det sprog I allerede kender.',
    detail: [
      'C# er bevidst genkendeligt for C/C++/Java-programmører — og omvendt: din C#-baggrund hjælper dig i C++.',
      'Hukommelse styres af runtime (GC); unsafe/pointers findes, men er undtagelsen.',
      'Når I går til C++ på Arduino, genbruger I klasser, scope og typer — men I mister GC og får headers/.cpp og tættere hardware-kontrol.',
    ],
    tags: ['C#', '.NET', 'jeres baggrund'],
    logo: '/history/csharp.svg',
  },
  {
    id: 'arduino',
    year: '2005',
    yearSort: 2005,
    title: 'Arduino — C++ til makerne',
    summary:
      'Arduino gør microcontroller-programmering tilgængelig. Under motorhjelmen er sketches C++ + Wiring-API.',
    detail: [
      'setup() og loop() er conveniens — ikke magi. Compileren ser C++.',
      'Libraries er ofte .h/.cpp-par, præcis som “rigtige” C++-moduler.',
      'Derfor er H3’s strukturerede kode direkte overførbar til større embedded-projekter.',
    ],
    tags: ['Arduino', 'embedded'],
    logo: '/history/arduino.svg',
  },
  {
    id: 'cpp11',
    year: '2011',
    yearSort: 2011,
    title: 'C++11 — modern C++',
    summary:
      'Auto, move semantics, lambda, smart pointers, threads i standarden. Et generationsskifte i, hvordan man skriver C++.',
    detail: [
      'Mange kalder C++11 starten på “modern C++”.',
      'Sikkerhed og udtryksfuldhed stiger — uden at opgive kontrol.',
      'Senere følger C++14/17 med polering.',
    ],
    tags: ['C++11', 'modern'],
  },
  {
    id: 'cpp20',
    year: '2020–23',
    yearSort: 2020,
    title: 'C++20 og C++23',
    summary:
      'Concepts, ranges, coroutines, modules (gradvist). Sproget udvikler sig stadig — mens embedded ofte bruger en ældre subset.',
    detail: [
      'På Arduino Uno bruger du typisk en ældre dialect — men principperne er de samme.',
      'På desktop/server er moderne C++ et andet dyr end 90’er-kode.',
      'At kende historien hjælper dig til at vælge det rigtige lag til opgaven.',
    ],
    tags: ['C++20', 'ISO'],
  },
  {
    id: 'today',
    year: 'I dag',
    yearSort: 2026,
    title: 'Broen til dit pensum',
    summary:
      'I kommer fra C#. H3 er springet til C++ på microcontrollers — samme sprogfamilie, anden kontrakt om hukommelse og filer.',
    detail: [
      'Når du laver funktioner og .h/.cpp på Arduino, træner du industripraksis i lille skala.',
      'Genbrug det du kan fra C#: navngivning, typer, struktur — lær det nye: manuel kontrol, headers og ingen GC.',
      'Historien er ikke nostalgi — det er kortet over, hvorfor dine værktøjer ser ud, som de gør.',
    ],
    tags: ['H3', 'C# → C++'],
  },
]

export const historyErasSorted = [...historyEras].sort((a, b) => a.yearSort - b.yearSort)
