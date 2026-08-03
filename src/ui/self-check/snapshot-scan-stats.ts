export function formatElapsed(ms) {
  const totalSec = Math.max(0, Math.floor((ms || 0) / 1000));
  const minutes = Math.floor(totalSec / 60);
  const seconds = totalSec % 60;
  if (minutes > 0) return `${minutes}м ${seconds}с`;
  return `${seconds}с`;
}

export function formatMetaSummary(meta) {
  const comp = `${meta?.count || 0} комп.`;
  if (meta?.pagesTotal == null) return comp;
  const scanned = meta.pagesScanned ?? meta.pagesTotal;
  return `${comp} · ${scanned}/${meta.pagesTotal} стр.`;
}

export function showScanProgress(msg) {
  const stats = document.getElementById('snapshot-scan-stats');
  const statsText = document.getElementById('snapshot-scan-stats-text');
  const text1 = document.getElementById('scan-status-text1');
  const text2 = document.getElementById('scan-status-text2');
  const elapsed = formatElapsed(msg.elapsedMs);
  const pagesPart = msg.pagesTotal
    ? `страница ${msg.pageIndex || 0}/${msg.pagesTotal}`
    : `стр. «${msg.page}»`;

  if (text1) {
    text1.textContent = `⏳ Скан UI-Kit... ${pagesPart}, компонентов: ${msg.processed || 0}, ${elapsed}`;
    text1.className = 'status-text status-warn';
  }
  if (text2) text2.style.display = 'none';
  if (stats) stats.classList.remove('hidden');
  if (statsText) {
    statsText.textContent = `В процессе: ${pagesPart} · ${msg.processed || 0} комп. · ${elapsed}`;
  }
}

export function showScanStats(meta) {
  const stats = document.getElementById('snapshot-scan-stats');
  const statsText = document.getElementById('snapshot-scan-stats-text');
  if (!stats || !statsText) return;
  stats.classList.remove('hidden');
  const pages = meta.pagesTotal != null
    ? `${meta.pagesScanned || 0}/${meta.pagesTotal} стр.`
    : '—';
  statsText.textContent = `Готово: ${meta.count || 0} комп. · ${pages} · ${formatElapsed(meta.elapsedMs)}`;
}
