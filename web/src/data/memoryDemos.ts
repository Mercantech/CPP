export type MemoryCell = {
  id: string
  label: string
  bytes: string[]
  kind?: 'stack' | 'heap' | 'global' | 'empty'
  note?: string
}

export type MemoryFrame = {
  id: string
  title: string
  cells: MemoryCell[]
}

export type MemoryStep = {
  line: number
  caption: string
  frames: MemoryFrame[]
  arrow?: { from: string; to: string; label?: string }
  warn?: string
}

export type MemoryDemo = {
  id: string
  title: string
  subtitle: string
  filename: string
  code: string
  steps: MemoryStep[]
}

export const bytesFillDemo: MemoryDemo = {
  id: 'bytes-fill',
  title: 'SRAM fyldes byte for byte',
  subtitle: 'Se hvordan typer lander i hukommelsen på en Uno-agtig model (illustrativt).',
  filename: 'sram_demo.cpp',
  code: `int temperatureRaw = 512;
float celsius = 23.5;
char unit = 'C';
int boom = 30000;
boom = boom + 10000;  // overflow!`,
  steps: [
    {
      line: 1,
      caption: 'int fylder 2 bytes på AVR/Uno. Værdien 512 gemmes som binært i SRAM.',
      frames: [
        {
          id: 'sram',
          title: 'SRAM (illustrativt)',
          cells: [
            {
              id: 'temp',
              label: 'temperatureRaw',
              kind: 'global',
              bytes: ['02', '00'],
              note: 'int · 2 bytes',
            },
          ],
        },
      ],
    },
    {
      line: 2,
      caption: 'float fylder 4 bytes — mere plads, finere præcision til temperatur.',
      frames: [
        {
          id: 'sram',
          title: 'SRAM (illustrativt)',
          cells: [
            {
              id: 'temp',
              label: 'temperatureRaw',
              kind: 'global',
              bytes: ['02', '00'],
              note: 'int · 2 bytes',
            },
            {
              id: 'celsius',
              label: 'celsius',
              kind: 'global',
              bytes: ['41', 'BC', '00', '00'],
              note: 'float · 4 bytes',
            },
          ],
        },
      ],
    },
    {
      line: 3,
      caption: 'char er ét tegn — én byte. Ikke en hel tekststreng.',
      frames: [
        {
          id: 'sram',
          title: 'SRAM (illustrativt)',
          cells: [
            {
              id: 'temp',
              label: 'temperatureRaw',
              kind: 'global',
              bytes: ['02', '00'],
              note: 'int · 2 bytes',
            },
            {
              id: 'celsius',
              label: 'celsius',
              kind: 'global',
              bytes: ['41', 'BC', '00', '00'],
              note: 'float · 4 bytes',
            },
            {
              id: 'unit',
              label: 'unit',
              kind: 'global',
              bytes: ['43'],
              note: "char 'C' · 1 byte",
            },
          ],
        },
      ],
    },
    {
      line: 4,
      caption: 'boom = 30000 — stadig inden for int (−32768…32767).',
      frames: [
        {
          id: 'sram',
          title: 'SRAM (illustrativt)',
          cells: [
            {
              id: 'boom',
              label: 'boom',
              kind: 'global',
              bytes: ['75', '30'],
              note: '30000 · OK',
            },
          ],
        },
      ],
    },
    {
      line: 5,
      caption: '30000 + 10000 = 40000 — uden for int-range. Værdien “folder” rundt.',
      warn: 'Overflow: int kan ikke holde 40000 på Uno. Resultatet bliver forkert — uden compiler-fejl.',
      frames: [
        {
          id: 'sram',
          title: 'SRAM (illustrativt)',
          cells: [
            {
              id: 'boom',
              label: 'boom',
              kind: 'global',
              bytes: ['9C', '40'],
              note: 'wrap → −25536 (typisk)',
            },
          ],
        },
      ],
    },
  ],
}

