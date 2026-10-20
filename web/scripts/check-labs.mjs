// Node 24 can import these erasable TypeScript engine functions directly.
// Run from web/: node scripts/check-labs.mjs
import assert from 'node:assert/strict'
import {
  referenceFrame, unsignedByte, byteAddition, byteBits, signedIntAddition,
  divisionModel, createTimer, advanceTimer, elapsedMillis, MILLIS_MODULUS, MILLIS_NEAR_WRAP,
} from '../src/data/labsEngine.ts'

let assertions = 0
function equal(actual, expected, label) {
  assert.deepEqual(actual, expected, label)
  assertions += 1
}

for (const start of [10, 42, 100]) {
  equal(referenceFrame('value', start, 3).caller, start, 'A value parameter cannot change caller')
  equal(referenceFrame('reference', start, 3).caller, start + 5, 'A reference changes the same object')
  equal(referenceFrame('value', start, 2).parameter, start + 5, 'Only copy changes in body')
  equal(referenceFrame('value', start, 3).parameterAlive, false, 'Parameter lifetime ends on return')
}

// Exhaust all available unsigned-byte inputs and deltas, including the promotion result.
for (let start = 0; start <= 255; start += 1) {
  for (const addition of [1, 10, 20]) {
    const result = byteAddition(start, addition)
    equal(result.intermediate, start + addition, 'Intermediate int addition retains full sum')
    equal(result.stored, (start + addition) & 255, 'Conversion to uint8_t is modulo 256')
    equal(Number.parseInt(byteBits(result.stored).join(''), 2), result.stored, 'Visual bits represent stored value')
  }
}
equal(unsignedByte(-1), 255, 'Unsigned conversion also handles negative integers')
equal(signedIntAddition(32767, 1), { mathematical: 32768, defined: false, result: null }, 'Never invent a signed overflow result')
equal(signedIntAddition(-32768, -1).defined, false, 'Signed lower boundary is also undefined')
equal(signedIntAddition(32766, 1).result, 32767, 'Signed upper limit itself is representable')
equal(signedIntAddition(-32768, 1).result, -32767, 'Negative in-range addition')
equal(divisionModel(7, 2), { integer: 3, assignedToFloat: 3, floatDivision: 3.5, remainder: 1 }, 'A float destination cannot change integer division')
equal(divisionModel(-7, 2), { integer: -3, assignedToFloat: -3, floatDivision: -3.5, remainder: -1 }, 'Truncate toward zero, not negative infinity')
assert.throws(() => divisionModel(7, 0), RangeError)

let timer = createTimer()
for (let tick = 1; tick <= 4; tick += 1) timer = advanceTimer(timer, 100, 500)
equal(timer.toggles, 0, 'No toggle before interval')
timer = advanceTimer(timer, 100, 500)
equal([timer.now, timer.previous, timer.toggles, timer.led], [500, 500, 1, true], 'Boundary >= fires at exactly interval')
timer = advanceTimer(timer, 1000, 500)
equal([timer.toggles, timer.led], [2, false], 'Long step does not invent catch-up toggles')

let wrapTimer = createTimer(MILLIS_NEAR_WRAP)
wrapTimer = advanceTimer(wrapTimer, 250, 500)
equal([wrapTimer.now, wrapTimer.toggles], [MILLIS_MODULUS - 50, 0], 'First step remains before wrap')
wrapTimer = advanceTimer(wrapTimer, 250, 500)
equal([wrapTimer.now, wrapTimer.toggles, wrapTimer.history.at(-1).elapsed], [200, 1, 500], 'Unsigned elapsed time survives wrap')
equal(elapsedMillis(200, MILLIS_NEAR_WRAP), 500, 'Prediction arithmetic')
equal(elapsedMillis(123, 123), 0, 'An entire extra clock revolution cannot be observed')
for (let tick = 0; tick < 10; tick += 1) wrapTimer = advanceTimer(wrapTimer, 100, 500)
equal(wrapTimer.history.length, 6, 'Trace stays bounded')
equal(wrapTimer.loops, 12, 'Trace trimming does not reset loop count')
assert.throws(() => advanceTimer(timer, MILLIS_MODULUS, 500), RangeError)
console.log(`Laboratorium: ${assertions} model assertions passed, plus invalid-input guards.`)
