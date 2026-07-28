export const perf = { now: () => Date.now() };

export function ms(start: number): string {
  const diff = perf.now() - start;
  if (diff < 1000) return `${diff}ms`;
  const sec = diff / 1000;
  if (sec < 60) return `${sec.toFixed(1)}s`;
  const min = Math.floor(sec / 60);
  const rSec = Math.floor(sec % 60);
  return `${min}m ${rSec}s`;
}

export function send(type: string, payload: object = {}): void {
  figma.ui.postMessage({ type, ...payload });
}

export async function withRetry<T>(fn: () => Promise<T>, label = '', maxAttempts = 6): Promise<T> {
  const DELAYS = [1000, 2000, 4000, 8000, 16000];
  for (let i = 0; i < maxAttempts; i++) {
    try {
      return await fn();
    } catch (err) {
      const isRate = (err instanceof Error ? err.message : String(err)).toLowerCase().includes('429');
      if (!isRate || i === maxAttempts - 1) throw err;
      const delay = DELAYS[Math.min(i, DELAYS.length - 1)];
      console.warn(`429 rate-limit [${label}] — retry in ${delay / 1000}s`);
      await new Promise(r => setTimeout(r, delay));
    }
  }
  throw new Error('withRetry: unreachable');
}
