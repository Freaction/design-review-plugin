import { x } from './helpers.js';
import { post } from './helpers.js';
import { focusNodes } from '../shared/focus-nodes.js';
import { state } from './state.js';

const DOT_SVG = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 8.00004C10 8.92052 9.25383 9.66671 8.33335 9.66671C7.41288 9.66671 6.66669 8.92052 6.66669 8.00004C6.66669 7.07957 7.41288 6.33337 8.33335 6.33337C9.25383 6.33337 10 7.07957 10 8.00004Z" fill="currentColor" stroke="currentColor" stroke-width="2"/></svg>`;
const DETACH_SVG = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4.98075 6.85535L3.49178 8.34432C2.93569 8.90041 2.6159 9.65705 2.62175 10.4523C2.62759 11.2475 2.94038 12.0087 3.52286 12.5732C4.08731 13.1557 4.84873 13.4685 5.64381 13.4743C6.45703 13.4803 7.19576 13.1785 7.75188 12.6224L9.24085 11.1335M11.1427 9.26796L12.6317 7.77899C13.1878 7.2229 13.5076 6.46626 13.5017 5.67105C13.4959 4.87584 13.1831 4.11459 12.6006 3.5501C12.0363 2.98577 11.275 2.67297 10.4798 2.66712C9.68459 2.66128 8.92785 2.96291 8.37173 3.51902L6.88276 5.00799M5.80381 10.2798L10.2707 5.81286M3.55752 3.47798L2.81998 2.74045M6.11852 2.17882L6.23918 0.963135M1.1479 6.05419L2.40833 5.92909M12.6273 12.3371L13.3648 13.0746M10.0663 13.6362L9.94561 14.8519M15.0369 9.76085L13.7765 9.88595" stroke="currentColor" stroke-opacity="1" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

export function appendVarRow(list, { color, title, meta, nodeIds, detachName, detachCount }) {
  const d = document.createElement('div');
  d.className = 'var-item-new';
  d.onclick = () => focusNodes(nodeIds);
  const detachHtml = detachName
    ? `<div class="var-item-actions">
        <span class="var-item-count">${detachCount || 0}</span>
        <button class="var-item-detach" type="button" title="Отвязать переменную">${DETACH_SVG}</button>
      </div>`
    : '';
  d.innerHTML = `
    <div class="var-item-row">
      <div class="var-item-dot">
        <div class="dot-icon" style="color:${color}">${DOT_SVG}</div>
      </div>
      <div class="var-item-title">
        ${title}${meta ? ` <span class="var-item-meta">${meta}</span>` : ''}
      </div>
      ${detachHtml}
    </div>
  `;
  if (detachName) {
    d.querySelector('.var-item-detach').addEventListener('click', event => {
      event.stopPropagation();
      state.detachTarget = detachName;
      post('DETACH_NOT_FOUND', { names: [detachName] });
    });
  }
  list.appendChild(d);
}

export function renderGroupedOrExpanded(list, {
  color,
  collectionName,
  name,
  locations,
  locationCount,
  grouped,
  canDetach = false,
}) {
  const locs = locations || [];
  const nodeIds = locs.map(l => l.nodeId);
  const fullPath = [collectionName, name].filter(Boolean).join(' / ');
  const detachName = canDetach ? name : '';
  const detachCount = locationCount ?? locs.length;

  if (grouped || !locs.length) {
    appendVarRow(list, {
      color,
      title: x(fullPath),
      meta: locationCount != null ? `${locationCount}х` : (locs.length ? `${locs.length}х` : ''),
      nodeIds,
      detachName,
      detachCount,
    });
    return;
  }

  for (const loc of locs) {
    appendVarRow(list, {
      color,
      title: x(fullPath),
      meta: x(loc.nodeName),
      nodeIds: [loc.nodeId],
      detachName,
      detachCount,
    });
  }
}
