export function now(): number {
  return Date.now();
}

export function elapsed(t0: number): number {
  return Date.now() - t0;
}

export function logPerf(phase: string, ms: number, extra = ''): void {
  const suffix = extra ? ` · ${extra}` : '';
  console.log(`[DR lib] ${phase}: ${ms}ms${suffix}`);
}

export function fmtSec(ms: number): string {
  return `${(ms / 1000).toFixed(1)}с`;
}
