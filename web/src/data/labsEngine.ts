/** Deterministic teaching models for the fixed C++ examples on /laboratorium.
 * These functions do not parse or execute C++ source code.
 */
export type PassingMode = 'value' | 'reference'

export function referenceFrame(mode: PassingMode, start: number, step: number) {
  const phase = Math.max(0, Math.min(3, Math.trunc(step)))
  const changed = phase >= 2
  return {
    caller: mode === 'reference' && changed ? start + 5 : start,
    parameter: phase === 1 ? start : phase === 2 ? start + 5 : null,
    parameterAlive: phase === 1 || phase === 2,
    sharedObject: mode === 'reference',
  }
}

export function unsignedByte(value: number) {
  if (!Number.isSafeInteger(value)) throw new RangeError('Byte conversion requires a safe integer')
  return ((value % 256) + 256) % 256
}

export function byteAddition(start: number, addition: number) {
  const intermediate = start + addition
  return { intermediate, stored: unsignedByte(intermediate) }
}

export function byteBits(value: number) {
  return unsignedByte(value).toString(2).padStart(8, '0').split('').map(Number)
}

/** UNO R3's AVR int has a 16-bit signed range. Never invent a signed wrap result. */
export function signedIntAddition(start: number, addition: number) {
  const mathematical = start + addition
  const defined = mathematical >= -32768 && mathematical <= 32767
  return { mathematical, defined, result: defined ? mathematical : null }
}

export function divisionModel(dividend: number, divisor: number) {
  if (divisor === 0) throw new RangeError('Division by zero is outside this model')
  // All UI inputs are small integers: no INT_MIN / -1 overflow is possible.
  const truncated = Math.trunc(dividend / divisor)
  const integer = Object.is(truncated, -0) ? 0 : truncated
  return {
    integer,
    // float destination cannot restore the fraction discarded by integer division.
    assignedToFloat: integer,
    floatDivision: Math.fround(dividend / divisor),
    remainder: dividend - integer * divisor,
  }
}

export const MILLIS_MODULUS = 2 ** 32
export const MILLIS_NEAR_WRAP = MILLIS_MODULUS - 300

export function unsignedMillis(value: number) {
  if (!Number.isSafeInteger(value)) throw new RangeError('Timestamp must be a safe integer')
  return ((value % MILLIS_MODULUS) + MILLIS_MODULUS) % MILLIS_MODULUS
}

export function elapsedMillis(now: number, previous: number) {
  return unsignedMillis(now - previous)
}

export type TimerTick = {
  loop: number
  now: number
  elapsed: number
  fired: boolean
  wrapped: boolean
  led: boolean
}

export type TimerState = {
  now: number
  previous: number
  led: boolean
  loops: number
  toggles: number
  history: TimerTick[]
}

export function createTimer(start = 0): TimerState {
  const now = unsignedMillis(start)
  return { now, previous: now, led: false, loops: 0, toggles: 0, history: [] }
}

/** One click models one loop() check, after a bounded jump in virtual time.
 * previous = now deliberately allows only one toggle, even after a long step.
 */
export function advanceTimer(state: TimerState, delta: number, interval: number): TimerState {
  if (!Number.isInteger(delta) || delta <= 0 || delta >= MILLIS_MODULUS)
    throw new RangeError('Time step must be between 1 and 2^32 - 1 ms')
  if (!Number.isInteger(interval) || interval <= 0 || interval >= MILLIS_MODULUS)
    throw new RangeError('Interval must be between 1 and 2^32 - 1 ms')
  const now = unsignedMillis(state.now + delta)
  const elapsed = elapsedMillis(now, state.previous)
  const fired = elapsed >= interval
  const led = fired ? !state.led : state.led
  const loop = state.loops + 1
  const tick = { loop, now, elapsed, fired, wrapped: now < state.now, led }
  return {
    now,
    previous: fired ? now : state.previous,
    led,
    loops: loop,
    toggles: state.toggles + (fired ? 1 : 0),
    history: [...state.history.slice(-5), tick],
  }
}
