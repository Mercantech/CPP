import { useState } from 'react'
import CodeBlock from '../CodeBlock'
import { byteAddition, byteBits, divisionModel, signedIntAddition } from '../../data/labsEngine'
import Prediction from './Prediction'

type TypeMode = 'byte' | 'signed' | 'division'

function Bits({ value }: { value: number }) {
  return (
    <div className="lab-bit-row" aria-label={`${value} skrevet med 8 bit: ${byteBits(value).join('')}`}>
      {byteBits(value).map((bit, index) => (
        <span key={index} className={`lab-bit${bit ? ' is-on' : ''}`} aria-hidden="true">
          <small>{2 ** (7 - index)}</small><strong>{bit}</strong>
        </span>
      ))}
    </div>
  )
}

function ByteExperiment() {
  const [start, setStart] = useState(250)
  const [addition, setAddition] = useState(10)
  const { intermediate, stored } = byteAddition(start, addition)
  const wrapped = intermediate > 255

  return (
    <>
      <div className="lab-controls">
        <label>Startbyte: <output>{start}</output>
          <input type="range" min={0} max={255} value={start} onChange={(event) => setStart(Number(event.target.value))} />
        </label>
        <label>Læg til
          <select value={addition} onChange={(event) => setAddition(Number(event.target.value))}>
            <option value={1}>1</option><option value={10}>10</option><option value={20}>20</option>
          </select>
        </label>
      </div>
      <div className="lab-code"><CodeBlock>{`uint8_t level = ${start};
level = level + ${addition};
// level er nu ${stored}`}</CodeBlock></div>
      <Bits value={stored} />
      <div className="lab-metrics">
        <div className="lab-metric"><span>Mellemregning · int</span><strong>{intermediate}</strong></div>
        <div className="lab-metric"><span>Gemt · uint8_t</span><strong>{stored}</strong></div>
        <div className="lab-metric"><span>8 bit · 256 værdier</span><strong>0 … 255</strong></div>
      </div>
      <p className="lab-explainer">{wrapped ? `${intermediate} passer ikke i 8 bit. Ved konverteringen tilbage til uint8_t bliver værdien ${intermediate} modulo 256 = ${stored}.` : `${intermediate} passer i en uint8_t, så den gemte værdi er uændret.`} På UNO R3 promoveres <code>level</code> først til <code>int</code> i additionen; det er konverteringen tilbage, der giver wrap her.</p>
      <Prediction questionKey="byte-prediction" question="Uden at flytte skyderen: hvad giver uint8_t n = 255; n = n + 1;?"
        choices={[{ id: 'zero', text: '0' }, { id: '256', text: '256' }, { id: 'undefined', text: 'Udefineret adfærd' }]} correctId="zero"
        explanation="Additionens int-resultat er 256. Konverteringen til uint8_t giver 256 modulo 256 = 0. Det er defineret adfærd." />
    </>
  )
}

function SignedExperiment() {
  const [start, setStart] = useState(32767)
  const [addition, setAddition] = useState(1)
  const result = signedIntAddition(start, addition)

  return (
    <>
      <div className="lab-controls">
        <label>UNO R3 int
          <select value={start} onChange={(event) => setStart(Number(event.target.value))}>
            <option value={32766}>32766</option><option value={32767}>32767</option><option value={-32768}>−32768</option>
          </select>
        </label>
        <label>Ændring
          <select value={addition} onChange={(event) => setAddition(Number(event.target.value))}>
            <option value={1}>+1</option><option value={-1}>−1</option>
          </select>
        </label>
      </div>
      <div className="lab-code"><CodeBlock>{`// UNO R3 (AVR): int er 16 bit
int counter = ${start};
counter += ${addition};${!result.defined ? ' // STOP: signed overflow' : ''}`}</CodeBlock></div>
      <div className={`lab-feedback ${result.defined ? 'is-correct' : 'is-wrong'}`} aria-live="polite" aria-atomic="true">
        <p><strong>{result.defined ? `Defineret resultat: ${result.result}` : 'Udefineret adfærd: intet C++-resultat loves.'}</strong>{!result.defined && ` Den matematiske sum ${result.mathematical} ligger uden for −32768 … 32767. Modellen viser derfor ingen opdigtet wrap-værdi.`}</p>
      </div>
      <p className="lab-explainer">En større destination redder ikke en addition, som allerede er løbet over. Gør en operand større <em>før</em> regnestykket:</p>
      <div className="lab-code"><CodeBlock>{`int original = ${start};
long safe = static_cast<long>(original) + (${addition});
// safe er ${result.mathematical}L
// Brug denne beregning i stedet for counter += ... ovenfor.`}</CodeBlock></div>
      <Prediction questionKey="signed-prediction" question="På UNO R3: er int n = 32767; n += 1; en sikker måde at få −32768 på?"
        choices={[{ id: 'no', text: 'Nej · signed overflow er udefineret' }, { id: 'yes', text: 'Ja · alle heltal wrapper' }]} correctId="no"
        explanation="Signed overflow giver udefineret adfærd i C++. Et observeret wrap på hardware er ikke en garanti, du må bygge din kode på." />
    </>
  )
}

