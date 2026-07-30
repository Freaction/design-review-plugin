const STORAGE_KEY = 'ds_component_snapshot';
const STORAGE_KEY_META = 'ds_component_snapshot_meta';

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
  version?: string;
}

export interface SnapshotMeta {
  updatedAt: string;
  fileKey: string;
  count: number;
  version?: string;
  source?: 'local' | 'remote';
  pagesScanned?: number;
  pagesTotal?: number;
  elapsedMs?: number;
}

import {
  extractFills, extractStrokes, extractRadius, extractPadding,
  extractItemSpacing, extractFont
} from './extractors';

async function buildLayerTree(node: SceneNode, layers: Record<string, string>) {
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
      await buildLayerTree(child, layers);
    }
  }
}

function buildMeta(storage: SnapshotStorage, source: 'local' | 'remote'): SnapshotMeta {
  return {
    updatedAt: storage.u,
    fileKey: storage.f,
    count: storage.c.length,
    version: storage.version,
    source,
  };
}

async function persist(storage: SnapshotStorage, source: 'local' | 'remote') {
  const meta = buildMeta(storage, source);
  await figma.clientStorage.setAsync(STORAGE_KEY, storage);
  await figma.clientStorage.setAsync(STORAGE_KEY_META, meta);
  return meta;
}

async function collectPageComponents(page: PageNode): Promise<ComponentNode[]> {
  await page.loadAsync();
  return page.findAllWithCriteria({ types: ['COMPONENT'] }) as ComponentNode[];
}

export async function saveSnapshot(version?: string): Promise<SnapshotMeta> {
  const t0 = Date.now();
  figma.ui.postMessage({
    type: 'snapshot-progress',
    page: 'загрузка страниц',
    pageIndex: 0,
    pagesTotal: 0,
    pagesScanned: 0,
    processed: 0,
    elapsedMs: 0,
  });
  await figma.loadAllPagesAsync();

  const components: ComponentSnapshot[] = [];
  const BATCH_SIZE = 50;
  const pages = figma.root.children;
  const pagesTotal = pages.length;
  let pagesScanned = 0;

  for (let p = 0; p < pages.length; p++) {
    const page = pages[p];
    figma.ui.postMessage({
      type: 'snapshot-progress',
      page: page.name,
      pageIndex: p + 1,
      pagesTotal,
      pagesScanned,
      processed: components.length,
      elapsedMs: Date.now() - t0,
    });

    let nodes: ComponentNode[];
    try {
      nodes = await collectPageComponents(page);
    } catch (err) {
      console.warn(`[DS Snapshot] Страница «${page.name}» пропущена:`, err);
      continue;
    }

    pagesScanned++;

    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      if (!node.key) continue;

      const parentName = node.parent?.type === 'COMPONENT_SET' ? node.parent.name : undefined;
      const layers: Record<string, string> = {};
      await buildLayerTree(node, layers);
      components.push({ k: node.key, n: node.name, p: parentName, l: layers });

      if ((i + 1) % BATCH_SIZE === 0) {
        figma.ui.postMessage({
          type: 'snapshot-progress',
          page: page.name,
          pageIndex: p + 1,
          pagesTotal,
          pagesScanned,
          processed: components.length,
          elapsedMs: Date.now() - t0,
        });
        await new Promise<void>(resolve => setTimeout(resolve, 0));
      }
    }
  }

  if (components.length === 0) {
    throw new Error('Компоненты не найдены. Открой файл UI-Kit и повтори скан.');
  }

  const elapsedMs = Date.now() - t0;
  const storage: SnapshotStorage = {
    c: components,
    u: new Date().toISOString(),
    f: figma.root.name,
    version: version || new Date().toISOString().slice(0, 10).replace(/-/g, '.'),
  };

  console.log(`[DS Snapshot] Полная замена эталона: ${components.length} компонентов из "${storage.f}"`);
  const meta = await persist(storage, 'local');
  return { ...meta, pagesScanned, pagesTotal, elapsedMs };
}

export async function saveRemoteSnapshot(storage: SnapshotStorage): Promise<SnapshotMeta> {
  if (!storage?.c || !Array.isArray(storage.c) || storage.c.length === 0) {
    throw new Error('Некорректный или пустой snapshot');
  }
  const normalized: SnapshotStorage = {
    c: storage.c,
    u: storage.u || new Date().toISOString(),
    f: storage.f || 'UI-Kit',
    version: storage.version,
  };
  console.log(`[DS Snapshot] Полная замена эталона с GitHub: ${normalized.c.length} компонентов`);
  return persist(normalized, 'remote');
}

export async function loadSnapshot(): Promise<SnapshotStorage | null> {
  try {
    return await figma.clientStorage.getAsync(STORAGE_KEY) as SnapshotStorage | null;
  } catch {
    return null;
  }
}

export async function loadSnapshotMeta(): Promise<SnapshotMeta | null> {
  try {
    return await figma.clientStorage.getAsync(STORAGE_KEY_META) as SnapshotMeta | null;
  } catch {
    return null;
  }
}
