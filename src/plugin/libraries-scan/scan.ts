import { loadSnapshot } from '../snapshot';
import { loadFigmaToken } from '../figma-token';
import { pickFileKey } from '../figma-file-key';
import { resolveLibraryNames } from './rest-resolve';
import { remapByLibraries, toLibResult } from './result';
import { elapsed, fmtSec, logPerf, now } from './perf';
import type { LibAcc, LibScanResult } from './types';

const BATCH = 20;

type Classified = { category: string; name: string; key: string } | null;

function masterName(mc: ComponentNode): string {
  return mc.parent?.type === 'COMPONENT_SET' ? mc.parent.name : mc.name;
}

function collectInstances(roots: readonly SceneNode[]): InstanceNode[] {
  const out: InstanceNode[] = [];
  for (const root of roots) {
    if (root.type === 'INSTANCE') out.push(root);
    if ('findAllWithCriteria' in root) {
      const nested = (root as ChildrenMixin & SceneNode).findAllWithCriteria({
        types: ['INSTANCE'],
      }) as InstanceNode[];
      out.push(...nested);
    }
  }
  return out;
}

async function classifyInstance(
  node: InstanceNode,
  snapshot: Set<string> | null,
  cache: Map<string, Classified>,
): Promise<Classified> {
  let mc: ComponentNode | null = null;
  try {
    mc = await node.getMainComponentAsync();
  } catch {
    mc = null;
  }

  if (!mc) {
    const name = node.name || 'Без имени';
    return { category: 'broken', name, key: `broken:${name}` };
  }
  if (!mc.remote) return null;

  const cached = cache.get(mc.key);
  if (cached !== undefined) return cached;

  const category = snapshot?.has(mc.key) ? 'etalon' : 'foreign';
  const result = { category, name: masterName(mc), key: mc.key };
  cache.set(mc.key, result);
  return result;
}

export async function runLibrariesScan(
  roots: readonly SceneNode[],
  onProgress?: (count: number, total?: number, label?: string) => void,
): Promise<LibScanResult> {
  const tAll = now();
  figma.skipInvisibleInstanceChildren = false;

  const snapshotData = await loadSnapshot();
  const snapshot = snapshotData?.c
    ? new Set(snapshotData.c.map((s: any) => s.k as string))
    : null;

  const tCollect = now();
  onProgress?.(0, 0, 'Сбор инстансов...');
  const instances = collectInstances(roots);
  logPerf('collect', elapsed(tCollect), `instances=${instances.length}`);

  let acc: LibAcc = new Map();
  const cache = new Map<string, Classified>();
  const keyCounts = new Map<string, number>();
  let remote = 0;
  let local = 0;
  let broken = 0;

  const tClassify = now();
  for (let i = 0; i < instances.length; i += BATCH) {
    const batch = instances.slice(i, i + BATCH);
    const results = await Promise.all(
      batch.map(node => classifyInstance(node, snapshot, cache)),
    );

    for (let j = 0; j < results.length; j++) {
      const info = results[j];
      if (!info) {
        local++;
        continue;
      }
      if (info.category === 'broken') broken++;
      else remote++;

      keyCounts.set(info.key, (keyCounts.get(info.key) || 0) + 1);

      const groupKey = `${info.category}:${info.key}`;
      let group = acc.get(groupKey);
      if (!group) {
        group = { name: info.name, category: info.category, nodeIds: [] };
        acc.set(groupKey, group);
      }
      group.nodeIds.push(batch[j].id);
    }

    const done = Math.min(i + BATCH, instances.length);
    onProgress?.(
      done,
      instances.length,
      `Инстансы ${done}/${instances.length} · ${fmtSec(elapsed(tAll))}`,
    );
    if (done < instances.length) await new Promise(r => setTimeout(r, 0));
  }
  logPerf(
    'classify',
    elapsed(tClassify),
    `remote=${remote} local=${local} broken=${broken} unique=${cache.size}`,
  );

  const token = await loadFigmaToken();
  let usedRest = false;

  if (token) {
    const foreignKeys = [...cache.keys()].filter(k => !snapshot?.has(k));
    const etalonKeys = cache.size - foreignKeys.length;
    logPerf(
      'rest prep',
      elapsed(tAll),
      `foreign=${foreignKeys.length} etalonSkip=${etalonKeys} fileKey=${pickFileKey(snapshotData?.f) || '—'}`,
    );
    if (foreignKeys.length) {
      onProgress?.(0, foreignKeys.length, `API · ${fmtSec(elapsed(tAll))}`);
      const etalonFileKey = pickFileKey(snapshotData?.f);
      const knownFileKeys = etalonFileKey ? [etalonFileKey] : [];
      const tRest = now();
      const libNames = await resolveLibraryNames(
        foreignKeys,
        token,
        (done, total, label) => {
          onProgress?.(done, total, label || `API ${done}/${total}`);
        },
        { knownFileKeys, keyCounts },
      );
      logPerf('rest total', elapsed(tRest), `resolved=${libNames.size}`);
      usedRest = true;
      acc = remapByLibraries(acc, libNames, etalonFileKey);
    }
  }

  logPerf('scan done', elapsed(tAll), `instances=${instances.length} groups=${acc.size}`);
  return toLibResult(
    acc,
    {
      instanceTotal: instances.length,
      remoteCount: remote,
      localCount: local,
      brokenCount: broken,
    },
    usedRest,
  );
}
