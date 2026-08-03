import { libState } from './state.js';
import { $, x } from '../migrator/helpers.js';
import { groupIssues } from '../shared/group-issues.js';
import { focusNodes } from '../shared/focus-nodes.js';

const DOT_SVG = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 8.00004C10 8.92052 9.25383 9.66671 8.33335 9.66671C7.41288 9.66671 6.66669 8.92052 6.66669 8.00004C6.66669 7.07957 7.41288 6.33337 8.33335 6.33337C9.25383 6.33337 10 7.07957 10 8.00004Z" fill="currentColor" stroke="currentColor" stroke-width="2"/></svg>`;

const COLORS = {
  etalon: '#0ADB29',
  foreign: '#F59E0B',
  broken: '#FB3748',
};

function selectedItems() {
  if (!libState.result) return [];
  const items = [];
  for (const cat of libState.result.categories) {
    for (const c of cat.components) {
      if (!libState.checked.has(`${cat.id}:${c.key}`)) continue;
      for (const nodeId of c.nodeIds) {
        items.push({
          nodeId,
          name: c.name,
          category: cat.id,
          errorType: c.name,
        });
      }
    }
  }
  return items;
}

function appendRow(list, { color, title, meta, nodeIds, count }) {
  const d = document.createElement('div');
  d.className = 'var-item-new';
  d.onclick = () => focusNodes(nodeIds);
  const countHtml = count > 1
    ? `<div class="var-item-actions"><span class="var-item-count">${count}</span></div>`
    : '';
  d.innerHTML = `
    <div class="var-item-row">
      <div class="var-item-dot"><div class="dot-icon" style="color:${color}">${DOT_SVG}</div></div>
      <div class="var-item-title">
        ${title}${meta ? ` <span class="var-item-meta">${meta}</span>` : ''}
      </div>
      ${countHtml}
    </div>
  `;
  list.appendChild(d);
}

export function renderLibResults() {
  const list = $('libUsageResults');
  const panel = $('libUsagePanel');
  if (!list || !panel) return;

  const items = selectedItems();
  if (!libState.result) {
    panel.classList.add('hidden');
    return;
  }
  panel.classList.remove('hidden');
  list.innerHTML = '';

  if (!items.length) {
    list.innerHTML = '<div class="var-list-empty">Отметьте компоненты в списке слева</div>';
    return;
  }

  const grouped = libState.grouped
    ? groupIssues(items, item => `${item.category}:${item.name}`)
    : items;

  for (const item of grouped) {
    const nodeIds = item.nodeIds?.length ? item.nodeIds : item.nodeId ? [item.nodeId] : [];
    appendRow(list, {
      color: COLORS[item.category] || COLORS.foreign,
      title: x(item.name),
      meta: item.count > 1 ? `${item.count}х` : '',
      nodeIds,
      count: item.count || 1,
    });
  }
}

export function initLibResults() {
  $('group-lib-switch')?.addEventListener('change', e => {
    libState.grouped = !!e.target.checked;
    renderLibResults();
  });
  window.addEventListener('lib-selection-changed', renderLibResults);
}
