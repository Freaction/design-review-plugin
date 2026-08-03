import type { LibAcc } from './types';

type Classified = { category: string; name: string; key: string } | null;

const BATCH = 40;

function masterName(mc: ComponentNode): string {
  return mc.parent?.type === 'COMPONENT_SET' ? mc.parent.name : mc.name;
}

export function collectInstances(roots: readonly SceneNode[]): InstanceNode[] {
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

async function classifyOne(
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

  const result = {
    category: snapshot?.has(mc.key) ? 'etalon' : 'foreign',
    name: masterName(mc),
    key: mc.key,
  };
  cache.set(mc.key, result);
  return result;
}

type ClassifyStats = {
  remote: number;
  local: number;
  broken: number;
};

export async function classifyAll(
  instances: InstanceNode[],
  snapshot: Set<string> | null,
  onProgress?: (done: number, total: number) => void,
): Promise<{
  acc: LibAcc;
  cache: Map<string, Classified>;
  keyCounts: Map<string, number>;
  stats: ClassifyStats;
}> {
  const cache = new Map<string, Classified>();
  const keyCounts = new Map<string, number>();
  const acc: LibAcc = new Map();
  const stats: ClassifyStats = { remote: 0, local: 0, broken: 0 };
  const total = instances.length;
  let lastUi = 0;

  for (let i = 0; i < instances.length; i += BATCH) {
    const batch = instances.slice(i, i + BATCH);
    const results = await Promise.all(
      batch.map(node => classifyOne(node, snapshot, cache)),
    );

    for (let j = 0; j < results.length; j++) {
      const info = results[j];
      if (!info) {
        stats.local++;
        continue;
      }
      if (info.category === 'broken') stats.broken++;
      else stats.remote++;

      keyCounts.set(info.key, (keyCounts.get(info.key) || 0) + 1);
      const groupKey = `${info.category}:${info.key}`;
      let group = acc.get(groupKey);
      if (!group) {
        group = { name: info.name, category: info.category, nodeIds: [] };
        acc.set(groupKey, group);
      }
      group.nodeIds.push(batch[j].id);
    }

    const done = Math.min(i + BATCH, total);
    const t = Date.now();
    if (t - lastUi >= 80 || done >= total) {
      lastUi = t;
      onProgress?.(done, total);
      await new Promise(r => setTimeout(r, 0));
    }
  }

  return { acc, cache, keyCounts, stats };
}
