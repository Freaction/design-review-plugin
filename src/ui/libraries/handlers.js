import { libState } from './state.js';
import { $, post, setBtn } from '../migrator/helpers.js';
import { renderLibTree } from './tree-ui.js';
import { renderLibResults, initLibResults } from './results-ui.js';
import { setScanStatsComplete } from '../shared/scan-stats.js';

export function initLibrariesTab() {
  initLibResults();

  $('btnLibScanSelection')?.addEventListener('click', () => {
    setBtn('btnLibScanSelection', true, '<div class="cta-inner-border"></div><span>Скан...</span>');
    $('libUsagePanel')?.classList.add('hidden');
    post('LIB_SCAN', { scope: 'selection' });
  });

  $('btnLibScanPage')?.addEventListener('click', () => {
    setBtn('btnLibScanPage', true, '<div class="cta-inner-border"></div><span>Скан...</span>');
    $('libUsagePanel')?.classList.add('hidden');
    post('LIB_SCAN', { scope: 'page' });
  });
}

export function handleLibrariesMessage(msg) {
  if (!msg || msg.type !== 'lib-scan-results') return false;

  setBtn('btnLibScanSelection', false);
  setBtn('btnLibScanPage', false);

  libState.result = msg.result;
  libState.checked = new Set();
  libState.expanded = new Set();
  for (const cat of msg.result.categories) {
    if (cat.id === 'etalon') continue;
    libState.expanded.add(cat.id);
    for (const c of cat.components) libState.checked.add(`${cat.id}:${c.key}`);
  }

  const r = msg.result;
  setScanStatsComplete(r.instanceTotal, { error: 0, warning: 0, info: 0 });
  const timeEls = document.querySelectorAll('#page-libraries .scan-stats-time');
  for (const el of timeEls) {
    const mode = r.usedRest ? 'по библиотекам' : 'эталон / вне эталона';
    el.textContent =
      `Инстансов: ${r.instanceTotal} · remote: ${r.remoteCount} · локальных: ${r.localCount} · ${mode}`;
  }

  $('libUsageSection')?.classList.remove('hidden');
  renderLibTree();
  renderLibResults();
  return true;
}
