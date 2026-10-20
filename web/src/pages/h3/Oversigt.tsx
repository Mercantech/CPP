import { Link } from 'react-router-dom'
import Callout from '../../components/Callout'
import CodeBlock from '../../components/CodeBlock'
import LessonLayout from '../../components/LessonLayout'
import { getModuleNav, h3Objectives } from '../../data/lessons'

export default function Oversigt() {
  return <LessonLayout module="h3">
    <p className="eyebrow">H3 / Arduino</p>
    <h1>C++ til Arduino</h1>
    <p className="lesson-lead">Her arbejder du med C++ på Arduino: fra et enkelt blink til et program med funktioner, flere filer og tidsstyring. Du øver dig i både at skrive koden og forklare, hvordan den virker.</p>
    <div className="lesson-meta"><span>Arduino UNO R3 / AVR</span><span>C++11-kompatible eksempler</span><span>Teori + laboratorier + projekt</span></div>
    <h2>Udstyr og forudsætninger</h2>
    <p>Forløbet tager udgangspunkt i en <strong>Arduino UNO R3 med ATmega328P</strong>. Det har betydning: dens <code>int</code> er 16 bit, dens SRAM er 2 KB, og mange af eksemplerne bruger 10-bit analogmålinger. Andre boards kan have andre størrelser, spændinger og API-egenskaber. Du lærer derfor både at bruge din platform og at opdage, når en antagelse skal kontrolleres.</p>
    <ul><li>Arduino IDE med boardpakken til dit board, USB-kabel og en UNO R3.</li><li>Til projektet: indbygget LED og en trykknap mellem pin 2 og GND. Ingen ekstern LED er nødvendig.</li><li>En makker, en logbog og lyst til at gøre fejl lidt mere forståelige.</li></ul>
    <Callout type="info"><p>Har du ikke hardware? Funktioner, typer, kodegennemgang og <Link to="/laboratorium">laboratoriets faste modeller</Link> kan du arbejde med alligevel. De fysiske forsøg kræver board eller en separat Arduino-simulator.</p></Callout>
    <h2>Det første program</h2>
    <p>Opret en ny sketch i Arduino IDE. Vælg board og port, verificér, og upload. <code>setup()</code> køres én gang; Arduino-miljøet kalder derefter <code>loop()</code> igen og igen. Disse indgangsfunktioner er Arduino-platformens ramme; et almindeligt desktopprogram begynder i <code>main()</code>.</p>
    <CodeBlock>{`const int LED_PIN = LED_BUILTIN;

void setup() {
  pinMode(LED_PIN, OUTPUT);
}

void loop() {
  digitalWrite(LED_PIN, HIGH);
  delay(500);
  digitalWrite(LED_PIN, LOW);
  delay(500);
}`}</CodeBlock>
    <p>LED'en er tændt et halvt sekund og slukket et halvt sekund: cirka ét helt blink pr. sekund. <code>delay()</code> gør det enkelt at begynde. Senere erstatter du ventetiden med tidsmåling, så en knap kan blive læst imens.</p>
    <details className="exercise"><summary>Første eksperiment · Fordobl blinkfrekvensen</summary><p>Forudsig ændringen, før du uploader. Halvér begge ventetider til 250 ms. En hel periode er nu 500 ms, altså cirka to blink pr. sekund. Halvér kun den ene ventetid: hvad ændrer sig så ved forholdet mellem tændt og slukket tid?</p></details>
    <h2>Det skal du kunne forklare</h2>
    <ul className="objectives">{h3Objectives.map((objective) => <li key={objective.id}><span className="objectives__id">#{objective.id}</span><span>{objective.text}</span></li>)}</ul>
    <h2>Forløbets emner</h2>
    <p>Tiderne er forslag inklusive de korte øvelser. Brug længere tid på de steder, hvor du stadig gætter. Projektet og arbejdet på hardware kommer oveni læsningen.</p>
    <div className="curriculum-list">{getModuleNav('h3').items.slice(1).map((item) => <Link to={item.path} key={item.path}><span className="curriculum-list__num">{item.num}</span><div><strong>{item.label}</strong><p>{item.description}</p></div><span className="curriculum-list__time">{item.duration} <span aria-hidden>↗</span></span></Link>)}</div>
    <h2>Sådan arbejder du med materialet</h2>
    <p>Læs en forklaring. Dæk resultatet til og forudsig adfærden. Kør eksemplet, ændr én ting, og skriv, hvad du lærte. Øvelserne går fra <strong>basis</strong> til <strong>byg videre</strong> og <strong>udfordring</strong>. Fold hints ud, når du har brug for dem — og forklar bagefter løsningen med egne ord.</p>
    <Callout type="tip"><p>Underviser? Brug <strong>Præsentér</strong> til at vise indholdet ét emne ad gangen. Interaktive forsøg bruges på den almindelige side. Lad en elev forudsige og en anden begrunde, før I undersøger resultatet sammen.</p></Callout>
    <h2>Primære kilder</h2>
    <ul><li><a href="https://docs.arduino.cc/hardware/uno-rev3/" target="_blank" rel="noreferrer">Arduino: UNO R3 og boardets specifikationer</a></li><li><a href="https://docs.arduino.cc/built-in-examples/basics/Blink/" target="_blank" rel="noreferrer">Arduino: Blink, opsætning og første upload</a></li><li><a href="https://docs.arduino.cc/built-in-examples/digital/BlinkWithoutDelay/" target="_blank" rel="noreferrer">Arduino: Blink Without Delay</a></li></ul>
  </LessonLayout>
}
