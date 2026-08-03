import { loadSnapshot } from '../snapshot';
import { loadFigmaToken } from '../figma-token';
import { pickFileKey } from '../figma-file-key';
import { resolveLibraryNames } from './rest-resolve';
import { remapByLibraries, toLibResult } from './result';
import { classifyAll, collectInstances } from './classify';
import { elapsed, fmtSec, logPerf, now } from './perf';
import type { LibScanResult } from './types';

export async function runLibrariesScan(
  roots: readonly SceneNode[],
  onProgress?: (count: number, total?: number, label?: string) => void,
): Promise<LibScanResult> {
  const tAll = now();
  figma.skipInvisibleInstanceChildren = false;

  onProgress?.(0, 0, 'Загрузка эталона...');
  const snapshotData = await loadSnapshot();
  const snapshot = snapshotData?.c
    ? new Set(snapshotData.c.map((s: { k: string }) => s.k))
    : null;
  const etalonFileKey = pickFileKey(snapshotData?.f);

  onProgress?.(0, 0, 'Сбор инстансов...');
  const tCollect = now();
  const instances = collectInstances(roots);
  logPerf('collect', elapsed(tCollect), `instances=${instances.length}`);

  const tClassify = now();
  const { acc, cache, keyCounts, stats } = await classifyAll(
    instances,
    snapshot,
    (done, total) => {
      onProgress?.(done, total, `Инстансы ${done}/${total} · ${fmtSec(elapsed(tAll))}`);
    },
  );
  logPerf(
    'classify',
    elapsed(tClassify),
    `remote=${stats.remote} local=${stats.local} broken=${stats.broken} unique=${cache.size}`,
  );

  const token = await loadFigmaToken();
  let usedRest = false;
  let next = acc;

  if (token) {
    const foreignKeys = [...cache.keys()].filter(k => !snapshot?.has(k));
    logPerf(
      'rest prep',
      elapsed(tAll),
      `foreign=${foreignKeys.length} etalonSkip=${cache.size - foreignKeys.length} fileKey=${etalonFileKey || '—'}`,
    );

    if (foreignKeys.length) {
      const tRest = now();
      const libNames = await resolveLibraryNames(
        foreignKeys,
        token,
        (done, total, label) => {
          onProgress?.(done, total, label || `API ${done}/${total}`);
        },
        { knownFileKeys: etalonFileKey ? [etalonFileKey] : [], keyCounts },
      );
      logPerf('rest total', elapsed(tRest), `resolved=${libNames.size}`);
      usedRest = true;
      next = remapByLibraries(acc, libNames, etalonFileKey);
    }
  }

  logPerf('scan done', elapsed(tAll), `instances=${instances.length} groups=${next.size}`);
  return toLibResult(
    next,
    {
      instanceTotal: instances.length,
      remoteCount: stats.remote,
      localCount: stats.local,
      brokenCount: stats.broken,
    },
    usedRest,
  );
}
