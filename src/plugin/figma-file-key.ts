export function isFigmaFileKey(value: string | undefined | null): value is string {
  if (!value || typeof value !== 'string') return false;
  if (/[\s/\\?#]/.test(value)) return false;
  return /^[a-zA-Z0-9]{10,}$/.test(value);
}

export function pickFileKey(...values: (string | undefined | null)[]): string | undefined {
  for (const value of values) {
    if (isFigmaFileKey(value)) return value;
  }
  return undefined;
}
