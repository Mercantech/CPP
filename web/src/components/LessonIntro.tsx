import type { ReactNode } from 'react'

type LessonIntroProps = {
  kicker?: string
  children: ReactNode
}

export default function LessonIntro({ kicker = 'H3', children }: LessonIntroProps) {
  return (
    <div className="lesson-intro">
      <span className="lesson-intro__kicker">{kicker}</span>
      <div className="lesson-intro__text">{children}</div>
    </div>
  )
}
