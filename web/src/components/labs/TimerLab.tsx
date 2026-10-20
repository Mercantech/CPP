import { useState } from 'react'
import CodeBlock from '../CodeBlock'
import { advanceTimer, createTimer, elapsedMillis, MILLIS_NEAR_WRAP } from '../../data/labsEngine'
import Prediction from './Prediction'

export default function TimerLab() {
  const [nearWrap, setNearWrap] = useState(false)
  const [interval, setInterval] = useState(500)
  const [timer, setTimer] = useState(() => createTimer())
  const latest = timer.history.at(-1)
  const sincePrevious = elapsedMillis(timer.now, timer.previous)

  function reset(startNearWrap = nearWrap) {
    setTimer(createTimer(startNearWrap ? MILLIS_NEAR_WRAP : 0))
  }

  return (
    <article className="lab-card" id="millis" aria-labelledby="timer-title">
      <header className="lab-card__header">
        <span className="lab-number">03 / EMBEDDED TIME</span>
        <h2 id="timer-title">Blink uden at stå stille</h2>
        <p>Du styrer tiden. <code>loop()</code> tjekker uret og kan arbejde videre mellem blinkene.</p>
      </header>
      <div className="lab-controls">
        <label>Startscenarie
          <select value={nearWrap ? 'wrap' : 'normal'} onChange={(event) => { const wrap = event.target.value === 'wrap'; setNearWrap(wrap); reset(wrap) }}>
            <option value="normal">Fra 0 ms</option><option value="wrap">300 ms før unsigned wrap</option>
          </select>
        </label>
        <label>Blinkinterval
          <select value={interval} onChange={(event) => { setInterval(Number(event.target.value)); reset() }}>
            <option value={500}>500 ms</option><option value={1000}>1000 ms</option>
          </select>
        </label>
      </div>
      <div className="lab-code"><CodeBlock>{`const unsigned long interval = ${interval}UL;
unsigned long previous = 0;
bool ledOn = false;

void setup() {
  pinMode(LED_BUILTIN, OUTPUT);
  digitalWrite(LED_BUILTIN, LOW);
  previous = millis();
}

void loop() {
  const unsigned long now = millis();
  if (now - previous >= interval) {
    previous = now;
    ledOn = !ledOn;
    digitalWrite(LED_BUILTIN, ledOn ? HIGH : LOW);
  }
  // Læs knapper/sensorer her på hver tur.
}`}</CodeBlock></div>
      <div className="lab-metrics">
        <div className="lab-metric"><span>millis() · now</span><strong>{timer.now.toLocaleString('da-DK')}</strong><small>ms · unsigned long på UNO R3</small></div>
        <div className="lab-metric"><span>previous</span><strong>{timer.previous.toLocaleString('da-DK')}</strong><small>ms · seneste skift / start</small></div>
        <div className={`lab-metric lab-status${timer.led ? ' is-on' : ''}`}><span>LED_BUILTIN</span><strong>{timer.led ? 'HIGH ●' : 'LOW ○'}</strong><small>{timer.toggles} skift · {timer.loops} loop-tjek</small></div>
      </div>
      <div className="lab-controls" role="group" aria-label="Flyt den virtuelle tid og kør ét loop-tjek">
        {[100, 250, 1000].map((delta) => <button key={delta} type="button" className="lab-button" onClick={() => setTimer((state) => advanceTimer(state, delta, interval))}>+{delta} ms → loop()</button>)}
        <button type="button" className="lab-button" onClick={() => reset()}>Nulstil ur</button>
      </div>
      <div className="lab-explainer" aria-live="polite" aria-atomic="true">
        {latest ? <p>{latest.wrapped && <strong>Uret passerede 2³² og begyndte forfra. </strong>}Tjek #{latest.loop}: <code>now - previous</code> gav {latest.elapsed} ms før <code>if</code>-blokken. {latest.fired ? `LED skiftede, og previous blev sat til now. Derfor er forskellen nu ${sincePrevious} ms.` : `Det er under ${interval} ms: LED beholdt sin tilstand, og loop() kunne arbejde videre.`}</p>
          : <p>Vælg et tidstrin. Hvert klik flytter uret og udfører præcis ét tjek af <code>if</code>-betingelsen. Startens <code>previous</code> er lig <code>now</code>.</p>}
      </div>
      <div className="lab-timeline" role="log" aria-label="De seneste seks loop-tjek">
        <p className="lab-eyebrow">Sporing / seneste 6 tjek</p>
        {timer.history.length === 0 ? <p>Ingen tjek endnu. Prøv fem trin på +100 ms.</p> : timer.history.map((tick) => (
          <div className={`lab-tick${tick.fired ? ' is-fired' : ''}`} key={tick.loop}>
            <span>#{tick.loop}</span><code>{tick.now} ms</code><span>Δ {tick.elapsed} ms</span><strong>{tick.fired ? 'SKIFT' : 'FORTSÆT'}</strong>{tick.wrapped && <span>↺ wrap</span>}
          </div>
        ))}
      </div>
      <Prediction questionKey="timer-wrap" question="previous = 4294966996UL, now = 200UL. Hvad bliver now - previous på UNO R3?"
        choices={[{ id: '500', text: '500 ms' }, { id: 'negative', text: '−4294966796 ms' }, { id: 'broken', text: 'Uret er gået i stykker' }]} correctId="500"
        explanation="32-bit unsigned subtraktion regner modulo 2³²: 200 − 4294966996 + 4294967296 = 500. Derfor kan forskellen måle dette interval hen over wrap." />
      <p className="lab-note"><strong>Prøv selv:</strong> Vælg start lige før wrap og 500 ms. Kør +250 ms to gange. Kør derefter +1000 ms: Hvorfor skifter LED kun én gang, selv om to intervaller er gået?</p>
      <p className="lab-note"><strong>Forklaringen:</strong> Denne kode sætter <code>previous = now</code> og udfører højst ét skift pr. loop-tjek. Den indhenter ikke missede blink. Den fulde blinkperiode er to skift: {interval * 2} ms ved præcise tjek.</p>
      <details className="lab-note">
        <summary>Modellens grænser og reglen for wrap</summary>
        <p>På UNO R3 wrapper den 32-bit tæller efter cirka 49,7 døgn. Forskellen er kun den virkelige forløbne tid, hvis der er gået mindre end 2³² ms siden <code>previous</code>. En hel ekstra omgang kan ikke ses i et enkelt tidsstempel. Vælg et kortere interval og tjek ofte nok til at håndtere det før en hel omgang er gået.</p>
        <p>Brug unsigned typer til både tidsstempler og interval. Sammenligning med en deadline som <code>now &gt;= previous + interval</code> fungerer ikke generelt hen over wrap. Subtraktionen er mønstret her.</p>
        <p>Dette er en model af valgte tidsstempler, ikke en CPU-, elektronik- eller realtime-simulator. Det rigtige <code>millis()</code> på 16 MHz AVR kan springe millisekundværdier over. Langsom kode og lange interrupt-pauser kan påvirke timingen.</p>
      </details>
      <div className="lab-sources">
        <a href="https://docs.arduino.cc/built-in-examples/digital/BlinkWithoutDelay/" target="_blank" rel="noreferrer">Arduino: Blink Without Delay ↗</a>
        <a href="https://docs.arduino.cc/language-reference/en/functions/time/millis/" target="_blank" rel="noreferrer">Arduino: millis() ↗</a>
      </div>
    </article>
  )
}
