import type { LibAcc, LibCategory, LibComponentGroup, LibScanResult } from './types';

const FALLBACK_TITLE: Record<string, string> = {
  etalon: 'Эталон ДС',
  foreign: 'Не в эталоне',
  broken: 'Недоступные',
  unknown: 'Не удалось определить',
};

export function remapByLibraries(
  acc: LibAcc,
  libNames: Map<string, { libraryName: string; fileKey: string }>,
  etalonFileKey: string | undefined,
): LibAcc {
  const next: LibAcc = new Map();
  for (const [groupKey, group] of acc) {
    const compKey = groupKey.slice(groupKey.indexOf(':') + 1);
    let category = group.category;
    if (category !== 'broken' && category !== 'etalon') {
      const resolved = libNames.get(compKey);
      if (!resolved) category = 'unknown';
      else if (etalonFileKey && resolved.fileKey === etalonFileKey) category = 'etalon';
      else category = resolved.libraryName;
    }
    const nextKey = `${category}:${compKey}`;
    let g = next.get(nextKey);
    if (!g) {
      g = { name: group.name, category, nodeIds: [] };
      next.set(nextKey, g);
    }
    g.nodeIds.push(...group.nodeIds);
  }
  return next;
}

export function toLibResult(
  acc: LibAcc,
  counts: {
    instanceTotal: number;
    remoteCount: number;
    localCount: number;
    brokenCount: number;
  },
  usedRest: boolean,
): LibScanResult {
  const buckets = new Map<string, LibComponentGroup[]>();

  for (const [groupKey, group] of acc) {
    const key = groupKey.slice(groupKey.indexOf(':') + 1);
    let list = buckets.get(group.category);
    if (!list) {
      list = [];
      buckets.set(group.category, list);
    }
    list.push({
      key,
      name: group.name,
      count: group.nodeIds.length,
      nodeIds: group.nodeIds,
    });
  }

  for (const list of buckets.values()) {
    list.sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, 'ru'));
  }

  const order = usedRest
    ? [...buckets.keys()].sort((a, b) => {
        const rank = (id: string) =>
          id === 'broken' ? 3 : id === 'unknown' ? 2 : id === 'etalon' ? 1 : 0;
        const ra = rank(a);
        const rb = rank(b);
        if (ra !== rb) return ra - rb;
        const ca = buckets.get(a)?.reduce((s, x) => s + x.count, 0) || 0;
        const cb = buckets.get(b)?.reduce((s, x) => s + x.count, 0) || 0;
        return cb - ca || a.localeCompare(b, 'ru');
      })
    : (['foreign', 'broken', 'etalon'] as string[]).filter(id => buckets.has(id));

  const categories: LibCategory[] = order
    .filter(id => buckets.has(id))
    .map(id => ({
      id,
      title: FALLBACK_TITLE[id] || id,
      components: buckets.get(id) || [],
    }));

  return { categories, ...counts, usedRest };
}
