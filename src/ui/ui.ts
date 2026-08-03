import {
  initScanButton,
  initMigrateButton,
  initCopyButton,
  initDetachButton,
  initTabs,
  handleMigratorMessage,
} from './migrator/handlers.js';
import { initGroupSwitch } from './migrator/results-ui.js';
import {
  initSelfCheckResults,
  setScanStart,
  setScanLoadingPages,
  setScanProgress,
  onScanResults,
} from './self-check/results';
import {
  initSnapshotUi,
  applyLocalMeta,
  checkRemoteVersion,
  onRemoteSaved,
  downloadJson,
  showScanProgress,
  showScanStats,
} from './self-check/snapshot-status';
import { initLibrariesTab, handleLibrariesMessage } from './libraries/handlers.js';
import { initFigmaTokenUi, applyTokenStatus } from './self-check/figma-token-ui';

initScanButton();
initMigrateButton();
initCopyButton();
initDetachButton();
initTabs();
initGroupSwitch();
initSelfCheckResults();
initSnapshotUi();
initLibrariesTab();
initFigmaTokenUi();

parent.postMessage({ pluginMessage: { type: 'GET_LIBRARIES' } }, '*');

const themeBtn = document.getElementById('toggle-theme')!;
const sunSVG = '<svg width="18" height="18" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="8" cy="8" r="2.5" stroke="currentColor" stroke-width="1.2"/><path d="M8 2V3M8 13V14M2 8H3M13 8H14M3.76 3.76L4.47 4.47M11.53 11.53L12.24 12.24M12.24 3.76L11.53 4.47M4.47 11.53L3.76 12.24" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>';
const moonSVG = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14.4 9.75977C13.7985 9.94219 13.1603 10.0403 12.4992 10.0403C8.88723 10.0403 5.95912 7.11218 5.95912 3.50018C5.95912 2.83937 6.05713 2.20145 6.23939 1.60016C3.55444 2.41441 1.6001 4.90885 1.6001 7.85975C1.6001 11.4718 4.5282 14.3999 8.1402 14.3999C11.0914 14.3999 13.586 12.4451 14.4 9.75977Z" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

let isDarkTheme = false;

function applyTheme() {
  if (isDarkTheme) {
    document.body.classList.add('dark-theme');
    themeBtn.innerHTML = sunSVG;
  } else {
    document.body.classList.remove('dark-theme');
    themeBtn.innerHTML = moonSVG;
  }
}

document.getElementById('toggle-theme')?.addEventListener('click', () => {
  isDarkTheme = !isDarkTheme;
  applyTheme();
  parent.postMessage({ pluginMessage: { type: 'save-theme', theme: isDarkTheme ? 'dark' : 'light' } }, '*');
});

document.querySelectorAll('.tab-button').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab-button').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.page').forEach(c => c.classList.remove('active'));
    tab.classList.add('active');
    const targetId = `page-${(tab as HTMLElement).dataset.page}`;
    document.getElementById(targetId)!.classList.add('active');
  });
});

let isExpanded = false;
const sizeBtn = document.getElementById('toggle-size')!;
const expandSVG = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9.76502 1.60001H14.3995M14.3995 1.60001V6.23449M14.3995 1.60001L8.9926 7.00691M6.23483 14.4H1.60034M1.60034 14.4V9.76552M1.60034 14.4L7.00724 8.99311" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const collapseSVG = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.00724 13.6275L7.00724 8.99304L2.37276 8.99304M7.00724 8.99304L1.60034 14.3999M8.99253 2.37248V7.00697L13.627 7.00697M8.99253 7.00697L14.3994 1.60007" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

sizeBtn.onclick = () => {
  isExpanded = !isExpanded;
  sizeBtn.innerHTML = isExpanded ? collapseSVG : expandSVG;
  document.getElementById('page-migrator')?.classList.toggle('expanded', isExpanded);
  document.getElementById('page-libraries')?.classList.toggle('expanded', isExpanded);
  parent.postMessage({ pluginMessage: { type: 'resize', expanded: isExpanded } }, '*');
};

document.getElementById('scan-selection')!.onclick = () => {
  parent.postMessage({ pluginMessage: { type: 'scan-selection' } }, '*');
};

