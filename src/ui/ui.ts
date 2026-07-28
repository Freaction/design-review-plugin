// Theme switching
import { 
  initScanButton, 
  initMigrateButton, 
  initCopyButton, 
  initDetachButton,
  initTabs,
  handleMigratorMessage 
} from './migrator/handlers.js';

// Init Migrator UI
initScanButton();
initMigrateButton();
initCopyButton();
initDetachButton();
initTabs();

// Load target libraries for Migrator immediately
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

// Top tabs switching
document.querySelectorAll('.tab-button').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab-button').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.page').forEach(c => c.classList.remove('active'));
    
    tab.classList.add('active');
    const targetId = `page-${(tab as HTMLElement).dataset.page}`;
    document.getElementById(targetId)!.classList.add('active');
  });
});

document.getElementById('go-to-scan-tab')?.addEventListener('click', () => {
    document.querySelector('.tab-button[data-page="scan"]')?.dispatchEvent(new MouseEvent('click'));
});

// Size expanding
let isExpanded = false;
const sizeBtn = document.getElementById('toggle-size')!;
const expandSVG = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9.76502 1.60001H14.3995M14.3995 1.60001V6.23449M14.3995 1.60001L8.9926 7.00691M6.23483 14.4H1.60034M1.60034 14.4V9.76552M1.60034 14.4L7.00724 8.99311" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const collapseSVG = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.00724 13.6275L7.00724 8.99304L2.37276 8.99304M7.00724 8.99304L1.60034 14.3999M8.99253 2.37248V7.00697L13.627 7.00697M8.99253 7.00697L14.3994 1.60007" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

sizeBtn.onclick = () => {
  isExpanded = !isExpanded;
  sizeBtn.innerHTML = isExpanded ? collapseSVG : expandSVG;
  parent.postMessage({ pluginMessage: { type: 'resize', expanded: isExpanded } }, '*');
};

// Sub tabs switching
let currentSubTab = 'components';
document.querySelectorAll('.sub-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.sub-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.results-list').forEach(c => (c as HTMLElement).style.display = 'none');
    
    tab.classList.add('active');
    currentSubTab = (tab as HTMLElement).dataset.tab!;
    updateEmptyState();
  });
});

function updateEmptyState() {
    const list = document.getElementById(`results-${currentSubTab}`);
    const emptyState = document.getElementById('empty-state');
    if (list && list.children.length === 0) {
        list.style.display = 'none';
        emptyState!.style.display = 'flex';
    } else if (list) {
        list.style.display = 'flex';
        emptyState!.style.display = 'none';
    }
}

document.getElementById('scan-selection')!.onclick = () => {
  parent.postMessage({ pluginMessage: { type: 'scan-selection' } }, '*');
};

document.getElementById('scan-page')!.onclick = () => {
  parent.postMessage({ pluginMessage: { type: 'scan-page' } }, '*');
};

document.getElementById('group-issues-switch')!.addEventListener('change', () => {
  if (latestRawResults) {
    renderResults(latestRawResults);
  }
});

document.getElementById('update-snapshot')!.onclick = () => {
  const btn = document.getElementById('update-snapshot') as HTMLButtonElement;
  btn.disabled = true;
  document.getElementById('update-snapshot-text')!.textContent = '⏳ Обновление...';
  parent.postMessage({ pluginMessage: { type: 'update-snapshot' } }, '*');
};

const SEVERITY_ORDER: Record<string, number> = { error: 0, warning: 1, info: 2 };

let latestRawResults: any = null;
let scanTotalNodes = 0;
let scanStartTime = 0;

function groupResultsArray(resultsArray: any[]) {
  const grouped = new Map<string, any>();
  for (const item of resultsArray) {
    const key = `${item.name}-${item.errorType}`;
    if (grouped.has(key)) {
      const existing = grouped.get(key);
      existing.count += 1;
    } else {
      grouped.set(key, { ...item });
    }
  }
  return Array.from(grouped.values());
}

