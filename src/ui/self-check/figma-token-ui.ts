export function applyTokenStatus(msg) {
  const status = document.getElementById('figma-token-status');
  const input = document.getElementById('figma-token-input');
  if (!status) return;
  if (msg?.hasToken) {
    status.textContent = `Сохранён ${msg.hint || ''}`.trim();
    status.className = 'status-text status-ok';
    if (input) input.placeholder = 'Токен сохранён — вставь новый, чтобы заменить';
  } else {
    status.textContent = 'Не сохранён — без токена группы: эталон / не в эталоне';
    status.className = 'status-text status-warn';
    if (input) input.placeholder = 'figd_…';
  }
}

export function initFigmaTokenUi() {
  document.getElementById('save-figma-token')?.addEventListener('click', () => {
    const input = document.getElementById('figma-token-input');
    const token = input?.value?.trim() || '';
    parent.postMessage({ pluginMessage: { type: 'save-figma-token', token } }, '*');
    if (input) input.value = '';
  });

  document.getElementById('clear-figma-token')?.addEventListener('click', () => {
    parent.postMessage({ pluginMessage: { type: 'save-figma-token', token: '' } }, '*');
    const input = document.getElementById('figma-token-input');
    if (input) input.value = '';
  });

  parent.postMessage({ pluginMessage: { type: 'get-figma-token' } }, '*');
}
