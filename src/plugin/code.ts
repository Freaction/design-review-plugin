import { scanNode, resetNodesScannedCount } from './scanner';
import { saveSnapshot, loadSnapshot, loadSnapshotMeta } from './snapshot';
import { SCAN_NODE_TYPES } from './scan-config';

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

figma.ui.onmessage = async (msg) => {
  if (msg.type === 'scan-selection' || msg.type === 'scan-page') {
    const roots = msg.type === 'scan-selection'
      ? figma.currentPage.selection
      : figma.currentPage.children;

    if (roots.length === 0) {
      figma.notify("Ничего не найдено для сканирования");
      return;
    }

    const t0 = Date.now();
    console.log(`[Design Review] Запуск сканирования (${msg.type})... Собираем узлы...`);

    figma.skipInvisibleInstanceChildren = true;

    let totalNodesToScan = 0;
    if (msg.type === 'scan-selection') {
      for (const root of figma.currentPage.selection) {
        totalNodesToScan++;
        if ('findAllWithCriteria' in root) {
          totalNodesToScan += (root as any).findAllWithCriteria({ types: SCAN_NODE_TYPES }).length;
        }
      }
    } else {
      totalNodesToScan = figma.currentPage.findAllWithCriteria({ types: SCAN_NODE_TYPES }).length;
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
    };

    for (const node of roots) {
      await scanNode(node as SceneNode, results, snapshot, false, '', onProgress, counter);
    }

    const totalIssues = results.components.length + results.variables.length + results.gradients.length;
    console.log(`[Design Review] Сканирование завершено за ${Date.now() - t1}мс. Проверено: ${counter.n}. Найдено ошибок: ${totalIssues}`);

    figma.ui.postMessage({ type: 'scan-results', results, scannedCount: counter.n, totalIssues });
  }

  if (msg.type === 'focus-node') {
    const node = await figma.getNodeByIdAsync(msg.nodeId) as SceneNode;
    if (node) {
      figma.currentPage.selection = [node];
      figma.viewport.scrollAndZoomIntoView([node]);
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
};
