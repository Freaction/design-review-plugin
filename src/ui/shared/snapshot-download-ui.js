function formatElapsed(ms) {
  const totalSec = Math.max(0, Math.floor((ms || 0) / 1000));
  const minutes = Math.floor(totalSec / 60);
  const seconds = totalSec % 60;
  if (minutes > 0) return `${minutes}м ${seconds}с`;
  return `${seconds}с`;
}

export function setDownloadUi(text, tone = 'warn') {
  const btn = document.getElementById('download-snapshot');
  const label = document.getElementById('download-snapshot-text');
  const t1 = document.getElementById('scan-status-text1');
  const t2 = document.getElementById('scan-status-text2');
  if (btn) btn.disabled = true;
  if (label) label.textContent = text.length > 42 ? `⏳ ${text.slice(0, 40)}…` : `⏳ ${text}`;
  if (t1) {
    t1.textContent = `⏳ ${text}`;
    t1.className = `status-text status-${tone}`;
  }
  if (t2) t2.style.display = 'none';
}

export function resetDownloadBtn() {
  const btn = document.getElementById('download-snapshot');
  const label = document.getElementById('download-snapshot-text');
  if (btn) btn.disabled = false;
  if (label) label.textContent = 'Обновить эталон с GitHub';
}

export function onDownloadProgress(p) {
  const elapsed = p.elapsedMs != null ? ` · ${formatElapsed(p.elapsedMs)}` : '';
  setDownloadUi(`${p.label || 'Загрузка'}${elapsed}`);
}