export const charVsStringDemo: MemoryDemo = {
  id: 'char-vs-string',
  title: 'char[] vs String',
  subtitle: 'C-streng i faste celler — Arduino String på heap (kan fragmentere).',
  filename: 'text_memory.cpp',
  code: `char label[8] = "hi";
// label fylder: h i \\0 . . . .
String msg = "hi";
msg += "!!!";  // vokser på heap`,
  steps: [
    {
      line: 1,
      caption: 'char label[8] reserverer 8 bytes på forhånd — forudsigeligt SRAM-forbrug.',
      frames: [
        {
          id: 'stack',
          title: 'Stack / global buffer',
          cells: [
            {
              id: 'label',
              label: 'label[8]',
              kind: 'stack',
              bytes: ['h', 'i', '\\0', '.', '.', '.', '.', '.'],
              note: 'Fast størrelse · null-termineret',
            },
          ],
        },
        {
          id: 'heap',
          title: 'Heap',
          cells: [
            {
              id: 'empty',
              label: '(tom)',
              kind: 'empty',
              bytes: ['·', '·', '·', '·'],
            },
          ],
        },
      ],
      arrow: { from: 'label', to: 'label', label: 'buffer' },
    },
    {
      line: 3,
      caption: 'String msg = "hi" allokerer på heap — mere som C# string, men uden GC der rydder op for dig.',
      frames: [
        {
          id: 'stack',
          title: 'Stack / global buffer',
          cells: [
            {
              id: 'label',
              label: 'label[8]',
              kind: 'stack',
              bytes: ['h', 'i', '\\0', '.', '.', '.', '.', '.'],
            },
            {
              id: 'msg',
              label: 'msg (handle)',
              kind: 'stack',
              bytes: ['→'],
              note: 'peger på heap',
            },
          ],
        },
        {
          id: 'heap',
          title: 'Heap',
          cells: [
            {
              id: 'blob',
              label: 'String data',
              kind: 'heap',
              bytes: ['h', 'i', '\\0'],
              note: 'dynamisk',
            },
          ],
        },
      ],
      arrow: { from: 'msg', to: 'blob', label: 'pointer' },
    },
    {
      line: 4,
      caption: 'msg += "!!!" kan flytte/omallokere heap-blokken. Gentaget i loop → fragmentering.',
      warn: 'På Uno (2 KB SRAM): undgå String i stramme loops. Foretræk char-buffere når I kan.',
      frames: [
        {
          id: 'stack',
          title: 'Stack / global buffer',
          cells: [
            {
              id: 'label',
              label: 'label[8]',
              kind: 'stack',
              bytes: ['h', 'i', '\\0', '.', '.', '.', '.', '.'],
            },
            {
              id: 'msg',
              label: 'msg (handle)',
              kind: 'stack',
              bytes: ['→'],
            },
          ],
        },
        {
          id: 'heap',
          title: 'Heap',
          cells: [
            {
              id: 'old',
              label: 'gammel blok',
              kind: 'empty',
              bytes: ['·', '·', '·'],
              note: 'efterladt hul',
            },
            {
              id: 'blob',
              label: 'String data',
              kind: 'heap',
              bytes: ['h', 'i', '!', '!', '!', '\\0'],
              note: 'ny allokering',
            },
          ],
        },
      ],
      arrow: { from: 'msg', to: 'blob', label: 'ny adresse' },
    },
  ],
}

