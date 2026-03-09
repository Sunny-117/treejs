/**
 * A precise timer implementation that uses Web Worker to avoid
 * browser throttling when the tab is inactive/hidden.
 *
 * @remarks
 * Browsers throttle `setTimeout`/`setInterval` in background tabs
 * (e.g., Chrome limits them to once per second). This implementation
 * delegates timing to a Web Worker thread, which is not subject to
 * background tab throttling, ensuring accurate timer execution even
 * when the page is not visible.
 */

type TimerCallback = (...args: any[]) => void

interface TimerRequest {
  callback: TimerCallback
  parameters: any[]
  isTimeout?: boolean
}

const WORKER_SCRIPT = `
var fakeIdToId = {};
onmessage = function (event) {
  var data = event.data,
    name = data.name,
    fakeId = data.fakeId,
    time;
  if (data.hasOwnProperty("time")) {
    time = data.time;
  }
  switch (name) {
    case "setInterval":
      fakeIdToId[fakeId] = setInterval(function () {
        postMessage({ fakeId: fakeId });
      }, time);
      break;
    case "clearInterval":
      if (fakeIdToId.hasOwnProperty(fakeId)) {
        clearInterval(fakeIdToId[fakeId]);
        delete fakeIdToId[fakeId];
      }
      break;
    case "setTimeout":
      fakeIdToId[fakeId] = setTimeout(function () {
        postMessage({ fakeId: fakeId });
        if (fakeIdToId.hasOwnProperty(fakeId)) {
          delete fakeIdToId[fakeId];
        }
      }, time);
      break;
    case "clearTimeout":
      if (fakeIdToId.hasOwnProperty(fakeId)) {
        clearTimeout(fakeIdToId[fakeId]);
        delete fakeIdToId[fakeId];
      }
      break;
  }
};
`

const MAX_FAKE_ID = 0x7FFFFFFF // 2^31 - 1

/**
 * Creates a precise timer instance backed by a Web Worker.
 *
 * Unlike native `setTimeout`/`setInterval`, this timer is **not throttled**
 * by the browser when the tab becomes inactive, making it suitable for:
 * - Countdown / stopwatch UIs that must stay accurate
 * - Heartbeat / keep-alive pings
 * - Auto-save or auto-logout timers in editors
 *
 * @returns An object with `setTimeout`, `clearTimeout`, `setInterval`,
 *   `clearInterval`, and `dispose` methods.
 *
 * @example
 * ```ts
 * import { createPreciseTimer } from '@outilx/browser'
 *
 * const timer = createPreciseTimer()
 *
 * // Works like native setInterval, but stays accurate in background tabs
 * const id = timer.setInterval(() => {
 *   console.log('tick', Date.now())
 * }, 1000)
 *
 * // Clear when done
 * timer.clearInterval(id)
 *
 * // Dispose the worker when no longer needed
 * timer.dispose()
 * ```
 */
export function createPreciseTimer() {
  const blob = new Blob([WORKER_SCRIPT], { type: 'application/javascript' })
  const workerUrl = URL.createObjectURL(blob)
  const worker = new Worker(workerUrl)

  const fakeIdToCallback = new Map<number, TimerRequest>()
  let lastFakeId = 0

  function getFakeId(): number {
    do {
      lastFakeId = lastFakeId >= MAX_FAKE_ID ? 0 : lastFakeId + 1
    } while (fakeIdToCallback.has(lastFakeId))
    return lastFakeId
  }

  worker.onmessage = (event: MessageEvent) => {
    const { fakeId } = event.data
    const request = fakeIdToCallback.get(fakeId)
    if (!request) return

    if (request.isTimeout) {
      fakeIdToCallback.delete(fakeId)
    }

    request.callback(...request.parameters)
  }

  function setInterval(callback: TimerCallback, time: number, ...parameters: any[]): number {
    const fakeId = getFakeId()
    fakeIdToCallback.set(fakeId, { callback, parameters })
    worker.postMessage({ name: 'setInterval', fakeId, time })
    return fakeId
  }

  function clearInterval(fakeId: number): void {
    if (fakeIdToCallback.has(fakeId)) {
      fakeIdToCallback.delete(fakeId)
      worker.postMessage({ name: 'clearInterval', fakeId })
    }
  }

  function setTimeout(callback: TimerCallback, time: number, ...parameters: any[]): number {
    const fakeId = getFakeId()
    fakeIdToCallback.set(fakeId, { callback, parameters, isTimeout: true })
    worker.postMessage({ name: 'setTimeout', fakeId, time })
    return fakeId
  }

  function clearTimeout(fakeId: number): void {
    if (fakeIdToCallback.has(fakeId)) {
      fakeIdToCallback.delete(fakeId)
      worker.postMessage({ name: 'clearTimeout', fakeId })
    }
  }

  function dispose(): void {
    fakeIdToCallback.clear()
    worker.terminate()
    URL.revokeObjectURL(workerUrl)
  }

  return {
    setTimeout,
    clearTimeout,
    setInterval,
    clearInterval,
    dispose,
  }
}
