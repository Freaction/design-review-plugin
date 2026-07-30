import { scanNode, resetNodesScannedCount } from './scanner';
import { saveSnapshot, loadSnapshot, loadSnapshotMeta } from './snapshot';
import { SCAN_NODE_TYPES } from './scan-config';
import { processMigratorResults, scanData } from './migrator/scanHandler';
import { onGetLibraries } from './migrator/libraries';
import { onMigrate } from './migrator/migrate';
import { onDetachNotFound } from './migrator/detach';
import type { BindingLocation } from './migrator/types';
import { send } from './migrator/utils';
import { focusNodesByIds } from './focus-nodes';

figma.showUI(__html__, { width: 450, height: 600, themeColors: true });

(async () => {
  const meta = await loadSnapshotMeta();
  if (meta) {
    figma.ui.postMessage({
      type: 'snapshot-info',
      updatedAt: meta.updatedAt,
      fileKey: meta.fileKey,
      count: meta.count
    });
  }

  const theme = await figma.clientStorage.getAsync('theme');
  if (theme) {
    figma.ui.postMessage({ type: 'init-theme', theme });
  }
})();

async function runGlobalScan(type: string, roots: readonly SceneNode[]) {
  if (roots.length === 0) {
    figma.notify("Ничего не найдено для сканирования");
    return;
  }

  const t0 = Date.now();
  console.log(`[Design Review] Запуск сканирования (${type})... Собираем узлы...`);

  figma.skipInvisibleInstanceChildren = true;

  let totalNodesToScan = 0;
  if (type === 'scan-selection') {
    for (const root of roots) {
      totalNodesToScan++;
      if ('findAllWithCriteria' in root) {
        totalNodesToScan += (root as any).findAllWithCriteria({ types: SCAN_NODE_TYPES }).length;
      }
    }
  } else {
    for (const root of roots) {
      totalNodesToScan++;
      if ('findAllWithCriteria' in root) {
        totalNodesToScan += (root as any).findAllWithCriteria({ types: SCAN_NODE_TYPES }).length;
      }
    }
  }

  console.log(`[Design Review] Узлы собраны за ${Date.now() - t0}мс. Всего узлов: ${totalNodesToScan}`);

  figma.ui.postMessage({ type: 'scan-start', total: totalNodesToScan });

  const results = {
    components: [] as any[],
    variables: [] as any[],
    gradients: [] as any[]
  };

  resetNodesScannedCount();

  const snapshotData = await loadSnapshot();
  const snapshotArr = snapshotData?.c ?? null;
  const snapshot = snapshotArr ? new Map(snapshotArr.map((s: any) => [s.k, s])) : null;

  if (snapshot) {
    figma.ui.postMessage({ type: 'snapshot-info', updatedAt: snapshotData!.u, fileKey: snapshotData!.f, count: snapshot.size });
  }

  console.log(`[Design Review] Начинаю проверку узлов...`);
  const t1 = Date.now();

  const counter = { n: 0 };
  const onProgress = (count: number) => {
    figma.ui.postMessage({ type: 'scan-progress', count });
    send('SCAN_PROGRESS', { nodeCount: count, total: totalNodesToScan, elapsed: `${Date.now() - t1}ms` });
  };

  const migratorMap = new Map<string, BindingLocation[]>();

  for (const node of roots) {
    await scanNode(node as SceneNode, results, snapshot, false, '', onProgress, counter, migratorMap);
  }

  const totalIssues = results.components.length + results.variables.length + results.gradients.length;
  const elapsed = Date.now() - t1;
  console.log(`[Design Review] Сканирование завершено за ${elapsed}мс. Проверено: ${counter.n}. Найдено ошибок: ${totalIssues}`);

  const migratorResult = processMigratorResults(migratorMap, counter.n, t1);

  figma.ui.postMessage({ type: 'scan-results', results, scannedCount: counter.n, totalIssues, migratorResult, elapsed: `${elapsed}ms` });
}

figma.ui.onmessage = async (msg) => {
  if (msg.type === 'scan-selection' || msg.type === 'scan-page') {
    const roots = msg.type === 'scan-selection'
      ? figma.currentPage.selection
      : figma.currentPage.children;

    await runGlobalScan(msg.type, roots as SceneNode[]);
  }

  if (msg.type === 'focus-node') {
    await focusNodesByIds([msg.nodeId]);
  }

  if (msg.type === 'focus-nodes') {
    await focusNodesByIds(msg.nodeIds || []);
  }

  if (msg.type === 'FOCUS_VARIABLE') {
    if (scanData) {
      const usage = Array.from(scanData.values()).find(u => u.variableName === msg.name);
      if (usage?.locations.length) {
        await focusNodesByIds(usage.locations.map(loc => loc.nodeId));
      }
    }
  }

  if (msg.type === 'resize') {
    const newHeight = msg.expanded ? 2000 : 600;
    figma.ui.resize(450, newHeight);
  }

  if (msg.type === 'update-snapshot') {
    const { count, fileKey } = await saveSnapshot();
    figma.notify(`✅ Эталон обновлён: ${count} компонентов из "${fileKey}"`);
    figma.ui.postMessage({ type: 'snapshot-saved', count, fileKey, updatedAt: new Date().toISOString() });
  }

  if (msg.type === 'save-theme') {
    await figma.clientStorage.setAsync('theme', msg.theme);
  }

  try {
    if (msg.type === 'GET_LIBRARIES') {
      await onGetLibraries();
    } else if (msg.type === 'MIGRATE') {
      if (!scanData || scanData.size === 0) throw new Error('Сначала выполни сканирование.');
      if (!(msg.collectionKeys as string[])?.length) throw new Error('Выбери хотя бы одну коллекцию.');
      await onMigrate(scanData, msg.collectionKeys as string[], msg.dryRun);
    } else if (msg.type === 'DETACH_NOT_FOUND') {
      if (!scanData || scanData.size === 0) throw new Error('Сначала выполни сканирование.');
      onDetachNotFound(scanData, msg.names as string[]);
    } else if (msg.type === 'SCAN') {
      const scope = msg.scope as string;
      const scanType = scope === 'selection' ? 'scan-selection' : 'scan-page';

      let roots: SceneNode[] = [];
      if (scope === 'selection') {
        roots = figma.currentPage.selection as SceneNode[];
      } else if (scope === 'document') {
        roots = [];
        for (const page of figma.root.children) {
          roots.push(...(page.children as SceneNode[]));
        }
      } else {
        roots = figma.currentPage.children as SceneNode[];
      }

      await runGlobalScan(scanType, roots);
    }
  } catch (err) {
    send('ERROR', { message: err instanceof Error ? err.message : String(err) });
  }
};
