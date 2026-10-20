import { useMemo, useState } from 'react'
import {
  clearQuizAnswers,
  loadQuizAnswers,
  quizQuestions,
  saveQuizAnswer,
  type QuizQuestion,
} from '../data/quizzes'

function QuestionCard({
  q,
  selected,
  onAnswered,
}: {
  q: QuizQuestion
  selected?: number
  onAnswered: (optionIndex: number) => void
}) {
  const answered = selected !== undefined
  const feedbackId = `quiz-${q.id}-feedback`

  function choose(i: number) {
    if (answered) return
    onAnswered(i)
  }

  return (
    <section className="quiz" aria-labelledby={`quiz-${q.id}-question`}>
      <p className="quiz__q" id={`quiz-${q.id}-question`}>{q.question}</p>
      <div className="quiz__options">
        {q.options.map((opt, i) => {
          let cls = ''
          if (answered) {
            if (i === q.correctIndex) cls = 'correct'
            else if (i === selected) cls = 'wrong'
          }
          return (
            <button
              key={opt}
              type="button"
              className={cls || undefined}
              aria-pressed={selected === i}
              aria-disabled={answered}
              aria-describedby={answered ? feedbackId : undefined}
              onClick={() => choose(i)}
            >
              {opt}
            </button>
          )
        })}
      </div>
      <div
        id={feedbackId}
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className={answered
          ? selected === q.correctIndex
              ? 'quiz__feedback quiz__feedback--ok'
              : 'quiz__feedback quiz__feedback--bad'
          : undefined}
      >
        {answered ? <>{selected === q.correctIndex ? 'Korrekt. ' : 'Ikke helt. '}{q.explanation}</> : null}
      </div>
    </section>
  )
}

export default function Videnstjek() {
  const [answers, setAnswers] = useState(() => loadQuizAnswers())
  const [storageMessage, setStorageMessage] = useState('')

  const score = useMemo(() => {
    let correct = 0
    let answered = 0
    for (const q of quizQuestions) {
      if (answers[q.id] === undefined) continue
      answered++
      if (answers[q.id] === q.correctIndex) correct++
    }
    return { correct, answered, total: quizQuestions.length }
  }, [answers])

  function answer(id: string, optionIndex: number) {
    const question = quizQuestions.find((q) => q.id === id)
    if (!question || answers[id] !== undefined || !Number.isInteger(optionIndex)
      || optionIndex < 0 || optionIndex >= question.options.length) return
    // React state is authoritative for this visit, even if browser storage fails.
    setAnswers((current) => ({ ...current, [id]: optionIndex }))
    if (!saveQuizAnswer(id, optionIndex)) {
      setStorageMessage('Browseren kunne ikke gemme svaret. Dine svar bevares i denne åbne visning.')
    }
  }

  function reset() {
    const cleared = clearQuizAnswers()
    setAnswers({})
    setStorageMessage(cleared ? 'Videnstjekket er nulstillet. Du kan svare igen.'
      : 'Videnstjekket er nulstillet her. Browseren kunne ikke rydde de tidligere gemte svar.')
  }

  return (
    <div>
      <div className="quiz-summary">
        <p>Din score</p>
        <p className="quiz-summary__score">
          {score.correct} / {score.total}
        </p>
        <p>
          {score.answered === 0
            ? 'Besvar spørgsmålene nedenfor — svar gemmes lokalt, når browseren tillader det.'
            : score.answered < score.total
              ? `${score.answered} af ${score.total} besvaret.`
              : score.correct === score.total
                ? 'Alle rigtige — stærkt arbejde!'
                : 'Gennemgå forklaringerne og prøv igen.'}
        </p>
        <button type="button" className="btn btn--ghost" onClick={reset}>
          Nulstil videnstjek
        </button>
        <p role="status" aria-live="polite" aria-atomic="true">{storageMessage}</p>
      </div>

      {quizQuestions.map((q) => (
        <QuestionCard
          key={q.id}
          q={q}
          selected={answers[q.id]}
          onAnswered={(optionIndex) => answer(q.id, optionIndex)}
        />
      ))}
    </div>
  )
}
