import {
  loadFailCache,
  loadResolvedCache,
  saveFailCache,
  saveResolvedCache,
} from './lib-cache';
import { isFigmaFileKey } from '../figma-file-key';
import { resolveFileName, resolveSeedFileKey } from './rest-fetch';
import { dropPending, sortPending } from './rest-pending';
import { elapsed, fmtSec, logPerf, now } from './perf';

const SEED_BATCH = 24;
const EMPTY_STOP = 2;

type ResolveOpts = {
  knownFileKeys?: string[];
  keyCounts?: Map<string, number>;
};

type Progress = (done: number, total: number, label?: string) => void;

function tick(onProgress: Progress | undefined, done: number, total: number, label: string, t0: number) {
  onProgress?.(done, total, `${label} · ${fmtSec(elapsed(t0))}`);
}

export async function resolveLibraryNames(
  keys: string[],
  token: string,
  onProgress?: Progress,
  opts: ResolveOpts = {},
): Promise<Map<string, { libraryName: string; fileKey: string }>> {
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
  tick(onProgress, cachedDone, total, cachedDone ? `Из кэша ${cachedDone}` : 'Старт API', tAll);

  for (const fileKey of opts.knownFileKeys || []) {
    if (!isFigmaFileKey(fileKey) || fileNames.has(fileKey)) continue;
    fileNames.set(fileKey, 'Эталон ДС');
  }

  while (pending.size) {
    round++;
    const tRound = now();
    tick(
      onProgress,
      total - pending.size,
      total,
      `Раунд ${round}: опрос ${Math.min(SEED_BATCH, pending.size)} ключей, осталось ${pending.size}`,
      tAll,
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

    tick(
      onProgress,
      total - pending.size,
      total,
      `Раунд ${round}: найдено ${hits}, 404×${misses}, библиотек +${byFile.size}`,
      tAll,
    );

    for (const [fileKey, seedKeys] of byFile) {
      if (!isFigmaFileKey(fileKey)) continue;
      let libraryName = fileNames.get(fileKey);
      if (!libraryName) {
        tick(onProgress, total - pending.size, total, 'Имя библиотеки…', tAll);
        libraryName = await resolveFileName(fileKey, token);
        fileNames.set(fileKey, libraryName);
        libs++;
      }
      for (const seed of seedKeys) {
        if (!pending.has(seed)) continue;
        result.set(seed, { fileKey, libraryName });
        pending.delete(seed);
      }
      tick(
        onProgress,
        total - pending.size,
        total,
        `«${libraryName}» · осталось ${pending.size}`,
        tAll,
      );
    }

    logPerf(
      `seed #${round}`,
      elapsed(tRound),
      `hits=${hits} miss=${misses} files=${byFile.size} pending=${pending.size}`,
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
  await saveResolvedCache(result, unique);
  await saveFailCache(fails);
  logPerf('cache save', elapsed(tSave));

  const mapped = unique.filter(k => result.has(k)).length;
  logPerf(
    'resolve done',
    elapsed(tAll),
    `mapped=${mapped}/${total} libs=${libs} failed=${failed} rounds=${round}`,
  );
  tick(onProgress, mapped, total, `Готово · ${libs} библиотек`, tAll);
  return result;
}
