import { state, colState } from './state.js';
import { $, post, setBtn, toast } from './helpers.js';
import { onLibraries } from './library-ui.js';
import { onScan, onMigrate, onDetach, initTabs } from './results-ui.js';

export { initTabs };

export function initScanButton() {
  $('btnScanSelection')?.addEventListener('click', () => {
    setBtn('btnScanSelection', true, '<div class="cta-inner-border"></div><span>Скан...</span>');
    $('migrator-results-divider').classList.add('hidden');
    $('panelResult').classList.add('hidden');
    post('SCAN', { scope: 'selection' });
  });

  $('btnScanPage')?.addEventListener('click', () => {
    setBtn('btnScanPage', true, '<div class="cta-inner-border"></div><span>Скан...</span>');
    $('migrator-results-divider').classList.add('hidden');
    $('panelResult').classList.add('hidden');
    post('SCAN', { scope: 'page' });
  });
}

export function initMigrateButton() {
  $('btnMigrate').addEventListener('click', () => {
    const keys = [...colState.entries()].filter(([, v]) => v.checked).map(([k]) => k);
    if (!keys.length) return;
    setBtn('btnMigrate', true, '<div class="cta-inner-border"></div><span>Замена…</span>');
    post('MIGRATE', { collectionKeys: keys });
  });

  $('btnCheckMigrate')?.addEventListener('click', () => {
    const keys = [...colState.entries()].filter(([, v]) => v.checked).map(([k]) => k);
    if (!keys.length) return;
    setBtn('btnCheckMigrate', true, '<div class="cta-inner-border"></div><span>Проверка…</span>');
    post('MIGRATE', { collectionKeys: keys, dryRun: true });
  });
}

export function initCopyButton() {
  $('btnCopyNotFound').addEventListener('click', () => {
    if (!state.currentNotFound.length) return;
    const text = state.currentNotFound.join('\n');
    const btn = $('btnCopyNotFound');
    const orig = btn.innerHTML;
    const markCopied = () => {
      btn.innerHTML = '✓ Скопировано';
      btn.style.color = 'var(--color-primary)';
      setTimeout(() => {
        btn.innerHTML = orig;
        btn.style.color = '';
      }, 2000);
    };

    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(markCopied).catch(() => fallbackCopy(text, markCopied));
    } else {
      fallbackCopy(text, markCopied);
    }
  });
}

function fallbackCopy(text, onDone) {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.cssText = 'position:fixed;opacity:0';
  document.body.appendChild(ta);
  ta.select();
  document.execCommand('copy');
  document.body.removeChild(ta);
  onDone();
}

export function initDetachButton() {
  $('btnDetach').addEventListener('click', () => {
    if (!state.currentNotFound.length) return;
    state.detachTarget = '';
    setBtn('btnDetach', true, 'Отвязка…');
    post('DETACH_NOT_FOUND', { names: state.currentNotFound });
  });
}

export function handleMigratorMessage(msg) {
  if (!msg) return;
  switch (msg.type) {
    case 'LIBRARIES_LOADED':
      onLibraries(msg.collections);
      break;
    case 'SCAN_COMPLETE':
      onScan(msg.result);
      break;
    case 'MIGRATE_START':
      toast(`Начинаем замену ${msg.total} переменных...`);
      break;
    case 'MIGRATE_COMPLETE':
      onMigrate(msg);
      break;
    case 'DETACH_COMPLETE':
      onDetach(msg.result);
      break;
    case 'ERROR':
      toast(msg.message);
      setBtn('btnScanSelection', false);
      setBtn('btnScanPage', false);
      setBtn('btnMigrate', false);
      setBtn('btnCheckMigrate', false);
      setBtn('btnDetach', false);
      break;
  }
}
