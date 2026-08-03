const CHECK_SVG =
  '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.2 5.59998L6.42698 10.4L4.79999 8.76379" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

let scanStartTime = 0;

function blocks() {
  return document.querySelectorAll('.scan-stats');
}

function setVisible(root, visible) {
  root.classList.toggle('hidden', !visible);
  if (visible) root.style.display = 'flex';
  else root.style.display = 'none';
}

function setTime(root, text) {
  const el = root.querySelector('.scan-stats-time');
  if (el) el.textContent = text;
}

function setIcon(root, show) {
  const icon = root.querySelector('.scan-stats-icon');
  if (!icon) return;
  if (show) {
    icon.innerHTML = CHECK_SVG;
    icon.style.display = 'flex';
  } else {
    icon.style.display = 'none';
  }
}

function formatElapsed(ms) {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  return minutes > 0 ? `${minutes}м ${seconds % 60}с` : `${seconds}с`;
}

export function setScanStart() {
  scanStartTime = Date.now();
  for (const root of blocks()) {
    setVisible(root, true);
    setTime(root, '⏳ Подготовка...');
    setIcon(root, false);
    const error = root.querySelector('.scan-stats-error');
    const warning = root.querySelector('.scan-stats-warning');
    const info = root.querySelector('.scan-stats-info');
    if (error) error.textContent = '0 блокер';
    if (warning) warning.textContent = '0 предупр.';
    if (info) info.textContent = '0 инфо';
  }
}

export function setScanLoadingPages() {
  for (const root of blocks()) {
    setVisible(root, true);
    setTime(root, '⏳ Загрузка страниц...');
    setIcon(root, false);
  }
}

export function setScanProgress(count, total, label) {
  const timeStr = formatElapsed(Date.now() - scanStartTime);
  let text;
  if (label) {
    text = label.includes('·') || label.includes('%')
      ? `⏳ ${label}`
      : `⏳ ${label} · ${timeStr}`;
  } else if (total) {
    text = `⏳ ${count}/${total} · ${timeStr}`;
  } else {
    text = `⏳ ${count} · ${timeStr}`;
  }
  for (const root of blocks()) {
    setVisible(root, true);
    setTime(root, text);
    setIcon(root, false);
  }
}

export function setScanStatsComplete(scannedCount, totals) {
  const seconds = Math.floor((Date.now() - scanStartTime) / 1000);
  for (const root of blocks()) {
    setVisible(root, true);
    setTime(root, `Проверено ${scannedCount} слоев за ${seconds}с`);
    const error = root.querySelector('.scan-stats-error');
    const warning = root.querySelector('.scan-stats-warning');
    const info = root.querySelector('.scan-stats-info');
    if (error) error.textContent = `${totals.error} блокер`;
    if (warning) warning.textContent = `${totals.warning} предупр.`;
    if (info) info.textContent = `${totals.info} инфо`;
    setIcon(root, true);
  }
}
