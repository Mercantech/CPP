import { useState } from 'react'
import CodeBlock from '../CodeBlock'
import { referenceFrame } from '../../data/labsEngine'
import type { PassingMode } from '../../data/labsEngine'
import Prediction from './Prediction'

export default function ReferenceLab() {
  const [mode, setMode] = useState<PassingMode>('value')
  const [start, setStart] = useState(10)
  const [step, setStep] = useState(0)
  const frame = referenceFrame(mode, start, step)
  const reference = mode === 'reference'
  const explanations = [
    `score er oprettet med værdien ${start}. Funktionen er endnu ikke kaldt.`,
    reference
      ? 'n bindes som reference til score. De to navne betegner samme int-objekt.'
      : 'n initialiseres med en kopi af score. De to int-objekter har samme værdi, men er uafhængige.',
    reference
      ? `n += 5 ændrer det fælles objekt. Derfor er score nu ${start + 5}.`
      : `n += 5 ændrer kun den lokale kopi til ${start + 5}. score er stadig ${start}.`,
    reference
      ? 'Kaldet er afsluttet. Parameterens binding slutter, mens score lever videre med ændringen.'
      : 'Kaldet er afsluttet. Kopiens levetid er slut. Ændringen blev ikke skrevet tilbage til score.',
  ]

  function changeMode(next: PassingMode) {
    setMode(next)
    setStep(0)
  }

  return (
    <article className="lab-card" id="referencer" aria-labelledby="reference-title">
      <header className="lab-card__header">
        <span className="lab-number">01 / MEMORY</span>
        <h2 id="reference-title">Kopi eller forbindelse?</h2>
        <p>Det lille <code>&amp;</code> ændrer kontrakten. Følg et funktionskald helt ind i hukommelsen.</p>
      </header>
      <div className="lab-controls" role="group" aria-label="Vælg parameteroverførsel">
        <button type="button" className={`lab-button${!reference ? ' is-active' : ''}`} aria-pressed={!reference} onClick={() => changeMode('value')}>int n · værdi</button>
        <button type="button" className={`lab-button${reference ? ' is-active' : ''}`} aria-pressed={reference} onClick={() => changeMode('reference')}>int&amp; n · reference</button>
        <label>Startværdi
          <select value={start} onChange={(event) => { setStart(Number(event.target.value)); setStep(0) }}>
            <option value={10}>10</option><option value={42}>42</option><option value={100}>100</option>
          </select>
        </label>
      </div>
      <div className="lab-code">
        <CodeBlock>{`void addBonus(int${reference ? '&' : ''} n) {
  n += 5;
}

// Inde i setup(), efter Serial.begin(9600):
int score = ${start};
addBonus(score);
Serial.println(score);`}</CodeBlock>
      </div>
      <Prediction
        questionKey={`reference-${mode}-${start}`}
        question="Hvad udskriver Serial.println(score) efter kaldet?"
        choices={[{ id: 'unchanged', text: String(start) }, { id: 'changed', text: String(start + 5) }]}
        correctId={reference ? 'changed' : 'unchanged'}
        explanation={reference ? 'n er et alias for score. Ændringen kan ses hos den, der kaldte funktionen.' : 'Parameteren er en kopi. En ændring af n ændrer ikke den oprindelige score.'}
      />
      <div className="lab-memory" aria-label="Model af objekter og parameternavne">
        <div className="lab-memory__cell">
          <span>Objekt A · i kalderen</span><code>score</code><strong>{frame.caller}</strong>
          <small>{reference && frame.parameterAlive ? 'Navnene score og n → samme objekt' : 'Den oprindelige variabel'}</small>
        </div>
        <span className="lab-memory__connector" aria-hidden="true">{frame.parameterAlive ? reference ? '← alias' : '→ kopi' : '·'}</span>
        <div className={`lab-memory__cell${!frame.parameterAlive ? ' is-inactive' : ''}`}>
          <span>{reference ? 'Parameterbinding · i funktionen' : 'Objekt B · i funktionen'}</span>
          <code>{reference ? 'int& n' : 'int n'}</code>
          <strong>{frame.parameterAlive ? frame.parameter : '—'}</strong>
          <small>{frame.parameterAlive ? reference ? 'Intet nyt int-objekt' : 'Et selvstændigt int-objekt' : step === 0 ? 'Kaldet er ikke begyndt' : 'Parameterens levetid er slut'}</small>
        </div>
      </div>
      <div className="lab-controls" role="group" aria-label="Gå gennem funktionskaldet">
        <button type="button" className="lab-button" disabled={step === 0} onClick={() => setStep((value) => value - 1)}>← Forrige trin</button>
        <span className="lab-step-label">Trin {step + 1} / 4</span>
        <button type="button" className="lab-button" disabled={step === 3} onClick={() => setStep((value) => value + 1)}>Næste trin →</button>
        <button type="button" className="lab-button" onClick={() => setStep(0)}>Nulstil kald</button>
      </div>
      <p className="lab-explainer" aria-live="polite" aria-atomic="true">{explanations[step]}</p>
      <p className="lab-note"><strong>Tag med til din kode:</strong> Brug værdi til små input, reference når en funktion bevidst skal ændre et objekt, og <code>const T&amp;</code> til læseadgang uden en kopi af større objekter. En reference er ikke et ejerskab; det refererede objekt skal stadig leve.</p>
      <p className="lab-note">Boksene viser objekter og navne, ikke fysiske adresser eller compilerens faktiske stacklayout.</p>
      <div className="lab-sources"><a href="https://eel.is/c++draft/dcl.ref" target="_blank" rel="noreferrer">C++-arbejdsudkast: referencer ↗</a></div>
    </article>
  )
}
