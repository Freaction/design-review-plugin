import { libState } from './state.js';
import { $, x } from '../migrator/helpers.js';

function totalSelected() {
  if (!libState.result) return 0;
  let n = 0;
  for (const cat of libState.result.categories) {
    for (const c of cat.components) {
      if (libState.checked.has(`${cat.id}:${c.key}`)) n += c.count;
    }
  }
  return n;
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
    const catKeys = cat.components.map(c => `${cat.id}:${c.key}`);
    const checkedCount = catKeys.filter(k => libState.checked.has(k)).length;
    const allChecked = checkedCount === catKeys.length && catKeys.length > 0;
    const partial = checkedCount > 0 && !allChecked;
    const isExpanded = libState.expanded.has(cat.id);
    const rotation = isExpanded ? '0deg' : '-90deg';
    const catCount = cat.components.reduce((n, c) => n + c.count, 0);

    const header = document.createElement('div');
    header.className = 'lib-tree-header';
    header.innerHTML = `
      <div class="lib-chevron">
        <svg width="8" height="4" viewBox="0 0 8 4" fill="none" stroke="currentColor" stroke-width="1.2" style="transform: rotate(${rotation}); transition: transform 0.2s;"><path d="M1 1l3 2 3-2" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </div>
      <div class="lib-check ${allChecked ? 'checked' : partial ? 'partial' : ''}"></div>
      <div class="lib-tree-label">${x(cat.title)} · ${catCount}</div>
    `;
    header.querySelector('.lib-chevron').addEventListener('click', e => {
      e.stopPropagation();
      if (isExpanded) libState.expanded.delete(cat.id);
      else libState.expanded.add(cat.id);
      renderLibTree();
    });
    header.addEventListener('click', () => {
      for (const k of catKeys) {
        if (allChecked) libState.checked.delete(k);
        else libState.checked.add(k);
      }
      renderLibTree();
      window.dispatchEvent(new CustomEvent('lib-selection-changed'));
    });
    list.appendChild(header);

    if (isExpanded) {
      for (const c of cat.components) {
        const id = `${cat.id}:${c.key}`;
        const row = document.createElement('div');
        row.className = 'lib-tree-item';
        row.innerHTML = `
          <div class="lib-check ${libState.checked.has(id) ? 'checked' : ''}"></div>
          <div class="lib-tree-label">${x(c.name)} · ${c.count}</div>
        `;
        row.addEventListener('click', () => {
          if (libState.checked.has(id)) libState.checked.delete(id);
          else libState.checked.add(id);
          renderLibTree();
          window.dispatchEvent(new CustomEvent('lib-selection-changed'));
        });
        list.appendChild(row);
      }
    }
  }

  const hint = $('libUsageHint');
  if (hint) {
    hint.textContent = `Выбрано remote: ${totalSelected()} / ${libState.result.remoteCount}`;
  }
}
