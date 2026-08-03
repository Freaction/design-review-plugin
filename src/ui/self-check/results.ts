import { groupIssues } from '../shared/group-issues.js';
import { focusNodes } from '../shared/focus-nodes.js';
import { setScanStatsComplete } from '../shared/scan-stats.js';

export {
  setScanStart,
  setScanLoadingPages,
  setScanProgress,
} from '../shared/scan-stats.js';

const SEVERITY_ORDER: Record<string, number> = { error: 0, warning: 1, info: 2 };

let latestRawResults: any = null;
let currentSubTab = 'components';

const DOT_SVG = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 8.00004C10 8.92052 9.25383 9.66671 8.33335 9.66671C7.41288 9.66671 6.66669 8.92052 6.66669 8.00004C6.66669 7.07957 7.41288 6.33337 8.33335 6.33337C9.25383 6.33337 10 7.07957 10 8.00004Z" fill="currentColor" stroke="currentColor" stroke-width="2"/></svg>`;

export function initSelfCheckResults() {
  document.querySelectorAll('#page-main .sub-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('#page-main .sub-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('#page-main .results-list').forEach(c => ((c as HTMLElement).style.display = 'none'));
      tab.classList.add('active');
      currentSubTab = (tab as HTMLElement).dataset.tab!;
      updateEmptyState();
    });
  });

  document.getElementById('group-issues-switch')!.addEventListener('change', () => {
    if (latestRawResults) renderResults(latestRawResults);
  });

  (window as any).focusIssueNodes = (idsCsv: string) => {
    focusNodes(String(idsCsv || '').split(',').filter(Boolean));
  };
}

export function onScanResults(resultsData: any) {
  latestRawResults = resultsData;
  renderResults(latestRawResults);
}

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

function renderIssueItem(item: any): string {
  let dotClass = 'dot-info';
  if (item.severity === 'error') dotClass = 'dot-error';
  else if (item.severity === 'warning') dotClass = 'dot-warning';

  const ids = item.nodeIds?.length ? item.nodeIds : item.nodeId ? [item.nodeId] : [];
  const badgeHtml = item.count > 1 ? ` <span style="color: var(--color-primary)">(${item.count})</span>` : '';
  const breadcrumbHtml = item.breadcrumb
    ? `<div class="issue-detail">Родитель: ${item.breadcrumb}</div>`
    : '';

  return `
    <div class="issue-card" onclick="focusIssueNodes('${ids.join(',')}')">
      <div class="issue-header">
        <div style="width: 16px; height: 16px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; padding-top: 2px;">
          <div class="dot-icon ${dotClass}">${DOT_SVG}</div>
        </div>
        <div class="issue-title">${item.errorType || 'Ошибка'}${badgeHtml}</div>
      </div>
      <div class="issue-detail">Имя: ${item.name}</div>
      ${breadcrumbHtml}
    </div>
  `;
}

function countBySeverity(data: any[]) {
  const counts = { error: 0, warning: 0, info: 0 };
  for (const item of data) {
    const sev = item.severity as keyof typeof counts;
    if (sev in counts) counts[sev]++;
  }
  return counts;
}

function renderResults(resultsData: any) {
  const isGrouped = (document.getElementById('group-issues-switch') as HTMLInputElement).checked;
  const keyFn = (item: any) => `${item.name}-${item.errorType}`;
  const processedResults = {
    components: isGrouped ? groupIssues(resultsData.results.components, keyFn) : resultsData.results.components,
    variables: isGrouped ? groupIssues(resultsData.results.variables, keyFn) : resultsData.results.variables,
    gradients: isGrouped ? groupIssues(resultsData.results.gradients, keyFn) : resultsData.results.gradients,
  };

  const allIssues = [
    ...(processedResults.components || []),
    ...(processedResults.variables || []),
    ...(processedResults.gradients || []),
  ];
  setScanStatsComplete(resultsData.scannedCount, countBySeverity(allIssues));

  document.getElementById('count-components')!.textContent = String(processedResults.components?.length || 0);
  document.getElementById('count-variables')!.textContent = String(processedResults.variables?.length || 0);
  document.getElementById('count-gradients')!.textContent = String(processedResults.gradients?.length || 0);

  (['components', 'variables', 'gradients'] as const).forEach(tabName => {
    const container = document.getElementById(`results-${tabName}`)!;
    const data = (processedResults[tabName] || [])
      .sort((a: any, b: any) => (SEVERITY_ORDER[a.severity] ?? 2) - (SEVERITY_ORDER[b.severity] ?? 2));
    container.innerHTML = data.length ? data.map(renderIssueItem).join('') : '';
  });

  updateEmptyState();
}
