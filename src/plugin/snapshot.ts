const STORAGE_KEY = 'ds_component_snapshot';
const STORAGE_KEY_META = 'ds_component_snapshot_meta';

export interface LayerSnapshot {
  f?: string;
  s?: string;
  r?: string;
  p?: string;
  i?: string;
  t?: string;
}

export interface ComponentSnapshot {
  k: string;
  n: string;
  p?: string;
  l: Record<string, string>;
}

export interface SnapshotStorage {
  c: ComponentSnapshot[];
  u: string;
  f: string;
}

import {
  extractFills, extractStrokes, extractRadius, extractPadding,
  extractItemSpacing, extractFont, getNodePath
} from './extractors';

async function buildLayerTree(node: SceneNode, rootId: string, layers: Record<string, string>) {
  const parts: string[] = [];

  const fills = await extractFills(node);
  if (fills) parts.push(`f:${fills}`);

  const strokes = await extractStrokes(node);
  if (strokes) parts.push(`s:${strokes}`);

  const radius = extractRadius(node);
  if (radius) parts.push(`r:${radius}`);

  const padding = extractPadding(node);
  if (padding) parts.push(`p:${padding}`);

  const itemSpacing = extractItemSpacing(node);
  if (itemSpacing) parts.push(`i:${itemSpacing}`);

  const font = extractFont(node);
  if (font) parts.push(`t:${font}`);

  if (parts.length > 0) {
    layers[node.name] = parts.join('|');
  }

  if ('children' in node) {
    for (const child of node.children) {
      await buildLayerTree(child, rootId, layers);
    }
  }
}

export async function saveSnapshot(): Promise<{ count: number; fileKey: string }> {
  const components: ComponentSnapshot[] = [];
  const BATCH_SIZE = 100;

  for (const page of figma.root.children) {
    let nodes: ComponentNode[];
    try {
      nodes = page.findAllWithCriteria({ types: ['COMPONENT'] }) as ComponentNode[];
    } catch {
      continue;
    }

    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      const parentName = node.parent?.type === 'COMPONENT_SET' ? node.parent.name : undefined;
      const layers: Record<string, string> = {};
      
      await buildLayerTree(node, node.id, layers);

      components.push({ k: node.key, n: node.name, p: parentName, l: layers });

      if ((i + 1) % BATCH_SIZE === 0) {
        figma.ui.postMessage({
          type: 'snapshot-progress',
          page: page.name,
          processed: components.length
        });
        await new Promise<void>(resolve => setTimeout(resolve, 50));
      }
    }
  }

  const storage: SnapshotStorage = {
    c: components,
    u: new Date().toISOString(),
    f: figma.root.name
  };

  const meta = {
    updatedAt: storage.u,
    fileKey: storage.f,
    count: components.length
  };

  await figma.clientStorage.setAsync(STORAGE_KEY, storage);
  await figma.clientStorage.setAsync(STORAGE_KEY_META, meta);

  console.log(`[DS Snapshot] Сохранено ${components.length} компонентов из "${figma.root.name}"`);
  console.log('[DS Snapshot] Компоненты:', JSON.stringify(
    components.map(c => ({
      component: c.p ? `${c.p} / ${c.n}` : c.n,
      key: c.k
    })),
    null, 2
  ));

  return { count: components.length, fileKey: figma.root.name };
}

export async function loadSnapshot(): Promise<SnapshotStorage | null> {
  try {
    return await figma.clientStorage.getAsync(STORAGE_KEY) as SnapshotStorage | null;
  } catch {
    return null;
  }
}

export async function loadSnapshotMeta(): Promise<{ updatedAt: string, fileKey: string, count: number } | null> {
  try {
    return await figma.clientStorage.getAsync(STORAGE_KEY_META);
  } catch {
    return null;
  }
}
