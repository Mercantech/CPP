// Run on Node 24: node scripts/check-quiz-storage.mjs
import assert from 'node:assert/strict'
import { loadQuizAnswers, saveQuizAnswer, clearQuizAnswers, quizQuestions } from '../src/data/quizzes.ts'

const descriptor = Object.getOwnPropertyDescriptor(globalThis, 'localStorage')
const key = 'cpp-videnstjek'
let raw = null
let writes = 0
const storage = {
  getItem(name) { assert.equal(name, key); return raw },
  setItem(name, value) { assert.equal(name, key); raw = value; writes += 1 },
  removeItem(name) { assert.equal(name, key); raw = null },
}

try {
  Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: storage })
  for (const malformed of [null, '', '{', 'null', 'true', '42', '"text"', '[]', '[0,1]']) {
    raw = malformed
    assert.deepEqual(loadQuizAnswers(), {}, `Reject malformed answer shape: ${malformed}`)
  }

  const first = quizQuestions[0]
  const second = quizQuestions[1]
  for (const invalid of [-1, first.options.length, 0.5, '0', null, true, {}, []]) {
    raw = JSON.stringify({ [first.id]: invalid })
    assert.deepEqual(loadQuizAnswers(), {}, `Reject invalid option index: ${JSON.stringify(invalid)}`)
  }
  raw = JSON.stringify({ [first.id]: 0, [second.id]: second.options.length - 1, unknown: 0, __proto__: 0 })
  assert.deepEqual(loadQuizAnswers(), { [first.id]: 0, [second.id]: second.options.length - 1 }, 'Keep only validated known answers')
  assert.equal(saveQuizAnswer(first.id, 1), true)
  assert.deepEqual(loadQuizAnswers(), { [first.id]: 1, [second.id]: second.options.length - 1 }, 'Saving preserves other valid answers')

  const beforeInvalid = writes
  for (const [id, index] of [['unknown', 0], [first.id, -1], [first.id, first.options.length], [first.id, NaN], [first.id, 0.25]]) {
    assert.equal(saveQuizAnswer(id, index), false)
  }
  assert.equal(writes, beforeInvalid, 'Invalid answers do not mutate storage')
  assert.equal(clearQuizAnswers(), true)
  assert.deepEqual(loadQuizAnswers(), {})

  for (const operation of ['getItem', 'setItem', 'removeItem']) {
    const original = storage[operation]
    storage[operation] = () => { throw new Error('Storage blocked') }
    if (operation === 'getItem') assert.deepEqual(loadQuizAnswers(), {})
    if (operation === 'setItem') assert.equal(saveQuizAnswer(first.id, 0), false)
    if (operation === 'removeItem') assert.equal(clearQuizAnswers(), false)
    storage[operation] = original
  }

  Object.defineProperty(globalThis, 'localStorage', { configurable: true, get() { throw new Error('SecurityError') } })
  assert.deepEqual(loadQuizAnswers(), {})
  assert.equal(saveQuizAnswer(first.id, 0), false)
  assert.equal(clearQuizAnswers(), false)
  console.log('Quiz storage: malformed JSON/shapes, invalid indices, preservation, reset and blocked storage checks passed.')
} finally {
  if (descriptor) Object.defineProperty(globalThis, 'localStorage', descriptor)
  else delete globalThis.localStorage
}
