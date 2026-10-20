# SensorLog · C++20-starter

Dette er et elevprojekt til H5. Starteren læser og validerer filen. Statistik,
sensorfilter og eksport er opgaver, du selv implementerer.

## Byg og kør

En C++20-kompatibel compiler og CMake er nødvendige. Kør fra denne mappe:

```sh
cmake -S . -B build
cmake --build build --config Debug
```

Med en Visual Studio-generator i Developer PowerShell:

```powershell
.\build\Debug\sensorlog.exe measurements.csv
```

Med en enkeltkonfigurationsgenerator på Linux/macOS:

```sh
./build/sensorlog measurements.csv
```

Med Ninja på Windows ligger programmet typisk i `build\sensorlog.exe`.
Se dit buildoutput, hvis stien er anderledes.

Direkte med GCC:

```sh
g++ -std=c++20 -Wall -Wextra -Wpedantic main.cpp SensorLog.cpp -o sensorlog
./sensorlog measurements.csv
```

Hvis Docker er tilgængelig:

```sh
docker build -t cpp-sensorlog .
docker run --rm cpp-sensorlog
```

Dockerbilledet indeholder kode og datasæt fra buildtidspunktet. Byg igen efter
ændringer. Programmet kræver ingen netforbindelse ved kørsel.

## Dataformat

- Første linje er præcis `sensor,second,celsius`.
- Tre felter pr. datalinje, komma som separator, punktum som decimaltegn.
- Ingen citerede felter eller kommaer inde i felter i dette undervisningsformat.
- Sensor-id består af mindst ét ASCII-bogstav, ciffer, bindestreg eller underscore.
- Second er et heltal fra 0 og op.
- Temperaturen er endelig og mellem -50 og 150 inklusive.
- Tomme datalinjer tælles som afviste linjer.
- Dubletter bevares, og filens rækkefølge bevares.
- Brug UTF-8 uden BOM eller ASCII. LF og CRLF accepteres.

En manglende fil eller forkert/manglende header giver status 1.
Forkert antal programargumenter giver status 2.
Ugyldige datalinjer tælles og giver linjenummer på stderr; de øvrige behandles.
Et gyldigt, tomt datasæt (kun header) giver en besked og status 0.

## Starterens forventede resultat

```text
Gyldige: 4, afvist: 2
A @ 0 s: 21.5 C
B @ 1 s: 24 C
A @ 2 s: 19.5 C
A @ 3 s: 26 C
```

Stderr viser `Afvist linje 6` og `Afvist linje 7`.
Den indbyrdes visningsrækkefølge mellem stdout og stderr kan variere.

## Dine næste milepæle

1. Tilføj min, max, gennemsnit og alarmer strengt over 23.0 °C.
2. Repræsentér "ingen data" tydeligt, eksempelvis med optional.
3. Filtrér pr. sensor uden at slette loggens oprindelige data.
4. Eksportér en rapport med kontrolleret åbning og skrivning.
5. Dokumentér grænsetilfælde og dine kendte begrænsninger.

For alle gyldige målinger: min 19.50, max 26.00, gennemsnit 22.75, 2 alarmer.
For sensor A: 3 målinger, gennemsnit cirka 22.33, 1 alarm.
For sensor B: 1 måling på 24.00, 1 alarm.

## Afprøvning

Prøv et header-only datasæt, én måling, en ukendt sensor, præcis 23.0 °C,
intervalgrænserne -50 og 150 samt input som `12abc` og et ekstra felt.
Prøv en filsti, der ikke findes, og en eksportsti, der ikke kan åbnes.

Modelklassen ejer data. En const-reference fra readings() er et lån, som kræver,
at loggen stadig lever; lån til elementer må ikke bruges efter ændringer, der
invalidérer dem. Ingen rå new/delete er nødvendige.
