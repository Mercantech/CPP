# C++ · Pensum til H3 og H5

C++ til H3 og H5 — et dansk læringsværksted med dybe forklaringer, praktiske opgaver og interaktive modeller.

**Live:** [cpp.mercantec.tech](https://cpp.mercantec.tech)

## Lokalt

```bash
cd web
npm install
npm run dev
```

Eller med Docker:

```bash
docker compose -f docker-compose.yml -f docker-compose.local.yml up --build
```

## Indhold

- **Historie** — C → C++ → arven i C#, og forskellen på managed objekter og RAII.
- **H3** — Arduino UNO R3: funktioner, datatyper, kontrolflow/arrays, scope/levetid, filopdeling, kodestandarder, refaktorering og signalstationsprojekt. Hver faglektion har øvelser, hints, refleksion og primære kilder.
- **H5** — Desktop C++20: compiler/CMake, objekter og invariants, referencer/ejerskab/RAII, standardbiblioteket og en sensorlog med CSV-input. Downloadbare eksempler og projektstarter med Dockerfile.
- **Laboratorium** — faste interaktive modeller af værdi/reference, bits/typekonvertering og non-blocking millis-timing. Modellerne er ikke en compiler eller en hardwaresimulator.
- **Videnstjek** — 16 spørgsmål med forklaringer. Quizsvar og manuelt markerede fremskridt gemmes i denne browser; laboratoriets forsøg lever i den åbne visning.

## Kvalitetssikring

```bash
cd web
npm ci
npm run check
npm run build
```

Checks undersøger laboratoriernes semantik, robust quizlagring, alle routes, interne links, ankre, lokale assets og downloadfiler. De erstatter ikke kompilering af C++-eksemplerne eller afprøvning på et fysisk board. H3 bruger UNO R3/AVR-forudsætninger; H5 bruger en desktopcompiler med C++20.

Primære kilder er placeret ved de relevante lektioner: Arduino-dokumentationen, C++-arbejdsudkastet, C++ Core Guidelines samt CMake-, compiler- og værktøjsdokumentation. Proveniens for det nye C++-mærke findes i `web/public/brand/README.md`.
