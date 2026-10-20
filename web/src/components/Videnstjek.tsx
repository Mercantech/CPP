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
  initial,
  onAnswered,
}: {
  q: QuizQuestion
  initial?: number
  onAnswered: () => void
}) {
  const [selected, setSelected] = useState<number | undefined>(initial)
  const answered = selected !== undefined

  function choose(i: number) {
    if (answered) return
    setSelected(i)
    saveQuizAnswer(q.id, i)
    onAnswered()
  }

  return (
    <div className="quiz">
      <p className="quiz__q">{q.question}</p>
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
              disabled={answered}
              onClick={() => choose(i)}
            >
              {opt}
            </button>
          )
        })}
      </div>
      {answered ? (
        <div
          className={
            selected === q.correctIndex
              ? 'quiz__feedback quiz__feedback--ok'
              : 'quiz__feedback quiz__feedback--bad'
          }
        >
          {selected === q.correctIndex ? 'Korrekt. ' : 'Ikke helt. '}
          {q.explanation}
        </div>
      ) : null}
    </div>
  )
}

export default function Videnstjek() {
  const [answers, setAnswers] = useState(() => loadQuizAnswers())
  const [, bump] = useState(0)

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

  function refresh() {
    setAnswers(loadQuizAnswers())
    bump((n) => n + 1)
  }

  function reset() {
    clearQuizAnswers()
    setAnswers({})
    bump((n) => n + 1)
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
            ? 'Besvar spørgsmålene nedenfor — svar gemmes lokalt i browseren.'
            : score.answered < score.total
              ? `${score.answered} af ${score.total} besvaret.`
              : score.correct === score.total
                ? 'Alle rigtige — stærkt arbejde!'
                : 'Gennemgå forklaringerne og prøv igen.'}
        </p>
        {score.answered > 0 ? (
          <button type="button" className="btn btn--ghost" onClick={reset}>
            Nulstil videnstjek
          </button>
        ) : null}
      </div>

      {quizQuestions.map((q) => (
        <QuestionCard
          key={q.id}
          q={q}
          initial={answers[q.id]}
          onAnswered={refresh}
        />
      ))}
    </div>
  )
}