function DivisionExperiment() {
  const [dividend, setDividend] = useState(7)
  const [divisor, setDivisor] = useState(2)
  const result = divisionModel(dividend, divisor)
  const floating = result.floatDivision.toLocaleString('da-DK', { maximumFractionDigits: 6 })

  return (
    <>
      <div className="lab-controls">
        <label>Tæller a
          <select value={dividend} onChange={(event) => setDividend(Number(event.target.value))}>
            <option value={7}>7</option><option value={8}>8</option><option value={-7}>−7</option>
          </select>
        </label>
        <label>Nævner b
          <select value={divisor} onChange={(event) => setDivisor(Number(event.target.value))}>
            <option value={2}>2</option><option value={3}>3</option><option value={4}>4</option>
          </select>
        </label>
      </div>
      <div className="lab-code"><CodeBlock>{`int a = ${dividend};
int b = ${divisor};

int whole = a / b;
float surprise = a / b;
float fraction = static_cast<float>(a) / b;`}</CodeBlock></div>
      <div className="lab-metrics">
        <div className="lab-metric"><span>int whole</span><strong>{result.integer}</strong></div>
        <div className="lab-metric"><span>float surprise</span><strong>{result.assignedToFloat.toFixed(1).replace('.', ',')}</strong></div>
        <div className="lab-metric"><span>float fraction ≈</span><strong>{floating}</strong></div>
      </div>
      <p className="lab-explainer">Operandernes typer bestemmer divisionen. To <code>int</code>-operander fjerner brøkdelen mod nul, også når tælleren er negativ. Resultatet er allerede afkortet, før det gemmes i <code>surprise</code>. En konvertering <em>før</em> divisionen bevarer muligheden for en brøkdel.</p>
      <p className="lab-note">Resten er <code>a % b = {result.remainder}</code>, så <code>{result.integer} × {divisor} + ({result.remainder}) = {dividend}</code>. Float-resultatet vises afrundet; binære flydende tal kan være tilnærmelser.</p>
      <Prediction questionKey="division-prediction" question="Hvad bliver float x = 7 / 2;?"
        choices={[{ id: '3', text: '3,0' }, { id: '3.5', text: '3,5' }, { id: '4', text: '4,0' }]} correctId="3"
        explanation="7 og 2 er int-litteraler. Først fås heltalsresultatet 3; derefter konverteres 3 til float. Skriv fx 7.0f / 2 for at få 3,5." />
    </>
  )
}

export default function TypesLab() {
  const [mode, setMode] = useState<TypeMode>('byte')
  // Keep every experiment mounted so switching modes preserves each attempt.
  return (
    <article className="lab-card" id="bits" aria-labelledby="types-title">
      <header className="lab-card__header">
        <span className="lab-number">02 / TYPE SYSTEM</span>
        <h2 id="types-title">Tænk som en byte</h2>
        <p>Samme regnestykke. Forskellige typer. Meget forskellige konsekvenser.</p>
      </header>
      <p className="lab-note"><strong>Platform: Arduino UNO R3 / ATmega328P.</strong> Her er <code>int</code> 16 bit. En UNO R4 eller en PC kan have andre størrelser; <code>uint8_t</code> er præcis 8 bit på platforme, der tilbyder typen.</p>
      <div className="lab-controls" role="group" aria-label="Vælg typeeksperiment">
        {([{ id: 'byte', text: 'uint8_t · wrap' }, { id: 'signed', text: 'int · grænsen' }, { id: 'division', text: '/ · division' }] as const).map((item) => (
          <button key={item.id} type="button" className={`lab-button${mode === item.id ? ' is-active' : ''}`} aria-pressed={mode === item.id} onClick={() => setMode(item.id)}>{item.text}</button>
        ))}
      </div>
      <div hidden={mode !== 'byte'}><ByteExperiment /></div>
      <div hidden={mode !== 'signed'}><SignedExperiment /></div>
      <div hidden={mode !== 'division'}><DivisionExperiment /></div>
      <div className="lab-sources">
        <a href="https://docs.arduino.cc/language-reference/en/variables/data-types/int/" target="_blank" rel="noreferrer">Arduino: int og platforme ↗</a>
        <a href="https://eel.is/c++draft/basic.fundamental" target="_blank" rel="noreferrer">C++: unsigned og signed ↗</a>
        <a href="https://eel.is/c++draft/expr.mul" target="_blank" rel="noreferrer">C++: division ↗</a>
      </div>
    </article>
  )
}
