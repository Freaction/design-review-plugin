import { compareVersions, fetchRemoteMeta, fetchRemoteSnapshot } from '../shared/snapshot-remote.js';
import {
  onDownloadProgress,
  resetDownloadBtn,
  setDownloadUi,
} from '../shared/snapshot-download-ui.js';
import { showScanProgress, showScanStats, formatMetaSummary } from './snapshot-scan-stats';

export { showScanProgress, showScanStats } from './snapshot-scan-stats';

let localMeta = null;
let remoteMeta = null;
let status = 'unknown';
let remoteCheckError = '';

function formatDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function setMainStatus(text, tone) {
  const el = document.getElementById('snapshot-status');
  if (!el) return;
  el.innerHTML = `<span class="status-text status-${tone}">${text}</span>`;
}

function setScanStatus(text1, text2, tone) {
  const t1 = document.getElementById('scan-status-text1');
  const t2 = document.getElementById('scan-status-text2');
  if (!t1) return;
  t1.textContent = text1;
  t1.className = `status-text status-${tone}`;
  if (t2) {
    if (text2) {
      t2.textContent = text2;
      t2.style.display = '';
      t2.className = 'status-text status-link';
    } else {
      t2.style.display = 'none';
    }
  }
}

function renderStatus() {
  const badge = document.getElementById('snapshot-version-badge');
  const localVersion = localMeta?.version || '';
  const remoteVersion = remoteMeta?.version || '';

  if (status === 'current') {
    const label = `✅ Эталон актуален · v${localVersion || '—'} · ${formatMetaSummary(localMeta)} · ${formatDate(localMeta?.updatedAt)}`;
    setMainStatus(label, 'ok');
    setScanStatus(label, '', 'ok');
    if (badge) {
      badge.textContent = 'Актуален';
      badge.className = 'snapshot-badge snapshot-badge-ok';
    }
    return;
  }

  if (status === 'ahead') {
    const label = `ℹ️ Локально новее · v${localVersion}, на сервере устарела v${remoteVersion}`;
    setMainStatus(label, 'ok');
    setScanStatus(label, 'Экспортируйте JSON и обновите GitHub', 'ok');
    if (badge) {
      badge.textContent = 'Локально новее';
      badge.className = 'snapshot-badge snapshot-badge-ok';
    }
    return;
  }

  if (status === 'outdated') {
    const label = localMeta
      ? `⚠️ Эталон устарел · локально v${localVersion || '—'}, на сервере v${remoteVersion}`
      : `⚠️ Эталон не загружен · на сервере v${remoteVersion}`;
    setMainStatus(label, 'warn');
    setScanStatus(label, 'Нажмите «Обновить эталон с GitHub»', 'warn');
    if (badge) {
      badge.textContent = localMeta ? 'Устарел' : 'Не загружен';
      badge.className = 'snapshot-badge snapshot-badge-warn';
    }
    return;
  }

  if (localMeta) {
    const label = `✅ Эталон загружен · v${localVersion || '—'} · ${formatMetaSummary(localMeta)} · ${formatDate(localMeta.updatedAt)}`;
    const hint = remoteCheckError
      ? 'Не удалось проверить сервер — обновление всё равно доступно'
      : '';
    setMainStatus(label, 'ok');
    setScanStatus(label, hint, 'ok');
    if (badge) {
      badge.textContent = remoteMeta ? 'Локальный' : 'Не проверен';
      badge.className = 'snapshot-badge';
    }
    return;
  }

  setMainStatus('Эталон не загружен — обновите с GitHub', 'error');
  setScanStatus('Эталон не загружен — ', 'обновите с GitHub', 'error');
  if (badge) {
    badge.textContent = 'Нет эталона';
    badge.className = 'snapshot-badge snapshot-badge-error';
  }
}

export function applyLocalMeta(meta) {
  localMeta = meta
    ? {
        updatedAt: meta.updatedAt,
        fileKey: meta.fileKey,
        count: meta.count,
        version: meta.version,
        source: meta.source,
        pagesScanned: meta.pagesScanned,
        pagesTotal: meta.pagesTotal,
        elapsedMs: meta.elapsedMs,
      }
    : null;
  status = compareVersions(localMeta?.version, remoteMeta?.version);
  renderStatus();
  if (localMeta?.pagesTotal != null) showScanStats(localMeta);
}

export async function checkRemoteVersion() {
  remoteCheckError = '';
  try {
    remoteMeta = await fetchRemoteMeta();
    status = compareVersions(localMeta?.version, remoteMeta?.version);
  } catch (err) {
    remoteMeta = null;
    remoteCheckError = err instanceof Error ? err.message : String(err);
    status = localMeta ? 'unknown' : 'outdated';
  }
  renderStatus();
  return { remoteMeta, status };
}

export async function downloadAndSaveRemote() {
  setDownloadUi('Проверка версии на GitHub...');

  try {
    remoteCheckError = '';
    remoteMeta = await fetchRemoteMeta();
    status = compareVersions(localMeta?.version, remoteMeta.version);

    if (status === 'current' || status === 'ahead') {
      renderStatus();
      resetDownloadBtn();
      return;
    }

    setDownloadUi(`Скачивание v${remoteMeta.version}...`);
    const storage = await fetchRemoteSnapshot(onDownloadProgress);
    setDownloadUi(
      `Сохранение · ${remoteMeta.count || storage.c?.length || 0} комп. v${remoteMeta.version}`,
    );
    parent.postMessage({
      pluginMessage: { type: 'save-remote-snapshot', storage, remoteMeta },
    }, '*');
  } catch (err) {
    resetDownloadBtn();
    setScanStatus(err instanceof Error ? err.message : String(err), '', 'error');
    setMainStatus(err instanceof Error ? err.message : String(err), 'error');
  }
}

export function onRemoteSaved(meta) {
  applyLocalMeta(meta);
  remoteCheckError = '';
  resetDownloadBtn();
}

export function downloadJson(filename, data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function initSnapshotUi() {
  document.getElementById('download-snapshot')?.addEventListener('click', () => {
    downloadAndSaveRemote();
  });

  document.getElementById('export-snapshot')?.addEventListener('click', () => {
    parent.postMessage({ pluginMessage: { type: 'export-snapshot' } }, '*');
  });
}