export const stackFramesDemo: MemoryDemo = {
  id: 'stack-frames',
  title: 'Stack frames ved funktionskald',
  subtitle: 'Lokale lever kun i kaldet. Global bliver. Return popper framen.',
  filename: 'scope_demo.cpp',
  code: `int counter = 0;           // global

void bump() {
  int local = 1;           // lokal i bump
  counter = counter + local;
}

void loop() {
  bump();
}`,
  steps: [
    {
      line: 1,
      caption: 'Global counter ligger i datasegmentet — synlig fra alle funktioner.',
      frames: [
        {
          id: 'global',
          title: 'Global',
          cells: [{ id: 'counter', label: 'counter', kind: 'global', bytes: ['00', '00'], note: '0' }],
        },
        {
          id: 'stack',
          title: 'Call stack',
          cells: [{ id: 'idle', label: '(ingen frame)', kind: 'empty', bytes: ['·'] }],
        },
      ],
    },
    {
      line: 8,
      caption: 'loop() kører — en frame på stakken.',
      frames: [
        {
          id: 'global',
          title: 'Global',
          cells: [{ id: 'counter', label: 'counter', kind: 'global', bytes: ['00', '00'], note: '0' }],
        },
        {
          id: 'stack',
          title: 'Call stack',
          cells: [{ id: 'loop', label: 'loop()', kind: 'stack', bytes: ['…'], note: 'aktiv frame' }],
        },
      ],
    },
    {
      line: 3,
      caption: 'bump() kaldes — ny frame ovenpå. local = 1 lever kun her.',
      frames: [
        {
          id: 'global',
          title: 'Global',
          cells: [{ id: 'counter', label: 'counter', kind: 'global', bytes: ['00', '00'], note: '0' }],
        },
        {
          id: 'stack',
          title: 'Call stack',
          cells: [
            { id: 'loop', label: 'loop()', kind: 'stack', bytes: ['…'] },
            {
              id: 'bump',
              label: 'bump() · local',
              kind: 'stack',
              bytes: ['01', '00'],
              note: 'local = 1',
            },
          ],
        },
      ],
    },
    {
      line: 5,
      caption: 'counter opdateres via den globale — local bruges og forsvinder snart.',
      frames: [
        {
          id: 'global',
          title: 'Global',
          cells: [{ id: 'counter', label: 'counter', kind: 'global', bytes: ['01', '00'], note: '1' }],
        },
        {
          id: 'stack',
          title: 'Call stack',
          cells: [
            { id: 'loop', label: 'loop()', kind: 'stack', bytes: ['…'] },
            {
              id: 'bump',
              label: 'bump() · local',
              kind: 'stack',
              bytes: ['01', '00'],
              note: 'local = 1',
            },
          ],
        },
      ],
    },
    {
      line: 9,
      caption: 'bump() returnerer — framen poppes. local er væk. counter huskes.',
      frames: [
        {
          id: 'global',
          title: 'Global',
          cells: [{ id: 'counter', label: 'counter', kind: 'global', bytes: ['01', '00'], note: '1 · lever videre' }],
        },
        {
          id: 'stack',
          title: 'Call stack',
          cells: [{ id: 'loop', label: 'loop()', kind: 'stack', bytes: ['…'], note: 'tilbage i loop' }],
        },
      ],
    },
  ],
}

export const includeFlowDemo: MemoryDemo = {
  id: 'include-flow',
  title: 'Fra #include til linker',
  subtitle: 'Præprocessoren indsætter headeren. Linkeren finder kroppen i .cpp.',
  filename: 'build_story.cpp',
  code: `// main.cpp
#include "sensors.h"
void loop() {
  float t = readTemp();
}

// sensors.h  — deklaration
float readTemp();

// sensors.cpp — definition
float readTemp() { return 23.5; }`,
  steps: [
    {
      line: 2,
      caption: 'main.cpp beder om sensors.h — præprocessoren finder filen.',
      frames: [
        {
          id: 'files',
          title: 'Filer',
          cells: [
            { id: 'main', label: 'main.cpp', kind: 'stack', bytes: ['#incl'], note: 'kilde' },
            { id: 'h', label: 'sensors.h', kind: 'global', bytes: ['decl'], note: 'header' },
            { id: 'cpp', label: 'sensors.cpp', kind: 'empty', bytes: ['·'], note: 'venter' },
          ],
        },
      ],
      arrow: { from: 'main', to: 'h', label: '#include' },
    },
    {
      line: 7,
      caption: 'Headerens tekst indsættes mentalt i oversættelsesenheden — kontrakten er synlig.',
      frames: [
        {
          id: 'files',
          title: 'Efter præprocessor',
          cells: [
            {
              id: 'main',
              label: 'main.cpp + header',
              kind: 'stack',
              bytes: ['decl', 'loop'],
              note: 'kender readTemp()',
            },
            { id: 'cpp', label: 'sensors.cpp', kind: 'heap', bytes: ['body'], note: 'egen enhed' },
          ],
        },
      ],
      arrow: { from: 'main', to: 'cpp', label: 'mangler krop' },
    },
    {
      line: 11,
      caption: 'Compileren oversætter hver .cpp for sig. Linkeren limer readTemp-kaldet til kroppen.',
      frames: [
        {
          id: 'files',
          title: 'Linker',
          cells: [
            { id: 'main', label: 'main.o', kind: 'stack', bytes: ['call'], note: 'ubrudt symbol' },
            { id: 'cpp', label: 'sensors.o', kind: 'heap', bytes: ['def'], note: 'leverer symbol' },
            {
              id: 'elf',
              label: 'firmware.elf',
              kind: 'global',
              bytes: ['OK'],
              note: 'samlet program',
            },
          ],
        },
      ],
      arrow: { from: 'main', to: 'cpp', label: 'link' },
    },
  ],
}
