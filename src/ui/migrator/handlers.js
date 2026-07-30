import { state, colState } from './state.js';
import { $, post, setBtn, toast } from './helpers.js';
import { onLibraries, renderCheckboxes, updateSelBar, updateMigrateBtn } from './library-ui.js';
import { onScan, onMigrate, onDetach, initTabs } from './results-ui.js';

export { initTabs };

export function initScanButton() {
  $('btnScanSelection')?.addEventListener('click', () => {
    setBtn('btnScanSelection', true, '<div class="cta-inner-border"></div><span>Скан...</span>');
    $('migrator-stats-area').classList.add('hidden');
    $('migrator-results-divider').classList.add('hidden');
    $('panelResult').classList.add('hidden');
    state.scanTotal = 0;
    post('SCAN', { scope: 'selection' });
  });

  $('btnScanPage')?.addEventListener('click', () => {
    setBtn('btnScanPage', true, '<div class="cta-inner-border"></div><span>Скан...</span>');
    $('migrator-stats-area').classList.add('hidden');
    $('migrator-results-divider').classList.add('hidden');
    $('panelResult').classList.add('hidden');
    state.scanTotal = 0;
    post('SCAN', { scope: 'page' });
  });
}

// ── Migrate ───────────────────────────────────────────────────────────────────

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

// Removed ClearAll and Reset buttons as they are no longer in the UI

// ── Copy not-found ────────────────────────────────────────────────────────────

export function initCopyButton() {
  $('btnCopyNotFound').addEventListener('click', () => {
    if (!state.currentNotFound.length) return;
    const text = state.currentNotFound.join('\n');

    const btn = $('btnCopyNotFound');
    const orig = btn.innerHTML;
    const markCopied = () => {
      btn.innerHTML = '✓ Скопировано';
      btn.style.color = 'var(--ok)';
      setTimeout(() => { btn.innerHTML = orig; btn.style.color = ''; }, 2000);
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

// ── Detach ────────────────────────────────────────────────────────────────────

export function initDetachButton() {
  $('btnDetach').addEventListener('click', () => {
    if (!state.currentNotFound.length) return;
    state.detachTarget = '';
    setBtn('btnDetach', true, 'Отвязка…');
    post('DETACH_NOT_FOUND', { names: state.currentNotFound });
  });
}

// ── Inbound messages ──────────────────────────────────────────────────────────

export function handleMigratorMessage(msg) {
    if (!msg) return;
    switch (msg.type) {
      case 'SCAN_START': {
        state.scanTotal = msg.total;
        const el = $('scanProgress');
        if (el) el.textContent = `Найдено ${msg.total.toLocaleString('ru')} элементов, сканирование…`;
        break;
      }
      case 'SCAN_PROGRESS': {
        const el = $('scanProgress');
        if (el) {
          const pct = msg.total ? Math.round(msg.nodeCount / msg.total * 100) : 0;
          const vars = msg.varCount ? ` · переменных: ${msg.varCount}` : '';
          const time = msg.elapsed ? ` · ${msg.elapsed}` : '';
          el.textContent = `${msg.nodeCount.toLocaleString('ru')} / ${msg.total.toLocaleString('ru')} (${pct}%)${vars}${time}`;
        }
        break;
      }
      case 'LIBRARIES_LOADED': onLibraries(msg.collections);  break;
      case 'SCAN_COMPLETE': {
        if (msg.elapsed) {
          $('migrator-time-text').textContent = `Проверено ${msg.result.nodeCount} слоев за ${msg.elapsed}`;
        }
        onScan(msg.result);
        break;
      }
      case 'MIGRATE_START': {
        toast(`Начинаем замену ${msg.total} переменных...`);
        break;
      }
      case 'MIGRATE_PROGRESS': {
        // toast or skip, since we don't have progress bar anymore
        break;
      }
      case 'MIGRATE_COMPLETE': onMigrate(msg);                 break;
      case 'DETACH_COMPLETE':  onDetach(msg.result);           break;
      case 'ERROR':
        toast(msg.message);
        setBtn('btnScanSelection', false);
        setBtn('btnScanPage', false);
        setBtn('btnMigrate', false);
        setBtn('btnCheckMigrate', false);
        setBtn('btnDetach',  false);
        break;
    }
}
