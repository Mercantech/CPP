import { useState } from 'react'

type Choice = { id: string; text: string }
type PredictionProps = {
  questionKey: string
  question: string
  choices: Choice[]
  correctId: string
  explanation: string
}

export default function Prediction({ questionKey, question, choices, correctId, explanation }: PredictionProps) {
  const [answer, setAnswer] = useState<{ key: string; id: string } | null>(null)
  const selected = answer?.key === questionKey ? answer.id : null
  const correct = selected === correctId

  return (
    <div className="lab-quiz">
      <p className="lab-eyebrow">Forudsig → afprøv → forklar</p>
      <fieldset>
        <legend>{question}</legend>
        <div className="lab-quiz__options">
          {choices.map((choice) => (
            <button
              type="button"
              className={`lab-quiz__option${selected === choice.id ? ' is-active' : ''}`}
              key={choice.id}
              aria-pressed={selected === choice.id}
              onClick={() => setAnswer({ key: questionKey, id: choice.id })}
            >
              {choice.text}
            </button>
          ))}
        </div>
      </fieldset>
      <div className={`lab-feedback${selected ? correct ? ' is-correct' : ' is-wrong' : ''}`} aria-live="polite" aria-atomic="true">
        {selected ? <p><strong>{correct ? 'Præcis! ' : 'Prøv tanken igen. '}</strong>{explanation}</p>
          : <p>Vælg din forudsigelse. Et forkert svar er et godt sted at begynde.</p>}
      </div>
    </div>
  )
}
