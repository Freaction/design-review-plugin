import { saveSnapshot, saveRemoteSnapshot, loadSnapshot, loadSnapshotMeta } from './snapshot';

export async function handleSnapshotMessage(msg: any): Promise<boolean> {
  if (msg.type === 'update-snapshot') {
    try {
      const meta = await saveSnapshot(msg.version);
      figma.notify(`✅ Эталон обновлён: ${meta.count} компонентов из "${meta.fileName || meta.fileKey || 'UI-Kit'}"`);
      figma.ui.postMessage({ type: 'snapshot-saved', ...meta });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      figma.notify(`✕ ${message}`);
      figma.ui.postMessage({ type: 'snapshot-scan-error', message });
    }
    return true;
  }

  if (msg.type === 'save-remote-snapshot') {
    try {
      const meta = await saveRemoteSnapshot(msg.storage, msg.remoteMeta || {});
      figma.notify(`✅ Эталон с GitHub: v${meta.version || '—'} · ${meta.count} компонентов`);
      figma.ui.postMessage({ type: 'snapshot-remote-saved', ...meta });
    } catch (err) {
      figma.ui.postMessage({
        type: 'snapshot-remote-error',
        message: err instanceof Error ? err.message : String(err),
      });
    }
    return true;
  }

  if (msg.type === 'export-snapshot') {
    const storage = await loadSnapshot();
    const meta = await loadSnapshotMeta();
    if (!storage || !meta || !storage.c.length) {
      figma.notify('Сначала отсканируйте UI-Kit');
      return true;
    }
    figma.ui.postMessage({
      type: 'snapshot-export',
      storage,
      meta: {
        version: meta.version || storage.version || storage.u.slice(0, 10).replace(/-/g, '.'),
        updatedAt: meta.updatedAt,
        count: meta.count,
        fileKey: meta.fileKey,
        pagesScanned: meta.pagesScanned,
        pagesTotal: meta.pagesTotal,
      },
    });
    return true;
  }

  return false;
}
