export const $ = id => document.getElementById(id);

export function post(type, extra = {}) {
  parent.postMessage({ pluginMessage: { type, ...extra } }, '*');
}

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

export function msgList(id, items, cls, prefix) {
  const el = $(id);
  el.innerHTML = '';
  if (!items.length) {
    el.classList.add('hidden');
    return;
  }
  el.classList.remove('hidden');
  for (const item of items) {
    const d = document.createElement('div');
    d.className = `msg ${cls}`;
    d.textContent = prefix + item;
    el.appendChild(d);
  }
}

export function toast(msg) {
  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = '✕ ' + msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 4000);
}

export function toastOk(msg) {
  const t = document.createElement('div');
  t.className = 'toast toast-ok';
  t.textContent = '✓ ' + msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 3500);
}

export function x(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