function renderIssueItem(item: any): string {
  let dotClass = 'dot-info';
  if (item.severity === 'error') dotClass = 'dot-error';
  else if (item.severity === 'warning') dotClass = 'dot-warning';

  const badgeHtml = item.count > 1 ? ` <span style="color: var(--color-primary)">(${item.count})</span>` : '';
  const breadcrumbHtml = item.breadcrumb ? `
  <div class="issue-detail">Родитель: ${item.breadcrumb}</div>` : '';
  
  return `
    <div class="issue-card" onclick="focusNode('${item.nodeId}')">
      <div class="issue-header">
        <div style="width: 16px; height: 16px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; padding-top: 2px;">
          <div class="dot-icon ${dotClass}"><svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 8.00004C10 8.92052 9.25383 9.66671 8.33335 9.66671C7.41288 9.66671 6.66669 8.92052 6.66669 8.00004C6.66669 7.07957 7.41288 6.33337 8.33335 6.33337C9.25383 6.33337 10 7.07957 10 8.00004Z" fill="currentColor" stroke="currentColor" stroke-width="2"/></svg></div>
        </div>
        <div class="issue-title">${item.errorType || 'Ошибка'}${badgeHtml}</div>
      </div>
      <div class="issue-detail">Имя: ${item.name}</div>
      ${breadcrumbHtml}
    </div>
  `;
}

function countBySeverity(data: any[]): { error: number; warning: number; info: number } {
  const counts = { error: 0, warning: 0, info: 0 };
  for (const item of data) {
    const sev = item.severity as keyof typeof counts;
    if (sev in counts) counts[sev]++;
  }
  return counts;
}

function renderResults(resultsData: any) {
  const isGrouped = (document.getElementById('group-issues-switch') as HTMLInputElement).checked;
  
  const processedResults = {
    components: isGrouped ? groupResultsArray(resultsData.results.components) : resultsData.results.components,
    variables: isGrouped ? groupResultsArray(resultsData.results.variables) : resultsData.results.variables,
    gradients: isGrouped ? groupResultsArray(resultsData.results.gradients) : resultsData.results.gradients
  };

  const statsEl = document.getElementById('stats');
  const allIssues = [
    ...(processedResults.components || []),
    ...(processedResults.variables || []),
    ...(processedResults.gradients || [])
  ];
  const totals = countBySeverity(allIssues);

  if (statsEl) {
    statsEl.style.display = 'flex';
    const elapsedMs = Date.now() - scanStartTime;
    const seconds = Math.floor(elapsedMs / 1000);
    document.getElementById('stats-time-text')!.textContent = `Проверено ${resultsData.scannedCount} слоев за ${seconds}с`;
    document.getElementById('stats-error')!.textContent = `${totals.error} блокер`;
    document.getElementById('stats-warning')!.textContent = `${totals.warning} предупр.`;
    document.getElementById('stats-info')!.textContent = `${totals.info} инфо`;
    
    const iconEl = document.getElementById('stats-icon');
    if (iconEl) {
        iconEl.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.2 5.59998L6.42698 10.4L4.79999 8.76379" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
        iconEl.style.display = 'flex';
    }
  }

  // Update tabs counts
  document.getElementById('count-components')!.textContent = String(processedResults.components?.length || 0);
  document.getElementById('count-variables')!.textContent = String(processedResults.variables?.length || 0);
  document.getElementById('count-gradients')!.textContent = String(processedResults.gradients?.length || 0);

  ['components', 'variables', 'gradients'].forEach(tabName => {
    const container = document.getElementById(`results-${tabName}`)!;
    const data = (processedResults[tabName as keyof typeof processedResults] || [])
      .sort((a: any, b: any) => (SEVERITY_ORDER[a.severity] ?? 2) - (SEVERITY_ORDER[b.severity] ?? 2));

    if (data.length === 0) {
      container.innerHTML = '';
    } else {
      container.innerHTML = data.map(renderIssueItem).join('');
    }
  });

  updateEmptyState();
}

