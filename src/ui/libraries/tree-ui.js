import { libState } from './state.js';
import { $, x } from '../migrator/helpers.js';
import { focusNodes } from '../shared/focus-nodes.js';

function catCount(cat) {
  return cat.components.reduce((n, c) => n + c.count, 0);
}

export function renderLibTree() {
  const list = $('libUsageList');
  if (!list || !libState.result) return;
  list.innerHTML = '';

  if (!libState.result.categories.length) {
    list.innerHTML = '<div class="lib-empty">Remote-инстансы не найдены</div>';
    return;
  }

  for (const cat of libState.result.categories) {
    const isExpanded = libState.expanded.has(cat.id);
    const rotation = isExpanded ? '0deg' : '-90deg';
    const total = catCount(cat);

    const header = document.createElement('div');
    header.className = 'lib-tree-header';
    header.innerHTML = `
      <div class="lib-chevron">
        <svg width="8" height="4" viewBox="0 0 8 4" fill="none" stroke="currentColor" stroke-width="1.2" style="transform: rotate(${rotation}); transition: transform 0.15s;"><path d="M1 1l3 2 3-2" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </div>
      <div class="lib-tree-label">
        <span class="lib-tree-name">${x(cat.title)}</span>
        <span class="lib-tree-meta">${total}</span>
      </div>
    `;
    header.addEventListener('click', () => {
      if (isExpanded) libState.expanded.delete(cat.id);
      else libState.expanded.add(cat.id);
      renderLibTree();
    });
    list.appendChild(header);

    if (!isExpanded) continue;

    for (const c of cat.components) {
      const row = document.createElement('div');
      row.className = 'lib-tree-item';
      row.title = 'Клик — выделить на холсте';
      row.innerHTML = `
        <div class="lib-tree-label">
          <span class="lib-tree-name">${x(c.name)}</span>
          <span class="lib-tree-meta">${c.count}</span>
        </div>
      `;
      row.addEventListener('click', () => focusNodes(c.nodeIds));
      list.appendChild(row);
    }
  }

  const hint = $('libUsageHint');
  if (hint) {
    const libs = libState.result.categories.length;
    const comps = libState.result.categories.reduce((n, c) => n + c.components.length, 0);
    hint.textContent = `${libs} библиотек · ${comps} компонентов · клик по компоненту — фокус`;
  }
}
