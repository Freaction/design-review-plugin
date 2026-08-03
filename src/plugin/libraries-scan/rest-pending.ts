export function sortPending(pending: Set<string>, counts?: Map<string, number>): string[] {
  const arr = [...pending];
  if (!counts?.size) return arr;
  return arr.sort((a, b) => (counts.get(b) || 0) - (counts.get(a) || 0));
}

export function dropPending(pending: Set<string>, fails: Set<string>): number {
  let n = 0;
  for (const key of pending) {
    fails.add(key);
    n++;
  }
  pending.clear();
  return n;
}
