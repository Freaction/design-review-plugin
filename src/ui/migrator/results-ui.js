import { state } from './state.js';
import { $, setBtn, msgList, toastOk, x } from './helpers.js';

let lastScanResult = null;
let currentTab = 'allvars'; 

export function initTabs() {
  $('tab-notfound')?.addEventListener('click', () => {
    currentTab = 'notfound';
    updateTabs();
    renderVarList();
  });
  $('tab-allvars')?.addEventListener('click', () => {
    currentTab = 'allvars';
    updateTabs();
    renderVarList();
  });
}

function updateTabs() {
  if (currentTab === 'notfound') {
    $('tab-notfound').classList.add('active');
    $('tab-allvars').classList.remove('active');
    $('notFoundActions').classList.remove('hidden');
  } else {
    $('tab-allvars').classList.add('active');
    $('tab-notfound').classList.remove('active');
    $('notFoundActions').classList.add('hidden');
  }
}

export function onScan(result) {
  setBtn('btnScanSelection', false);
  setBtn('btnScanPage', false);
  
  lastScanResult = result;
  
  $('migrator-stats-area').classList.remove('hidden');
  $('migrator-results-divider').classList.remove('hidden');
  $('panelResult').classList.remove('hidden');
  
  $('migrator-nodes-count').textContent = result.nodeCount + ' нод';
  $('migrator-vars-count').textContent = result.variables.length + ' переменных';
  
  $('migrator-notfound-count').textContent = '0 не найдено';
  $('tab-notfound-count').textContent = '0';
  $('tab-allvars-count').textContent = result.variables.length;
  
  currentTab = 'allvars';
  state.currentNotFound = [];
  updateTabs();
  renderVarList();
}

function renderVarList() {
  const list = $('varList');
  list.innerHTML = '';
  
  if (currentTab === 'notfound') {
    if (!state.currentNotFound.length) {
      list.innerHTML = '<div style="font-size:12px;color:rgba(0,0,0,0.4);text-align:center;padding:12px;">Нет проблемных токенов</div>';
      return;
    }
    for (const name of state.currentNotFound) {
      const d = document.createElement('div');
      d.className = 'var-item-new';
      d.innerHTML = `
        <div style="display:inline-flex; align-items:flex-start; gap:4px;">
          <div style="width:16px; height:16px; display:flex; align-items:center; justify-content:center; flex-shrink:0;">
             <div style="width:6px; height:6px; background:#F59E0B; border-radius:1px;"></div>
          </div>
          <div style="color:black; font-size:12px; font-weight:500; line-height:16px; word-wrap:break-word;">${x(name)}</div>
        </div>
      `;
      list.appendChild(d);
    }
  } else {
    if (!lastScanResult || !lastScanResult.variables.length) {
      list.innerHTML = '<div style="font-size:12px;color:rgba(0,0,0,0.4);text-align:center;padding:12px;">Переменные не найдены</div>';
      return;
    }
    for (const v of lastScanResult.variables) {
      const isNotFound = state.currentNotFound.includes(v.variableName);
      const color = isNotFound ? '#F59E0B' : '#0ADB29';
      
      const d = document.createElement('div');
      d.className = 'var-item-new';
      d.innerHTML = `
        <div style="display:inline-flex; align-items:flex-start; gap:4px;">
          <div style="width:16px; height:16px; display:flex; align-items:center; justify-content:center; flex-shrink:0;">
             <div style="width:6px; height:6px; background:${color}; border-radius:1px;"></div>
          </div>
          <div style="color:black; font-size:12px; font-weight:500; line-height:16px; word-wrap:break-word;">
            ${x(v.variableName)} <span style="color:rgba(0,0,0,0.4);font-weight:400;margin-left:4px;">${v.locationCount}х</span>
          </div>
        </div>
      `;
      list.appendChild(d);
    }
  }
}

export function onMigrate(msg) {
  const result = msg.result;
  setBtn('btnMigrate', false);
  setBtn('btnCheckMigrate', false);
  
  $('migrator-results-divider').classList.remove('hidden');
  $('panelResult').classList.remove('hidden');

  state.currentNotFound = result.notFound || [];
  
  $('migrator-notfound-count').textContent = state.currentNotFound.length + ' не найдено';
  $('tab-notfound-count').textContent = state.currentNotFound.length;
  
  currentTab = 'notfound';
  updateTabs();
  renderVarList();
  
  if (result.errors.length) {
    $('errorMsgs').classList.remove('hidden');
    msgList('errorMsgs', result.errors, 'msg-r', '✕ ');
  } else {
    $('errorMsgs').classList.add('hidden');
  }
  
  const actionText = msg.dryRun ? 'готово к замене' : 'заменено';
  toastOk(`${result.replaced} ${actionText}, ${state.currentNotFound.length} не найдено.`);
}

export function onDetach(result) {
  setBtn('btnDetach', false);
  if (result.errors.length) {
    $('errorMsgs').classList.remove('hidden');
    msgList('errorMsgs', result.errors, 'msg-r', '✕ ');
  }
  
  state.currentNotFound = [];
  $('migrator-notfound-count').textContent = '0 не найдено';
  $('tab-notfound-count').textContent = '0';
  renderVarList();
  
  if (!result.errors.length) {
    toastOk(`Отвязано ${result.detached} стилей/переменных.`);
  }
}

export function renderNotFound() {} // Kept to avoid undefined reference from old handlers.js if any