document.getElementById('scan-page')!.onclick = () => {
  parent.postMessage({ pluginMessage: { type: 'scan-page' } }, '*');
};

document.getElementById('update-snapshot')!.onclick = () => {
  const btn = document.getElementById('update-snapshot') as HTMLButtonElement;
  btn.disabled = true;
  document.getElementById('update-snapshot-text')!.textContent = '⏳ Сканирование...';
  const version = new Date().toISOString().slice(0, 10).replace(/-/g, '.');
  parent.postMessage({ pluginMessage: { type: 'update-snapshot', version } }, '*');
};

window.onmessage = async (event) => {
  const pluginMessage = event.data.pluginMessage;
  if (!pluginMessage) return;

  if (pluginMessage.type === 'init-theme') {
    isDarkTheme = pluginMessage.theme === 'dark';
    applyTheme();
  }

  if (pluginMessage.type === 'figma-token-info') {
    applyTokenStatus(pluginMessage);
  }

  handleMigratorMessage(pluginMessage);
  handleLibrariesMessage(pluginMessage);

  if (pluginMessage.type === 'snapshot-progress') {
    showScanProgress(pluginMessage);
  }

  if (pluginMessage.type === 'snapshot-info') {
    if (pluginMessage.hasLocal) {
      applyLocalMeta(pluginMessage);
    } else {
      applyLocalMeta(null);
    }
    checkRemoteVersion();
  }

  if (pluginMessage.type === 'snapshot-saved') {
    const btn = document.getElementById('update-snapshot') as HTMLButtonElement;
    if (btn) {
      btn.disabled = false;
      document.getElementById('update-snapshot-text')!.textContent = 'Отсканировать UI-Kit';
    }
    applyLocalMeta(pluginMessage);
    showScanStats(pluginMessage);
    checkRemoteVersion();
  }

  if (pluginMessage.type === 'snapshot-scan-error') {
    const btn = document.getElementById('update-snapshot') as HTMLButtonElement;
    if (btn) {
      btn.disabled = false;
      document.getElementById('update-snapshot-text')!.textContent = 'Отсканировать UI-Kit';
    }
    const text1 = document.getElementById('scan-status-text1');
    const text2 = document.getElementById('scan-status-text2');
    if (text1) {
      text1.textContent = pluginMessage.message || 'Ошибка скана UI-Kit';
      text1.className = 'status-text status-error';
    }
    if (text2) text2.style.display = 'none';
  }

  if (pluginMessage.type === 'snapshot-remote-saved') {
    onRemoteSaved(pluginMessage);
  }

  if (pluginMessage.type === 'snapshot-remote-error') {
    const btn = document.getElementById('download-snapshot') as HTMLButtonElement;
    const label = document.getElementById('download-snapshot-text');
    if (btn) btn.disabled = false;
    if (label) label.textContent = 'Обновить эталон с GitHub';
    const text1 = document.getElementById('scan-status-text1');
    if (text1) {
      text1.textContent = pluginMessage.message || 'Ошибка сохранения эталона';
      text1.className = 'status-text status-error';
    }
  }

  if (pluginMessage.type === 'snapshot-export') {
    downloadJson('meta.json', pluginMessage.meta);
    downloadJson('snapshot.json', {
      version: pluginMessage.meta.version,
      u: pluginMessage.storage.u,
      f: pluginMessage.storage.f,
      pagesScanned: pluginMessage.meta.pagesScanned,
      pagesTotal: pluginMessage.meta.pagesTotal,
      c: pluginMessage.storage.c,
    });
  }

  if (pluginMessage.type === 'scan-start') {
    setScanStart();
  }

  if (pluginMessage.type === 'scan-loading-pages') {
    setScanLoadingPages();
  }

  if (pluginMessage.type === 'scan-progress') {
    setScanProgress(pluginMessage.count, pluginMessage.total, pluginMessage.label);
  }

  if (pluginMessage.type === 'scan-results') {
    onScanResults(pluginMessage);
    handleMigratorMessage({
      type: 'SCAN_COMPLETE',
      result: pluginMessage.migratorResult,
      elapsed: pluginMessage.elapsed,
    });
  }
};
