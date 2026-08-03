import { scanNode, resetNodesScannedCount } from './scanner';
import { loadSnapshot, loadSnapshotMeta } from './snapshot';
import { handleSnapshotMessage } from './snapshot-messages';
import { processMigratorResults, scanData } from './migrator/scanHandler';
import { onGetLibraries } from './migrator/libraries';
import { onMigrate } from './migrator/migrate';
import { onDetachNotFound } from './migrator/detach';
import type { BindingLocation } from './migrator/types';
import { send } from './migrator/utils';
import { focusNodesByIds } from './focus-nodes';
import { runLibrariesScan } from './libraries-scan/scan';
import { loadFigmaToken, saveFigmaToken, tokenHint } from './figma-token';

figma.showUI(__html__, { width: 450, height: 600, themeColors: true });

(async () => {
  const meta = await loadSnapshotMeta();
  figma.ui.postMessage({
    type: 'snapshot-info',
    updatedAt: meta?.updatedAt,
    fileKey: meta?.fileKey,
    count: meta?.count || 0,
    version: meta?.version,
    source: meta?.source,
    pagesScanned: meta?.pagesScanned,
    pagesTotal: meta?.pagesTotal,
    hasLocal: !!meta,
  });

  const theme = await figma.clientStorage.getAsync('theme');
  if (theme) {
    figma.ui.postMessage({ type: 'init-theme', theme });
  }
})();

async function runGlobalScan(type: string, roots: readonly SceneNode[]) {
  if (roots.length === 0) {
    figma.notify('Ничего не найдено для сканирования');
    return;
  }

  console.log(`[Design Review] Запуск сканирования (${type})...`);
  figma.skipInvisibleInstanceChildren = true;
  figma.ui.postMessage({ type: 'scan-start' });

  const results = {
    components: [] as any[],
    variables: [] as any[],
    gradients: [] as any[],
  };

  resetNodesScannedCount();

  const snapshotData = await loadSnapshot();
  const snapshotArr = snapshotData?.c ?? null;
  const snapshot = snapshotArr ? new Map(snapshotArr.map((s: any) => [s.k, s])) : null;

  if (snapshot) {
    figma.ui.postMessage({
      type: 'snapshot-info',
      updatedAt: snapshotData!.u,
      fileKey: snapshotData!.f,
      count: snapshot.size,
      version: snapshotData!.version,
      hasLocal: true,
    });
  }

  console.log(`[Design Review] Начинаю проверку узлов...`);
  const t1 = Date.now();

  const counter = { n: 0 };
  const onProgress = (count: number) => {
    figma.ui.postMessage({ type: 'scan-progress', count });
  };

  const migratorMap = new Map<string, BindingLocation[]>();

  for (const node of roots) {
    await scanNode(node as SceneNode, results, snapshot, false, '', onProgress, counter, migratorMap);
  }

  const totalIssues = results.components.length + results.variables.length + results.gradients.length;
  const elapsed = Date.now() - t1;
  console.log(`[Design Review] Сканирование завершено за ${elapsed}мс. Проверено: ${counter.n}. Найдено ошибок: ${totalIssues}`);

  const migratorResult = await processMigratorResults(migratorMap, counter.n);

  figma.ui.postMessage({
    type: 'scan-results',
    results,
    scannedCount: counter.n,
    totalIssues,
    migratorResult,
    elapsed: `${elapsed}ms`,
  });
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
    figma.ui.resize(450, msg.expanded ? 2000 : 600);
  }

  if (await handleSnapshotMessage(msg)) return;

  if (msg.type === 'save-theme') {
    await figma.clientStorage.setAsync('theme', msg.theme);
  }

  if (msg.type === 'get-figma-token') {
    const token = await loadFigmaToken();
    figma.ui.postMessage({
      type: 'figma-token-info',
      hasToken: !!token,
      hint: tokenHint(token),
    });
    return;
  }

  if (msg.type === 'save-figma-token') {
    await saveFigmaToken(String(msg.token || ''));
    const token = await loadFigmaToken();
    figma.ui.postMessage({
      type: 'figma-token-info',
      hasToken: !!token,
      hint: tokenHint(token),
    });
    figma.notify(token ? 'Токен сохранён' : 'Токен удалён');
    return;
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
      await onDetachNotFound(scanData, msg.names as string[]);
    } else if (msg.type === 'SCAN') {
      const scope = msg.scope as string;
      const scanType = scope === 'selection' ? 'scan-selection' : 'scan-page';
      let roots: SceneNode[] = [];
      if (scope === 'selection') {
        roots = figma.currentPage.selection as SceneNode[];
      } else if (scope === 'document') {
        figma.ui.postMessage({ type: 'scan-loading-pages' });
        await figma.loadAllPagesAsync();
        for (const page of figma.root.children) {
          roots.push(...(page.children as SceneNode[]));
        }
      } else {
        roots = figma.currentPage.children as SceneNode[];
      }
      await runGlobalScan(scanType, roots);
    } else if (msg.type === 'LIB_SCAN') {
      const roots = msg.scope === 'selection'
        ? (figma.currentPage.selection as SceneNode[])
        : (figma.currentPage.children as SceneNode[]);
      if (!roots.length) {
        figma.notify('Ничего не найдено для сканирования');
        return;
      }
      figma.ui.postMessage({ type: 'scan-start' });
      const result = await runLibrariesScan(roots, (count, total, label) => {
        figma.ui.postMessage({ type: 'scan-progress', count, total, label });
      });
      figma.ui.postMessage({ type: 'lib-scan-results', result });
    }
  } catch (err) {
    send('ERROR', { message: err instanceof Error ? err.message : String(err) });
  }
};