window.onmessage = async (event) => {
  const pluginMessage = event.data.pluginMessage;
  
  if (pluginMessage.type === 'init-theme') {
      isDarkTheme = pluginMessage.theme === 'dark';
      applyTheme();
  }

  // Pass messages to Migrator directly
  handleMigratorMessage(pluginMessage);

  if (pluginMessage.type === 'snapshot-progress') {
    const text1 = document.getElementById('scan-status-text1');
    const text2 = document.getElementById('scan-status-text2');
    if (text1) {
        text1.textContent = `⏳ Обновление эталона... стр. «${pluginMessage.page}», обработано: ${pluginMessage.processed}`;
        text1.style.color = 'var(--color-black-60)';
    }
    if (text2) { text2.style.display = 'none'; }
  }

  if (pluginMessage.type === 'snapshot-saved' || pluginMessage.type === 'snapshot-info') {
    const text1 = document.getElementById('scan-status-text1');
    const text2 = document.getElementById('scan-status-text2');
    
    const btn = document.getElementById('update-snapshot') as HTMLButtonElement;
    if (btn) { btn.disabled = false; document.getElementById('update-snapshot-text')!.textContent = 'Обнови эталон ДС'; }
    
    if (text1) {
      const date = new Date(pluginMessage.updatedAt).toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' });
      text1.textContent = `✅ Эталон: ${pluginMessage.count} компонентов из "${pluginMessage.fileKey}" (${date})`;
      text1.style.color = 'var(--color-black-80)';
    }
    if (text2) { text2.style.display = 'none'; }
    
    const statusText1 = document.querySelector('#snapshot-status .status-text:nth-child(1)');
    const statusText2 = document.querySelector('#snapshot-status .status-text:nth-child(2)');
    if (statusText1) {
        statusText1.textContent = `✅ Эталон: загружен. `;
        (statusText1 as HTMLElement).style.color = '#4caf50';
    }
    if (statusText2) {
        (statusText2 as HTMLElement).style.display = 'none';
    }
  }

  if (pluginMessage.type === 'scan-start') {
    scanTotalNodes = pluginMessage.total;
    scanStartTime = Date.now();
    const statsEl = document.getElementById('stats');
    if (statsEl) {
      statsEl.style.display = 'flex';
      document.getElementById('stats-time-text')!.innerText = `⏳ Подготовка... (Всего узлов: ${scanTotalNodes})`;
      
      const iconEl = document.getElementById('stats-icon');
      if (iconEl) iconEl.style.display = 'none';
    }
  }

  if (pluginMessage.type === 'scan-progress') {
    const statsEl = document.getElementById('stats');
    if (statsEl) {
      statsEl.style.display = 'flex';
      const elapsedMs = Date.now() - scanStartTime;
      const seconds = Math.floor(elapsedMs / 1000);
      const minutes = Math.floor(seconds / 60);
      const displaySec = seconds % 60;
      const timeStr = minutes > 0 ? `${minutes}м ${displaySec}с` : `${displaySec}с`;
      
      let percent = 0;
      if (scanTotalNodes > 0) {
         percent = Math.floor((pluginMessage.count / scanTotalNodes) * 100);
         if (percent > 100) percent = 100;
      }
      document.getElementById('stats-time-text')!.innerText = `⏳ Сканирование... ${pluginMessage.count} из ${scanTotalNodes} (${percent}%), прошло ${timeStr}`;
      
      const iconEl = document.getElementById('stats-icon');
      if (iconEl) iconEl.style.display = 'none';
    }
  }

  if (pluginMessage.type === 'scan-results') {
    latestRawResults = pluginMessage;
    renderResults(latestRawResults);
    
    // Also trigger migrator update
    handleMigratorMessage({ 
        type: 'SCAN_COMPLETE', 
        result: pluginMessage.migratorResult,
        elapsed: pluginMessage.elapsed
    });
  }
};


(window as any).focusNode = (nodeId: string) => {
  parent.postMessage({ pluginMessage: { type: 'focus-node', nodeId } }, '*');
};
