import { libState } from './state.js';
import { $, post, setBtn } from '../migrator/helpers.js';
import { renderLibTree } from './tree-ui.js';
export function initLibrariesTab() {
  $('btnLibScanSelection')?.addEventListener('click', () => {
    setBtn('btnLibScanSelection', true, '<div class="cta-inner-border"></div><span>Скан...</span>');
    post('LIB_SCAN', { scope: 'selection' });
  });

  $('btnLibScanPage')?.addEventListener('click', () => {
    setBtn('btnLibScanPage', true, '<div class="cta-inner-border"></div><span>Скан...</span>');
    post('LIB_SCAN', { scope: 'page' });
  });
}

export function handleLibrariesMessage(msg) {
  if (!msg || msg.type !== 'lib-scan-results') return false;

  setBtn('btnLibScanSelection', false);
  setBtn('btnLibScanPage', false);

  libState.result = msg.result;
  libState.expanded = new Set();

  const r = msg.result;
  const statsRoot = document.querySelector('#page-libraries .scan-stats');
  if (statsRoot) statsRoot.classList.remove('hidden');
  const timeEls = document.querySelectorAll('#page-libraries .scan-stats-time');
  for (const el of timeEls) {
    const mode = r.usedRest ? 'по библиотекам' : 'эталон / вне эталона';
    el.textContent =
      `Инстансов: ${r.instanceTotal} · remote: ${r.remoteCount} · локальных: ${r.localCount}` +
      (r.brokenCount ? ` · недоступных: ${r.brokenCount}` : '') +
      ` · ${mode}`;
  }

  $('libUsageSection')?.classList.remove('hidden');
  renderLibTree();
  return true;
}
