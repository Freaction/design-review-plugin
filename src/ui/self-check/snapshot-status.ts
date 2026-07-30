import { compareVersions, fetchRemoteMeta, fetchRemoteSnapshot } from '../shared/snapshot-remote.js';

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

function setUpdateBtnState() {
  const updateBtn = document.getElementById('download-snapshot') as HTMLButtonElement | null;
  if (updateBtn) updateBtn.disabled = status === 'current';
}

function renderStatus() {
  const badge = document.getElementById('snapshot-version-badge');
  const localVersion = localMeta?.version || '';
  const remoteVersion = remoteMeta?.version || '';

  if (status === 'current') {
    const label = `✅ Эталон актуален · v${localVersion || '—'} · ${localMeta?.count || 0} комп. · ${formatDate(localMeta?.updatedAt)}`;
    setMainStatus(label, 'ok');
    setScanStatus(label, '', 'ok');
    if (badge) {
      badge.textContent = 'Актуален';
      badge.className = 'snapshot-badge snapshot-badge-ok';
    }
    setUpdateBtnState();
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
    setUpdateBtnState();
    return;
  }

  if (localMeta) {
    const label = `✅ Эталон загружен · v${localVersion || '—'} · ${localMeta.count} комп. · ${formatDate(localMeta.updatedAt)}`;
    const hint = remoteCheckError
      ? 'Не удалось проверить сервер — обновление всё равно доступно'
      : '';
    setMainStatus(label, 'ok');
    setScanStatus(label, hint, 'ok');
    if (badge) {
      badge.textContent = remoteMeta ? 'Локальный' : 'Не проверен';
      badge.className = 'snapshot-badge';
    }
    setUpdateBtnState();
    return;
  }

  setMainStatus('Эталон не загружен — обновите с GitHub', 'error');
  setScanStatus('Эталон не загружен — ', 'обновите с GitHub', 'error');
  if (badge) {
    badge.textContent = 'Нет эталона';
    badge.className = 'snapshot-badge snapshot-badge-error';
  }
  setUpdateBtnState();
}

export function applyLocalMeta(meta) {
  localMeta = meta
    ? {
        updatedAt: meta.updatedAt,
        fileKey: meta.fileKey,
        count: meta.count,
        version: meta.version,
        source: meta.source,
      }
    : null;
  status = compareVersions(localMeta?.version, remoteMeta?.version);
  renderStatus();
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
  const btn = document.getElementById('download-snapshot') as HTMLButtonElement | null;
  const label = document.getElementById('download-snapshot-text');
  if (btn) btn.disabled = true;
  if (label) label.textContent = '⏳ Скачивание...';

  try {
    const storage = await fetchRemoteSnapshot();
    parent.postMessage({ pluginMessage: { type: 'save-remote-snapshot', storage } }, '*');
  } catch (err) {
    if (label) label.textContent = 'Обновить эталон с GitHub';
    if (btn) btn.disabled = status !== 'current';
    setScanStatus(err instanceof Error ? err.message : String(err), '', 'error');
    setMainStatus(err instanceof Error ? err.message : String(err), 'error');
  }
}

export function onRemoteSaved(meta) {
  applyLocalMeta(meta);
  remoteCheckError = '';
  const btn = document.getElementById('download-snapshot') as HTMLButtonElement | null;
  const label = document.getElementById('download-snapshot-text');
  if (btn) btn.disabled = status === 'current';
  if (label) label.textContent = 'Обновить эталон с GitHub';
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
