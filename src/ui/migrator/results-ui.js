import { state } from './state.js';
import { $, setBtn, msgList, toastOk } from './helpers.js';
import { renderGroupedOrExpanded } from './var-rows.js';

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

export function initGroupSwitch() {
  $('group-migrator-switch')?.addEventListener('change', () => {
    renderVarList();
  });
}

function isGrouped() {
  return !!$('group-migrator-switch')?.checked;
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

  $('migrator-results-divider').classList.remove('hidden');
  $('panelResult').classList.remove('hidden');

  $('tab-notfound-count').textContent = '0';
  $('tab-allvars-count').textContent = result.variables.length;

  currentTab = 'allvars';
  state.currentNotFound = [];
  updateTabs();
  renderVarList();
}

function findVar(name) {
  return lastScanResult?.variables?.find(v => v.variableName === name) || null;
}

function updateTabCounts(grouped) {
  if (!lastScanResult) return;
  if (grouped) {
    $('tab-allvars-count').textContent = lastScanResult.variables.length;
    $('tab-notfound-count').textContent = state.currentNotFound.length;
    return;
  }
  $('tab-allvars-count').textContent = lastScanResult.variables.reduce(
    (n, v) => n + (v.locations?.length || 1),
    0
  );
  $('tab-notfound-count').textContent = state.currentNotFound.reduce((n, name) => {
    const v = findVar(name);
    return n + (v?.locations?.length || 1);
  }, 0);
}

function renderVarList() {
  const list = $('varList');
  list.innerHTML = '';
  const grouped = isGrouped();
  updateTabCounts(grouped);

  if (currentTab === 'notfound') {
    if (!state.currentNotFound.length) {
      list.innerHTML = '<div class="var-list-empty">Нет проблемных токенов</div>';
      return;
    }
    for (const name of state.currentNotFound) {
      const v = findVar(name);
      renderGroupedOrExpanded(list, {
        color: '#F59E0B',
        collectionName: v?.collectionName,
        name,
        locations: v?.locations || [],
        grouped,
        canDetach: true,
      });
    }
    return;
  }

  if (!lastScanResult || !lastScanResult.variables.length) {
    list.innerHTML = '<div class="var-list-empty">Переменные не найдены</div>';
    return;
  }

  for (const v of lastScanResult.variables) {
    const isNotFound = state.currentNotFound.includes(v.variableName);
    renderGroupedOrExpanded(list, {
      color: isNotFound ? '#F59E0B' : '#0ADB29',
      collectionName: v.collectionName,
      name: v.variableName,
      locations: v.locations || [],
      locationCount: v.locationCount,
      grouped,
      canDetach: isNotFound,
    });
  }
}

export function onMigrate(msg) {
  const result = msg.result;
  setBtn('btnMigrate', false);
  setBtn('btnCheckMigrate', false);

  $('migrator-results-divider').classList.remove('hidden');
  $('panelResult').classList.remove('hidden');

  state.currentNotFound = result.notFound || [];

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
}

export function onDetach(result) {
  setBtn('btnDetach', false);
  if (result.errors.length) {
    $('errorMsgs').classList.remove('hidden');
    msgList('errorMsgs', result.errors, 'msg-r', '✕ ');
  }

  if (!result.errors.length && state.detachTarget) {
    state.currentNotFound = state.currentNotFound.filter(name => name !== state.detachTarget);
    state.detachTarget = '';
  } else if (!state.detachTarget) {
    state.currentNotFound = [];
  }
  $('tab-notfound-count').textContent = state.currentNotFound.length;
  renderVarList();

  if (!result.errors.length) {
    toastOk(`Отвязано ${result.detached} стилей/переменных.`);
  }
}
