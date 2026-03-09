# Timer Utilities

Precise timer implementation that uses Web Worker to avoid browser throttling in background tabs.

## Problem

Browsers (e.g., Chrome) automatically throttle `setTimeout`/`setInterval` in inactive tabs — intervals can be stretched to 1 second or even longer. This causes inaccurate timing for use cases like countdowns, heartbeat pings, and auto-logout timers.

## Solution

`createPreciseTimer` delegates all timing logic to a **Web Worker** thread. Since Workers are not subject to background tab throttling, timers remain accurate regardless of tab visibility.

## createPreciseTimer

Creates a precise timer instance backed by a Web Worker.

```typescript
function createPreciseTimer(): {
  setTimeout(callback: (...args: any[]) => void, time: number, ...parameters: any[]): number
  clearTimeout(fakeId: number): void
  setInterval(callback: (...args: any[]) => void, time: number, ...parameters: any[]): number
  clearInterval(fakeId: number): void
  dispose(): void
}
```

### Returns

An object containing the following methods:

| Method | Description |
| --- | --- |
| `setTimeout(callback, time, ...params)` | Sets a one-time timer, returns a timer ID |
| `clearTimeout(id)` | Cancels a timeout by ID |
| `setInterval(callback, time, ...params)` | Sets a repeating timer, returns a timer ID |
| `clearInterval(id)` | Cancels an interval by ID |
| `dispose()` | Terminates the Worker and releases resources |

### Examples

#### Basic Interval

```typescript
import { createPreciseTimer } from '@outilx/browser'

const timer = createPreciseTimer()

// Stays accurate even when the tab is in the background
const id = timer.setInterval(() => {
  console.log('tick', new Date().toLocaleTimeString())
}, 1000)

// Stop after 10 seconds
timer.setTimeout(() => {
  timer.clearInterval(id)
  timer.dispose()
}, 10000)
```

#### Auto-Logout Timer

```typescript
import { createPreciseTimer } from '@outilx/browser'

const timer = createPreciseTimer()
let idleSeconds = 0

const id = timer.setInterval(() => {
  idleSeconds++
  if (idleSeconds >= 300) {
    // 5 minutes of inactivity — log out
    timer.clearInterval(id)
    timer.dispose()
    logout()
  }
}, 1000)

// Reset on user interaction
document.addEventListener('click', () => {
  idleSeconds = 0
})
```

#### Heartbeat Ping

```typescript
import { createPreciseTimer } from '@outilx/browser'

const timer = createPreciseTimer()

// Send heartbeat every 30 seconds, accurate even in background
timer.setInterval(() => {
  fetch('/api/heartbeat', { method: 'POST' })
}, 30000)
```

### How It Works

1. A Web Worker is created dynamically via `Blob` + `URL.createObjectURL` — no external script file needed.
2. The Worker thread runs `setInterval`/`setTimeout` internally and posts messages back to the main thread on each tick.
3. The main thread maps timer IDs to callbacks and invokes them when notified by the Worker.
4. Since the Worker thread runs independently of the page lifecycle, timers are not affected by browser throttling policies.

```
Main Thread                          Worker Thread
    |                                     |
    |--- postMessage('setInterval') ----->|
    |                                     |-- setInterval (not throttled)
    |                                     |
    |<---- postMessage({ fakeId }) -------|  (on each tick)
    |                                     |
    |  invoke callback(...)               |
```

::: tip
Always call `dispose()` when the timer is no longer needed to terminate the Worker and free resources.
:::

::: warning
`createPreciseTimer` requires a browser environment with Web Worker support. It does not work in Node.js or older browsers without Worker support (e.g., IE9).
:::
