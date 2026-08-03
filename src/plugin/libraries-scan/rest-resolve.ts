import {
  loadFailCache,
  loadResolvedCache,
  saveFailCache,
  saveResolvedCache,
  type Resolved,
} from './lib-cache';
import { isFigmaFileKey } from '../figma-file-key';
import { resolveFileName, resolveSeedFileKey, fetchJson } from './rest-fetch';
import { elapsed, fmtSec, logPerf, now } from './perf';

const SEED_BATCH = 24;
const EMPTY_STOP = 2;

type ResolveOpts = {
  knownFileKeys?: string[];
  keyCounts?: Map<string, number>;
};

async function ingestLibrary(
  fileKey: string,
  libraryName: string,
  token: string,
  result: Map<string, Resolved>,
  pending: Set<string>,
): Promise<number> {
  if (!isFigmaFileKey(fileKey)) return 0;
  const t0 = now();
  const before = pending.size;
  const [comps, sets] = await Promise.all([
    fetchJson(`https://api.figma.com/v1/files/${fileKey}/components`, token),
    fetchJson(`https://api.figma.com/v1/files/${fileKey}/component_sets`, token),
  ]);
  const list = [
    ...(comps.data?.meta?.components || []),
    ...(sets.data?.meta?.component_sets || []),
  ];
  const resolved = { fileKey, libraryName };
  for (const item of list) {
    const key = item?.key;
    if (!key) continue;
    result.set(key, resolved);
    pending.delete(key);
  }
  const matched = before - pending.size;
  logPerf('ingest', elapsed(t0), `${libraryName} · catalog=${list.length} · matched=${matched}`);
  return matched;
}

function sortPending(pending: Set<string>, counts?: Map<string, number>): string[] {
  const arr = [...pending];
  if (!counts?.size) return arr;
  return arr.sort((a, b) => (counts.get(b) || 0) - (counts.get(a) || 0));
}

function dropPending(pending: Set<string>, fails: Set<string>): number {
  let n = 0;
  for (const key of pending) {
    fails.add(key);
    n++;
  }
  pending.clear();
  return n;
}

export async function resolveLibraryNames(
  keys: string[],
  token: string,
  onProgress?: (done: number, total: number, label?: string) => void,
  opts: ResolveOpts = {},
): Promise<Map<string, Resolved>> {
  const tAll = now();
  const unique = [...new Set(keys.filter(k => k && !k.startsWith('broken:')))];
  const total = unique.length;

  const tCache = now();
  const result = await loadResolvedCache();
  const fails = await loadFailCache();
  logPerf('cache load', elapsed(tCache), `hit=${result.size} fail=${fails.size}`);

  const pending = new Set(unique.filter(k => !result.has(k) && !fails.has(k)));
  const cachedDone = total - pending.size;
  const fileNames = new Map<string, string>();
  let failed = 0;
  let libs = 0;
  let emptyRounds = 0;
  let round = 0;

  logPerf('resolve start', 0, `keys=${total} pending=${pending.size} cached=${cachedDone}`);
  onProgress?.(cachedDone, total, `Кэш · ${fmtSec(elapsed(tAll))}`);

  for (const fileKey of opts.knownFileKeys || []) {
    if (!isFigmaFileKey(fileKey) || fileNames.has(fileKey)) continue;
    const tKnown = now();
    const libraryName = await resolveFileName(fileKey, token);
    fileNames.set(fileKey, libraryName);
    libs++;
    await ingestLibrary(fileKey, libraryName, token, result, pending);
    logPerf('known lib', elapsed(tKnown), libraryName);
    onProgress?.(total - pending.size, total, `${libraryName} · ${fmtSec(elapsed(tAll))}`);
  }

  while (pending.size) {
    round++;
    const tRound = now();
    onProgress?.(
      total - pending.size,
      total,
      `Библиотек: ${libs}, осталось: ${pending.size} · ${fmtSec(elapsed(tAll))}`,
    );

    const batch = sortPending(pending, opts.keyCounts).slice(0, SEED_BATCH);
    logPerf(`seed #${round} start`, elapsed(tAll), `batch=${batch.length} pending=${pending.size}`);

    const probes = await Promise.all(
      batch.map(async key => ({ key, fileKey: await resolveSeedFileKey(key, token) })),
    );

    const byFile = new Map<string, string[]>();
    let hits = 0;
    let misses = 0;
    for (const { key, fileKey } of probes) {
      if (!fileKey) {
        failed++;
        misses++;
        fails.add(key);
        pending.delete(key);
        continue;
      }
      hits++;
      const list = byFile.get(fileKey) || [];
      list.push(key);
      byFile.set(fileKey, list);
    }

    let ingested = 0;
    for (const [fileKey, seedKeys] of byFile) {
      if (!isFigmaFileKey(fileKey)) continue;
      let libraryName = fileNames.get(fileKey);
      if (!libraryName) {
        libraryName = await resolveFileName(fileKey, token);
        fileNames.set(fileKey, libraryName);
        libs++;
        ingested += await ingestLibrary(fileKey, libraryName, token, result, pending);
      }
      for (const seed of seedKeys) {
        if (!pending.has(seed)) continue;
        result.set(seed, { fileKey, libraryName });
        pending.delete(seed);
      }
    }

    logPerf(
      `seed #${round}`,
      elapsed(tRound),
      `hits=${hits} miss=${misses} files=${byFile.size} ingest=${ingested} pending=${pending.size}`,
    );

    if (hits === 0) {
      emptyRounds++;
      if (emptyRounds >= EMPTY_STOP) {
        const dropped = dropPending(pending, fails);
        failed += dropped;
        logPerf('early stop', elapsed(tAll), `emptyRounds=${emptyRounds} dropped=${dropped}`);
        break;
      }
    } else {
      emptyRounds = 0;
    }
  }

  const tSave = now();
  await saveResolvedCache(result);
  await saveFailCache(fails);
  logPerf('cache save', elapsed(tSave));

  const mapped = unique.filter(k => result.has(k)).length;
  logPerf(
    'resolve done',
    elapsed(tAll),
    `mapped=${mapped}/${total} libs=${libs} failed=${failed} rounds=${round}`,
  );
  onProgress?.(mapped, total, `Библиотек: ${libs} · ${fmtSec(elapsed(tAll))}`);
  return result;
}
