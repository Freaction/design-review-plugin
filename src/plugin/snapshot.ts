import { resolveEtalonFileKey } from './resolve-etalon-file-key';
import { buildLayerTree } from './snapshot-layers';

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
  fn?: string;
  version?: string;
  pagesScanned?: number;
  pagesTotal?: number;
}

export interface SnapshotMeta {
  updatedAt: string;
  fileKey: string;
  fileName?: string;
  count: number;
  version?: string;
  source?: 'local' | 'remote';
  pagesScanned?: number;
  pagesTotal?: number;
  elapsedMs?: number;
}

function buildMeta(storage: SnapshotStorage, source: 'local' | 'remote'): SnapshotMeta {
  return {
    updatedAt: storage.u,
    fileKey: storage.f,
    fileName: storage.fn,
    count: storage.c.length,
    version: storage.version,
    source,
  };
}

async function persist(storage: SnapshotStorage, source: 'local' | 'remote', extra: Partial<SnapshotMeta> = {}) {
  const meta = { ...buildMeta(storage, source), ...extra };
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
  const sampleKeys = components.slice(0, 8).map(c => c.k);
  const fileKey = (await resolveEtalonFileKey(figma.fileKey, sampleKeys)) || '';
  const storage: SnapshotStorage = {
    c: components,
    u: new Date().toISOString(),
    f: fileKey,
    fn: figma.root.name,
    version: version || new Date().toISOString().slice(0, 10).replace(/-/g, '.'),
    pagesScanned,
    pagesTotal,
  };

  console.log(
    `[DS Snapshot] Эталон: ${components.length} комп., ${pagesScanned}/${pagesTotal} стр., fileKey=${fileKey || '—'}`,
  );
  return persist(storage, 'local', { pagesScanned, pagesTotal, elapsedMs });
}

export async function saveRemoteSnapshot(
  storage: SnapshotStorage,
  remoteMeta: Partial<SnapshotMeta> = {},
): Promise<SnapshotMeta> {
  if (!storage?.c || !Array.isArray(storage.c) || storage.c.length === 0) {
    throw new Error('Некорректный или пустой snapshot');
  }
  const pagesScanned = remoteMeta.pagesScanned ?? storage.pagesScanned;
  const pagesTotal = remoteMeta.pagesTotal ?? storage.pagesTotal;
  const normalized: SnapshotStorage = {
    c: storage.c,
    u: storage.u || new Date().toISOString(),
    f: storage.f || '',
    fn: storage.fn,
    version: storage.version ?? remoteMeta.version,
    pagesScanned,
    pagesTotal,
  };
  console.log(`[DS Snapshot] Полная замена эталона с GitHub: ${normalized.c.length} компонентов`);
  return persist(normalized, 'remote', { pagesScanned, pagesTotal, version: normalized.version });
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
