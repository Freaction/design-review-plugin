import { colState } from './state.js';
import { $, post, x, plural } from './helpers.js';

const expandedLibs = new Set();

export function onLibraries(collections) {
  $('libList').parentElement.classList.remove('hidden');
  colState.clear();

  if (!collections.length) {
    $('libList').innerHTML =
      '<div style="padding:12px;font-size:12px;color:rgba(0,0,0,0.4)">Нет библиотек. Включите их в Assets -> Libraries.</div>';
    return;
  }

  for (const c of collections) {
    colState.set(c.key, { libName: c.libraryName, colName: c.name, checked: false });
  }
  renderCheckboxes();
  updateMigrateBtn();
}

export function renderCheckboxes() {
  const list = $('libList');
  list.innerHTML = '';

  const groups = new Map();
  for (const [key, v] of colState) {
    if (!groups.has(v.libName)) groups.set(v.libName, []);
    groups.get(v.libName).push({ key, ...v });
  }

  for (const [libName, cols] of groups) {
    const checkedCount = cols.filter(c => c.checked).length;
    const allChecked   = checkedCount === cols.length;
    const partial      = checkedCount > 0 && !allChecked;
    const isExpanded   = expandedLibs.has(libName);

    const header = document.createElement('div');
    header.className = 'lib-tree-header';
    
    const rotation = isExpanded ? '0deg' : '-90deg';
    
    header.innerHTML = `
      <div class="lib-chevron" style="width:16px;height:16px;display:flex;align-items:center;justify-content:center;">
        <svg width="8" height="4" viewBox="0 0 8 4" fill="none" stroke="rgba(0,0,0,0.4)" stroke-width="1.2" style="transform: rotate(${rotation}); transition: transform 0.2s;"><path d="M1 1l3 2 3-2" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </div>
      <div class="lib-check ${allChecked ? 'checked' : partial ? 'partial' : ''}"></div>
      <div style="font-size: 12px; line-height: 16px; color: rgba(0,0,0,0.8);">${x(libName)}</div>
    `;
    
    header.querySelector('.lib-chevron').addEventListener('click', (e) => {
      e.stopPropagation();
      if (isExpanded) expandedLibs.delete(libName);
      else expandedLibs.add(libName);
      renderCheckboxes();
    });
    
    header.addEventListener('click', () => toggleLib(libName, !allChecked));
    list.appendChild(header);

    if (isExpanded) {
      for (const col of cols) {
        const row = document.createElement('div');
        row.className = 'lib-tree-item';
        row.dataset.key = col.key;
        row.innerHTML = `
          <div class="lib-check ${col.checked ? 'checked' : ''}"></div>
          <div style="font-size: 12px; color: rgba(0,0,0,0.8);">${x(col.colName)}</div>
        `;
        row.addEventListener('click', () => toggleCol(col.key));
        list.appendChild(row);
      }
    }
  }
}

export function toggleLib(libName, shouldCheck) {
  for (const [, v] of colState) {
    if (v.libName === libName) v.checked = shouldCheck;
  }
  renderCheckboxes();
  updateMigrateBtn();
}

export function toggleCol(key) {
  const entry = colState.get(key);
  if (entry) entry.checked = !entry.checked;
  renderCheckboxes();
  updateMigrateBtn();
}

export function updateMigrateBtn() {
  const disabled = ![...colState.values()].some(v => v.checked);
  if($('btnMigrate')) $('btnMigrate').disabled = disabled;
  const btnCheck = $('btnCheckMigrate');
  if (btnCheck) btnCheck.disabled = disabled;
}

export function updateSelBar() {}
