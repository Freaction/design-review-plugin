// ── DOM shortcut ──────────────────────────────────────────────────────────────

export const $ = id => document.getElementById(id);

// ── IPC ───────────────────────────────────────────────────────────────────────

export function post(type, extra = {}) {
  parent.postMessage({ pluginMessage: { type, ...extra } }, '*');
}

// ── Button loading state ──────────────────────────────────────────────────────

export function setBtn(id, loading, label) {
  const btn = $(id);
  if (!btn) return;
  if (loading) {
    btn._orig = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = `<div class="spin"></div>${label || ''}`;
  } else {
    if (btn._orig) btn.innerHTML = btn._orig;
    btn.disabled = false;
  }
}

// ── Chips ─────────────────────────────────────────────────────────────────────

export function chip(text, color) {
  return `<span class="chip chip-${color}">${x(text)}</span>`;
}

// ── Message list ──────────────────────────────────────────────────────────────

export function msgList(id, items, cls, prefix) {
  const el = $(id);
  el.innerHTML = '';
  if (!items.length) { el.classList.add('hidden'); return; }
  el.classList.remove('hidden');
  for (const item of items) {
    const d = document.createElement('div');
    d.className = `msg ${cls}`;
    d.textContent = prefix + item;
    el.appendChild(d);
  }
}

// ── Toasts ────────────────────────────────────────────────────────────────────

export function toast(msg) {
  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = '✕ ' + msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 4000);
}

export function toastOk(msg) {
  const t = document.createElement('div');
  t.className = 'toast';
  t.style.cssText = 'background:#052e1c;border-color:#064e30;color:var(--ok)';
  t.textContent = '✓ ' + msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 3500);
}

// ── String escaping ───────────────────────────────────────────────────────────

export function x(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// ── Russian plural ────────────────────────────────────────────────────────────

export function plural(n, one, few, many) {
  const mod10 = n % 10, mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if ([2, 3, 4].includes(mod10) && ![12, 13, 14].includes(mod100)) return few;
  return many;
}
