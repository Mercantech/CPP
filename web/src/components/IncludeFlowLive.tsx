import { useEffect, useState } from 'react'

const STEPS = [
  ['main.cpp'],
  ['main.cpp', '#include "environment_sensors.h"'],
  ['main.cpp', '#include "environment_sensors.h"', 'types.h (SensorReading)'],
  [
    'main.cpp',
    '#include "environment_sensors.h"',
    'types.h (SensorReading)',
    'environment_sensors.cpp',
  ],
]

export default function IncludeFlowLive() {
  const [step, setStep] = useState(0)
  const active = STEPS[step] ?? STEPS[0]

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = window.setInterval(() => {
      setStep((s) => (s + 1) % STEPS.length)
    }, 1400)
    return () => window.clearInterval(id)
  }, [])

  return (
    <div className="include-flow include-flow--live" aria-label="Include flow animation">
      {active.map((chip, i) => (
        <span key={`${chip}-${i}`} style={{ display: 'contents' }}>
          {i > 0 ? <span aria-hidden>→</span> : null}
          <span
            className={
              i === active.length - 1
                ? 'include-flow__chip include-flow__chip--active'
                : 'include-flow__chip'
            }
          >
            {chip}
          </span>
        </span>
      ))}
    </div>
  )
}
