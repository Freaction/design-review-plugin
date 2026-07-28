"use strict";
(() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __esm = (fn, res, err) => function __init() {
    if (err) throw err[0];
    try {
      return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
    } catch (e) {
      throw err = [e], e;
    }
  };
  var __commonJS = (cb, mod) => function __require() {
    try {
      return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
    } catch (e) {
      throw mod = 0, e;
    }
  };
  var __async = (__this, __arguments, generator) => {
    return new Promise((resolve, reject) => {
      var fulfilled = (value) => {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      };
      var rejected = (value) => {
        try {
          step(generator.throw(value));
        } catch (e) {
          reject(e);
        }
      };
      var step = (x2) => x2.done ? resolve(x2.value) : Promise.resolve(x2.value).then(fulfilled, rejected);
      step((generator = generator.apply(__this, __arguments)).next());
    });
  };

  // src/ui/migrator/state.js
  var state, colState;
  var init_state = __esm({
    "src/ui/migrator/state.js"() {
      "use strict";
      state = {
        scope: "selection",
        currentNotFound: (
          /** @type {string[]} */
          []
        ),
        scanTotal: 0
      };
      colState = /* @__PURE__ */ new Map();
    }
  });

  // src/ui/migrator/helpers.js
  function post(type, extra = {}) {
    parent.postMessage({ pluginMessage: __spreadValues({ type }, extra) }, "*");
  }
  function setBtn(id, loading, label) {
    const btn = $(id);
    if (!btn) return;
    if (loading) {
      btn._orig = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = `<div class="spin"></div>${label || ""}`;
    } else {
      if (btn._orig) btn.innerHTML = btn._orig;
      btn.disabled = false;
    }
  }
  function msgList(id, items, cls, prefix) {
    const el = $(id);
    el.innerHTML = "";
    if (!items.length) {
      el.classList.add("hidden");
      return;
    }
    el.classList.remove("hidden");
    for (const item of items) {
      const d = document.createElement("div");
      d.className = `msg ${cls}`;
      d.textContent = prefix + item;
      el.appendChild(d);
    }
  }
  function toast(msg) {
    const t = document.createElement("div");
    t.className = "toast";
    t.textContent = "\u2715 " + msg;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 4e3);
  }
  function toastOk(msg) {
    const t = document.createElement("div");
    t.className = "toast";
    t.style.cssText = "background:#052e1c;border-color:#064e30;color:var(--ok)";
    t.textContent = "\u2713 " + msg;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 3500);
  }
  function x(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  var $;
  var init_helpers = __esm({
    "src/ui/migrator/helpers.js"() {
      "use strict";
      $ = (id) => document.getElementById(id);
    }
  });

  // src/ui/migrator/library-ui.js
  function onLibraries(collections) {
    $("libList").parentElement.classList.remove("hidden");
    colState.clear();
    if (!collections.length) {
      $("libList").innerHTML = '<div style="padding:12px;font-size:12px;color:rgba(0,0,0,0.4)">\u041D\u0435\u0442 \u0431\u0438\u0431\u043B\u0438\u043E\u0442\u0435\u043A. \u0412\u043A\u043B\u044E\u0447\u0438\u0442\u0435 \u0438\u0445 \u0432 Assets -> Libraries.</div>';
      return;
    }
    for (const c of collections) {
      colState.set(c.key, { libName: c.libraryName, colName: c.name, checked: false });
    }
    renderCheckboxes();
    updateMigrateBtn();
  }
  function renderCheckboxes() {
    const list = $("libList");
    list.innerHTML = "";
    const groups = /* @__PURE__ */ new Map();
    for (const [key, v] of colState) {
      if (!groups.has(v.libName)) groups.set(v.libName, []);
      groups.get(v.libName).push(__spreadValues({ key }, v));
    }
    for (const [libName, cols] of groups) {
      const checkedCount = cols.filter((c) => c.checked).length;
      const allChecked = checkedCount === cols.length;
      const partial = checkedCount > 0 && !allChecked;
      const isExpanded = expandedLibs.has(libName);
      const header = document.createElement("div");
      header.className = "lib-tree-header";
      const rotation = isExpanded ? "0deg" : "-90deg";
      header.innerHTML = `
      <div class="lib-chevron" style="width:16px;height:16px;display:flex;align-items:center;justify-content:center;">
        <svg width="8" height="4" viewBox="0 0 8 4" fill="none" stroke="rgba(0,0,0,0.4)" stroke-width="1.2" style="transform: rotate(${rotation}); transition: transform 0.2s;"><path d="M1 1l3 2 3-2" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </div>
      <div class="lib-check ${allChecked ? "checked" : partial ? "partial" : ""}"></div>
      <div style="font-size: 12px; line-height: 16px; color: rgba(0,0,0,0.8);">${x(libName)}</div>
    `;
      header.querySelector(".lib-chevron").addEventListener("click", (e) => {
        e.stopPropagation();
        if (isExpanded) expandedLibs.delete(libName);
        else expandedLibs.add(libName);
        renderCheckboxes();
      });
      header.addEventListener("click", () => toggleLib(libName, !allChecked));
      list.appendChild(header);
      if (isExpanded) {
        for (const col of cols) {
          const row = document.createElement("div");
          row.className = "lib-tree-item";
          row.dataset.key = col.key;
          row.innerHTML = `
          <div class="lib-check ${col.checked ? "checked" : ""}"></div>
          <div style="font-size: 12px; color: rgba(0,0,0,0.8);">${x(col.colName)}</div>
        `;
          row.addEventListener("click", () => toggleCol(col.key));
          list.appendChild(row);
        }
      }
    }
  }
  function toggleLib(libName, shouldCheck) {
    for (const [, v] of colState) {
      if (v.libName === libName) v.checked = shouldCheck;
    }
    renderCheckboxes();
    updateMigrateBtn();
  }
  function toggleCol(key) {
    const entry = colState.get(key);
    if (entry) entry.checked = !entry.checked;
    renderCheckboxes();
    updateMigrateBtn();
  }
  function updateMigrateBtn() {
    const disabled = ![...colState.values()].some((v) => v.checked);
    if ($("btnMigrate")) $("btnMigrate").disabled = disabled;
    const btnCheck = $("btnCheckMigrate");
    if (btnCheck) btnCheck.disabled = disabled;
  }
  var expandedLibs;
  var init_library_ui = __esm({
    "src/ui/migrator/library-ui.js"() {
      "use strict";
      init_state();
      init_helpers();
      expandedLibs = /* @__PURE__ */ new Set();
    }
  });

  // src/ui/migrator/results-ui.js
  function initTabs() {
    var _a, _b;
    (_a = $("tab-notfound")) == null ? void 0 : _a.addEventListener("click", () => {
      currentTab = "notfound";
      updateTabs();
      renderVarList();
    });
    (_b = $("tab-allvars")) == null ? void 0 : _b.addEventListener("click", () => {
      currentTab = "allvars";
      updateTabs();
      renderVarList();
    });
  }
  function updateTabs() {
    if (currentTab === "notfound") {
      $("tab-notfound").classList.add("active");
      $("tab-allvars").classList.remove("active");
      $("notFoundActions").classList.remove("hidden");
    } else {
      $("tab-allvars").classList.add("active");
      $("tab-notfound").classList.remove("active");
      $("notFoundActions").classList.add("hidden");
    }
  }
  function onScan(result) {
    setBtn("btnScanSelection", false);
    setBtn("btnScanPage", false);
    lastScanResult = result;
    $("migrator-stats-area").classList.remove("hidden");
    $("migrator-results-divider").classList.remove("hidden");
    $("panelResult").classList.remove("hidden");
    $("migrator-nodes-count").textContent = result.nodeCount + " \u043D\u043E\u0434";
    $("migrator-vars-count").textContent = result.variables.length + " \u043F\u0435\u0440\u0435\u043C\u0435\u043D\u043D\u044B\u0445";
    $("migrator-notfound-count").textContent = "0 \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u043E";
    $("tab-notfound-count").textContent = "0";
    $("tab-allvars-count").textContent = result.variables.length;
    currentTab = "allvars";
    state.currentNotFound = [];
    updateTabs();
    renderVarList();
  }
  function renderVarList() {
    const list = $("varList");
    list.innerHTML = "";
    if (currentTab === "notfound") {
      if (!state.currentNotFound.length) {
        list.innerHTML = '<div style="font-size:12px;color:rgba(0,0,0,0.4);text-align:center;padding:12px;">\u041D\u0435\u0442 \u043F\u0440\u043E\u0431\u043B\u0435\u043C\u043D\u044B\u0445 \u0442\u043E\u043A\u0435\u043D\u043E\u0432</div>';
        return;
      }
      for (const name of state.currentNotFound) {
        const d = document.createElement("div");
        d.className = "var-item-new";
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
        list.innerHTML = '<div style="font-size:12px;color:rgba(0,0,0,0.4);text-align:center;padding:12px;">\u041F\u0435\u0440\u0435\u043C\u0435\u043D\u043D\u044B\u0435 \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u044B</div>';
        return;
      }
      for (const v of lastScanResult.variables) {
        const isNotFound = state.currentNotFound.includes(v.variableName);
        const color = isNotFound ? "#F59E0B" : "#0ADB29";
        const d = document.createElement("div");
        d.className = "var-item-new";
        d.innerHTML = `
        <div style="display:inline-flex; align-items:flex-start; gap:4px;">
          <div style="width:16px; height:16px; display:flex; align-items:center; justify-content:center; flex-shrink:0;">
             <div style="width:6px; height:6px; background:${color}; border-radius:1px;"></div>
          </div>
          <div style="color:black; font-size:12px; font-weight:500; line-height:16px; word-wrap:break-word;">
            ${x(v.variableName)} <span style="color:rgba(0,0,0,0.4);font-weight:400;margin-left:4px;">${v.locationCount}\u0445</span>
          </div>
        </div>
      `;
        list.appendChild(d);
      }
    }
  }
  function onMigrate(msg) {
    const result = msg.result;
    setBtn("btnMigrate", false);
    setBtn("btnCheckMigrate", false);
    $("migrator-results-divider").classList.remove("hidden");
    $("panelResult").classList.remove("hidden");
    state.currentNotFound = result.notFound || [];
    $("migrator-notfound-count").textContent = state.currentNotFound.length + " \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u043E";
    $("tab-notfound-count").textContent = state.currentNotFound.length;
    currentTab = "notfound";
    updateTabs();
    renderVarList();
    if (result.errors.length) {
      $("errorMsgs").classList.remove("hidden");
      msgList("errorMsgs", result.errors, "msg-r", "\u2715 ");
    } else {
      $("errorMsgs").classList.add("hidden");
    }
    const actionText = msg.dryRun ? "\u0433\u043E\u0442\u043E\u0432\u043E \u043A \u0437\u0430\u043C\u0435\u043D\u0435" : "\u0437\u0430\u043C\u0435\u043D\u0435\u043D\u043E";
    toastOk(`${result.replaced} ${actionText}, ${state.currentNotFound.length} \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u043E.`);
  }
  function onDetach(result) {
    setBtn("btnDetach", false);
    if (result.errors.length) {
      $("errorMsgs").classList.remove("hidden");
      msgList("errorMsgs", result.errors, "msg-r", "\u2715 ");
    }
    state.currentNotFound = [];
    $("migrator-notfound-count").textContent = "0 \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u043E";
    $("tab-notfound-count").textContent = "0";
    renderVarList();
    if (!result.errors.length) {
      toastOk(`\u041E\u0442\u0432\u044F\u0437\u0430\u043D\u043E ${result.detached} \u0441\u0442\u0438\u043B\u0435\u0439/\u043F\u0435\u0440\u0435\u043C\u0435\u043D\u043D\u044B\u0445.`);
    }
  }
  var lastScanResult, currentTab;
  var init_results_ui = __esm({
    "src/ui/migrator/results-ui.js"() {
      "use strict";
      init_state();
      init_helpers();
      lastScanResult = null;
      currentTab = "allvars";
    }
  });

  // src/ui/migrator/handlers.js
  function initScanButton() {
    var _a, _b;
    (_a = $("btnScanSelection")) == null ? void 0 : _a.addEventListener("click", () => {
      setBtn("btnScanSelection", true, '<div class="cta-inner-border"></div><span>\u0421\u043A\u0430\u043D...</span>');
      $("migrator-stats-area").classList.add("hidden");
      $("migrator-results-divider").classList.add("hidden");
      $("panelResult").classList.add("hidden");
      state.scanTotal = 0;
      post("SCAN", { scope: "selection" });
    });
    (_b = $("btnScanPage")) == null ? void 0 : _b.addEventListener("click", () => {
      setBtn("btnScanPage", true, '<div class="cta-inner-border"></div><span>\u0421\u043A\u0430\u043D...</span>');
      $("migrator-stats-area").classList.add("hidden");
      $("migrator-results-divider").classList.add("hidden");
      $("panelResult").classList.add("hidden");
      state.scanTotal = 0;
      post("SCAN", { scope: "page" });
    });
  }
  function initMigrateButton() {
    var _a;
    $("btnMigrate").addEventListener("click", () => {
      const keys = [...colState.entries()].filter(([, v]) => v.checked).map(([k]) => k);
      if (!keys.length) return;
      setBtn("btnMigrate", true, '<div class="cta-inner-border"></div><span>\u0417\u0430\u043C\u0435\u043D\u0430\u2026</span>');
      post("MIGRATE", { collectionKeys: keys });
    });
    (_a = $("btnCheckMigrate")) == null ? void 0 : _a.addEventListener("click", () => {
      const keys = [...colState.entries()].filter(([, v]) => v.checked).map(([k]) => k);
      if (!keys.length) return;
      setBtn("btnCheckMigrate", true, '<div class="cta-inner-border"></div><span>\u041F\u0440\u043E\u0432\u0435\u0440\u043A\u0430\u2026</span>');
      post("MIGRATE", { collectionKeys: keys, dryRun: true });
    });
  }
  function initCopyButton() {
    $("btnCopyNotFound").addEventListener("click", () => {
      if (!state.currentNotFound.length) return;
      const text = state.currentNotFound.join("\n");
      const btn = $("btnCopyNotFound");
      const orig = btn.innerHTML;
      const markCopied = () => {
        btn.innerHTML = "\u2713 \u0421\u043A\u043E\u043F\u0438\u0440\u043E\u0432\u0430\u043D\u043E";
        btn.style.color = "var(--ok)";
        setTimeout(() => {
          btn.innerHTML = orig;
          btn.style.color = "";
        }, 2e3);
      };
      if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(markCopied).catch(() => fallbackCopy(text, markCopied));
      } else {
        fallbackCopy(text, markCopied);
      }
    });
  }
  function fallbackCopy(text, onDone) {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.cssText = "position:fixed;opacity:0";
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
    onDone();
  }
  function initDetachButton() {
    $("btnDetach").addEventListener("click", () => {
      if (!state.currentNotFound.length) return;
      setBtn("btnDetach", true, "\u041E\u0442\u0432\u044F\u0437\u043A\u0430\u2026");
      post("DETACH_NOT_FOUND", { names: state.currentNotFound });
    });
  }
  function handleMigratorMessage(msg) {
    if (!msg) return;
    switch (msg.type) {
      case "SCAN_START": {
        state.scanTotal = msg.total;
        const el = $("scanProgress");
        if (el) el.textContent = `\u041D\u0430\u0439\u0434\u0435\u043D\u043E ${msg.total.toLocaleString("ru")} \u044D\u043B\u0435\u043C\u0435\u043D\u0442\u043E\u0432, \u0441\u043A\u0430\u043D\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u0435\u2026`;
        break;
      }
      case "SCAN_PROGRESS": {
        const el = $("scanProgress");
        if (el) {
          const pct = msg.total ? Math.round(msg.nodeCount / msg.total * 100) : 0;
          const vars = msg.varCount ? ` \xB7 \u043F\u0435\u0440\u0435\u043C\u0435\u043D\u043D\u044B\u0445: ${msg.varCount}` : "";
          const time = msg.elapsed ? ` \xB7 ${msg.elapsed}` : "";
          el.textContent = `${msg.nodeCount.toLocaleString("ru")} / ${msg.total.toLocaleString("ru")} (${pct}%)${vars}${time}`;
        }
        break;
      }
      case "LIBRARIES_LOADED":
        onLibraries(msg.collections);
        break;
      case "SCAN_COMPLETE": {
        if (msg.elapsed) {
          $("migrator-time-text").textContent = `\u041F\u0440\u043E\u0432\u0435\u0440\u0435\u043D\u043E ${msg.result.nodeCount} \u0441\u043B\u043E\u0435\u0432 \u0437\u0430 ${msg.elapsed}`;
        }
        onScan(msg.result);
        break;
      }
      case "MIGRATE_START": {
        toast(`\u041D\u0430\u0447\u0438\u043D\u0430\u0435\u043C \u0437\u0430\u043C\u0435\u043D\u0443 ${msg.total} \u043F\u0435\u0440\u0435\u043C\u0435\u043D\u043D\u044B\u0445...`);
        break;
      }
      case "MIGRATE_PROGRESS": {
        break;
      }
      case "MIGRATE_COMPLETE":
        onMigrate(msg);
        break;
      case "DETACH_COMPLETE":
        onDetach(msg.result);
        break;
      case "ERROR":
        toast(msg.message);
        setBtn("btnScanSelection", false);
        setBtn("btnScanPage", false);
        setBtn("btnMigrate", false);
        setBtn("btnCheckMigrate", false);
        setBtn("btnDetach", false);
        break;
    }
  }
  var init_handlers = __esm({
    "src/ui/migrator/handlers.js"() {
      "use strict";
      init_state();
      init_helpers();
      init_library_ui();
      init_results_ui();
    }
  });

  // src/ui/ui.ts
  var require_ui = __commonJS({
    "src/ui/ui.ts"(exports) {
      init_handlers();
      initScanButton();
      initMigrateButton();
      initCopyButton();
      initDetachButton();
      initTabs();
      parent.postMessage({ pluginMessage: { type: "GET_LIBRARIES" } }, "*");
      var themeBtn = document.getElementById("toggle-theme");
      var sunSVG = '<svg width="18" height="18" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="8" cy="8" r="2.5" stroke="currentColor" stroke-width="1.2"/><path d="M8 2V3M8 13V14M2 8H3M13 8H14M3.76 3.76L4.47 4.47M11.53 11.53L12.24 12.24M12.24 3.76L11.53 4.47M4.47 11.53L3.76 12.24" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>';
      var moonSVG = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14.4 9.75977C13.7985 9.94219 13.1603 10.0403 12.4992 10.0403C8.88723 10.0403 5.95912 7.11218 5.95912 3.50018C5.95912 2.83937 6.05713 2.20145 6.23939 1.60016C3.55444 2.41441 1.6001 4.90885 1.6001 7.85975C1.6001 11.4718 4.5282 14.3999 8.1402 14.3999C11.0914 14.3999 13.586 12.4451 14.4 9.75977Z" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
      var isDarkTheme = false;
      function applyTheme() {
        if (isDarkTheme) {
          document.body.classList.add("dark-theme");
          themeBtn.innerHTML = sunSVG;
        } else {
          document.body.classList.remove("dark-theme");
          themeBtn.innerHTML = moonSVG;
        }
      }
      var _a;
      (_a = document.getElementById("toggle-theme")) == null ? void 0 : _a.addEventListener("click", () => {
        isDarkTheme = !isDarkTheme;
        applyTheme();
        parent.postMessage({ pluginMessage: { type: "save-theme", theme: isDarkTheme ? "dark" : "light" } }, "*");
      });
      document.querySelectorAll(".tab-button").forEach((tab) => {
        tab.addEventListener("click", () => {
          document.querySelectorAll(".tab-button").forEach((t) => t.classList.remove("active"));
          document.querySelectorAll(".page").forEach((c) => c.classList.remove("active"));
          tab.classList.add("active");
          const targetId = `page-${tab.dataset.page}`;
          document.getElementById(targetId).classList.add("active");
        });
      });
      var _a2;
      (_a2 = document.getElementById("go-to-scan-tab")) == null ? void 0 : _a2.addEventListener("click", () => {
        var _a3;
        (_a3 = document.querySelector('.tab-button[data-page="scan"]')) == null ? void 0 : _a3.dispatchEvent(new MouseEvent("click"));
      });
      var isExpanded = false;
      var sizeBtn = document.getElementById("toggle-size");
      var expandSVG = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9.76502 1.60001H14.3995M14.3995 1.60001V6.23449M14.3995 1.60001L8.9926 7.00691M6.23483 14.4H1.60034M1.60034 14.4V9.76552M1.60034 14.4L7.00724 8.99311" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
      var collapseSVG = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.00724 13.6275L7.00724 8.99304L2.37276 8.99304M7.00724 8.99304L1.60034 14.3999M8.99253 2.37248V7.00697L13.627 7.00697M8.99253 7.00697L14.3994 1.60007" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
      sizeBtn.onclick = () => {
        isExpanded = !isExpanded;
        sizeBtn.innerHTML = isExpanded ? collapseSVG : expandSVG;
        parent.postMessage({ pluginMessage: { type: "resize", expanded: isExpanded } }, "*");
      };
      var currentSubTab = "components";
      document.querySelectorAll(".sub-tab").forEach((tab) => {
        tab.addEventListener("click", () => {
          document.querySelectorAll(".sub-tab").forEach((t) => t.classList.remove("active"));
          document.querySelectorAll(".results-list").forEach((c) => c.style.display = "none");
          tab.classList.add("active");
          currentSubTab = tab.dataset.tab;
          updateEmptyState();
        });
      });
      function updateEmptyState() {
        const list = document.getElementById(`results-${currentSubTab}`);
        const emptyState = document.getElementById("empty-state");
        if (list && list.children.length === 0) {
          list.style.display = "none";
          emptyState.style.display = "flex";
        } else if (list) {
          list.style.display = "flex";
          emptyState.style.display = "none";
        }
      }
      document.getElementById("scan-selection").onclick = () => {
        parent.postMessage({ pluginMessage: { type: "scan-selection" } }, "*");
      };
      document.getElementById("scan-page").onclick = () => {
        parent.postMessage({ pluginMessage: { type: "scan-page" } }, "*");
      };
      document.getElementById("group-issues-switch").addEventListener("change", () => {
        if (latestRawResults) {
          renderResults(latestRawResults);
        }
      });
      document.getElementById("update-snapshot").onclick = () => {
        const btn = document.getElementById("update-snapshot");
        btn.disabled = true;
        document.getElementById("update-snapshot-text").textContent = "\u23F3 \u041E\u0431\u043D\u043E\u0432\u043B\u0435\u043D\u0438\u0435...";
        parent.postMessage({ pluginMessage: { type: "update-snapshot" } }, "*");
      };
      var SEVERITY_ORDER = { error: 0, warning: 1, info: 2 };
      var latestRawResults = null;
      var scanTotalNodes = 0;
      var scanStartTime = 0;
      function groupResultsArray(resultsArray) {
        const grouped = /* @__PURE__ */ new Map();
        for (const item of resultsArray) {
          const key = `${item.name}-${item.errorType}`;
          if (grouped.has(key)) {
            const existing = grouped.get(key);
            existing.count += 1;
          } else {
            grouped.set(key, __spreadValues({}, item));
          }
        }
        return Array.from(grouped.values());
      }
      function renderIssueItem(item) {
        let dotClass = "dot-info";
        if (item.severity === "error") dotClass = "dot-error";
        else if (item.severity === "warning") dotClass = "dot-warning";
        const badgeHtml = item.count > 1 ? ` <span style="color: var(--color-primary)">(${item.count})</span>` : "";
        const breadcrumbHtml = item.breadcrumb ? `
  <div class="issue-detail">\u0420\u043E\u0434\u0438\u0442\u0435\u043B\u044C: ${item.breadcrumb}</div>` : "";
        return `
    <div class="issue-card" onclick="focusNode('${item.nodeId}')">
      <div class="issue-header">
        <div style="width: 16px; height: 16px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; padding-top: 2px;">
          <div class="dot-icon ${dotClass}"><svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 8.00004C10 8.92052 9.25383 9.66671 8.33335 9.66671C7.41288 9.66671 6.66669 8.92052 6.66669 8.00004C6.66669 7.07957 7.41288 6.33337 8.33335 6.33337C9.25383 6.33337 10 7.07957 10 8.00004Z" fill="currentColor" stroke="currentColor" stroke-width="2"/></svg></div>
        </div>
        <div class="issue-title">${item.errorType || "\u041E\u0448\u0438\u0431\u043A\u0430"}${badgeHtml}</div>
      </div>
      <div class="issue-detail">\u0418\u043C\u044F: ${item.name}</div>
      ${breadcrumbHtml}
    </div>
  `;
      }
      function countBySeverity(data) {
        const counts = { error: 0, warning: 0, info: 0 };
        for (const item of data) {
          const sev = item.severity;
          if (sev in counts) counts[sev]++;
        }
        return counts;
      }
      function renderResults(resultsData) {
        var _a3, _b, _c;
        const isGrouped = document.getElementById("group-issues-switch").checked;
        const processedResults = {
          components: isGrouped ? groupResultsArray(resultsData.results.components) : resultsData.results.components,
          variables: isGrouped ? groupResultsArray(resultsData.results.variables) : resultsData.results.variables,
          gradients: isGrouped ? groupResultsArray(resultsData.results.gradients) : resultsData.results.gradients
        };
        const statsEl = document.getElementById("stats");
        const allIssues = [
          ...processedResults.components || [],
          ...processedResults.variables || [],
          ...processedResults.gradients || []
        ];
        const totals = countBySeverity(allIssues);
        if (statsEl) {
          statsEl.style.display = "flex";
          const elapsedMs = Date.now() - scanStartTime;
          const seconds = Math.floor(elapsedMs / 1e3);
          document.getElementById("stats-time-text").textContent = `\u041F\u0440\u043E\u0432\u0435\u0440\u0435\u043D\u043E ${resultsData.scannedCount} \u0441\u043B\u043E\u0435\u0432 \u0437\u0430 ${seconds}\u0441`;
          document.getElementById("stats-error").textContent = `${totals.error} \u0431\u043B\u043E\u043A\u0435\u0440`;
          document.getElementById("stats-warning").textContent = `${totals.warning} \u043F\u0440\u0435\u0434\u0443\u043F\u0440.`;
          document.getElementById("stats-info").textContent = `${totals.info} \u0438\u043D\u0444\u043E`;
          const iconEl = document.getElementById("stats-icon");
          if (iconEl) {
            iconEl.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.2 5.59998L6.42698 10.4L4.79999 8.76379" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
            iconEl.style.display = "flex";
          }
        }
        document.getElementById("count-components").textContent = String(((_a3 = processedResults.components) == null ? void 0 : _a3.length) || 0);
        document.getElementById("count-variables").textContent = String(((_b = processedResults.variables) == null ? void 0 : _b.length) || 0);
        document.getElementById("count-gradients").textContent = String(((_c = processedResults.gradients) == null ? void 0 : _c.length) || 0);
        ["components", "variables", "gradients"].forEach((tabName) => {
          const container = document.getElementById(`results-${tabName}`);
          const data = (processedResults[tabName] || []).sort((a, b) => {
            var _a4, _b2;
            return ((_a4 = SEVERITY_ORDER[a.severity]) != null ? _a4 : 2) - ((_b2 = SEVERITY_ORDER[b.severity]) != null ? _b2 : 2);
          });
          if (data.length === 0) {
            container.innerHTML = "";
          } else {
            container.innerHTML = data.map(renderIssueItem).join("");
          }
        });
        updateEmptyState();
      }
      window.onmessage = (event) => __async(null, null, function* () {
        const pluginMessage = event.data.pluginMessage;
        if (pluginMessage.type === "init-theme") {
          isDarkTheme = pluginMessage.theme === "dark";
          applyTheme();
        }
        handleMigratorMessage(pluginMessage);
        if (pluginMessage.type === "snapshot-progress") {
          const text1 = document.getElementById("scan-status-text1");
          const text2 = document.getElementById("scan-status-text2");
          if (text1) {
            text1.textContent = `\u23F3 \u041E\u0431\u043D\u043E\u0432\u043B\u0435\u043D\u0438\u0435 \u044D\u0442\u0430\u043B\u043E\u043D\u0430... \u0441\u0442\u0440. \xAB${pluginMessage.page}\xBB, \u043E\u0431\u0440\u0430\u0431\u043E\u0442\u0430\u043D\u043E: ${pluginMessage.processed}`;
            text1.style.color = "var(--color-black-60)";
          }
          if (text2) {
            text2.style.display = "none";
          }
        }
        if (pluginMessage.type === "snapshot-saved" || pluginMessage.type === "snapshot-info") {
          const text1 = document.getElementById("scan-status-text1");
          const text2 = document.getElementById("scan-status-text2");
          const btn = document.getElementById("update-snapshot");
          if (btn) {
            btn.disabled = false;
            document.getElementById("update-snapshot-text").textContent = "\u041E\u0431\u043D\u043E\u0432\u0438 \u044D\u0442\u0430\u043B\u043E\u043D \u0414\u0421";
          }
          if (text1) {
            const date = new Date(pluginMessage.updatedAt).toLocaleString("ru-RU", { day: "2-digit", month: "2-digit", year: "2-digit", hour: "2-digit", minute: "2-digit" });
            text1.textContent = `\u2705 \u042D\u0442\u0430\u043B\u043E\u043D: ${pluginMessage.count} \u043A\u043E\u043C\u043F\u043E\u043D\u0435\u043D\u0442\u043E\u0432 \u0438\u0437 "${pluginMessage.fileKey}" (${date})`;
            text1.style.color = "var(--color-black-80)";
          }
          if (text2) {
            text2.style.display = "none";
          }
          const statusText1 = document.querySelector("#snapshot-status .status-text:nth-child(1)");
          const statusText2 = document.querySelector("#snapshot-status .status-text:nth-child(2)");
          if (statusText1) {
            statusText1.textContent = `\u2705 \u042D\u0442\u0430\u043B\u043E\u043D: \u0437\u0430\u0433\u0440\u0443\u0436\u0435\u043D. `;
            statusText1.style.color = "#4caf50";
          }
          if (statusText2) {
            statusText2.style.display = "none";
          }
        }
        if (pluginMessage.type === "scan-start") {
          scanTotalNodes = pluginMessage.total;
          scanStartTime = Date.now();
          const statsEl = document.getElementById("stats");
          if (statsEl) {
            statsEl.style.display = "flex";
            document.getElementById("stats-time-text").innerText = `\u23F3 \u041F\u043E\u0434\u0433\u043E\u0442\u043E\u0432\u043A\u0430... (\u0412\u0441\u0435\u0433\u043E \u0443\u0437\u043B\u043E\u0432: ${scanTotalNodes})`;
            const iconEl = document.getElementById("stats-icon");
            if (iconEl) iconEl.style.display = "none";
          }
        }
        if (pluginMessage.type === "scan-progress") {
          const statsEl = document.getElementById("stats");
          if (statsEl) {
            statsEl.style.display = "flex";
            const elapsedMs = Date.now() - scanStartTime;
            const seconds = Math.floor(elapsedMs / 1e3);
            const minutes = Math.floor(seconds / 60);
            const displaySec = seconds % 60;
            const timeStr = minutes > 0 ? `${minutes}\u043C ${displaySec}\u0441` : `${displaySec}\u0441`;
            let percent = 0;
            if (scanTotalNodes > 0) {
              percent = Math.floor(pluginMessage.count / scanTotalNodes * 100);
              if (percent > 100) percent = 100;
            }
            document.getElementById("stats-time-text").innerText = `\u23F3 \u0421\u043A\u0430\u043D\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u0435... ${pluginMessage.count} \u0438\u0437 ${scanTotalNodes} (${percent}%), \u043F\u0440\u043E\u0448\u043B\u043E ${timeStr}`;
            const iconEl = document.getElementById("stats-icon");
            if (iconEl) iconEl.style.display = "none";
          }
        }
        if (pluginMessage.type === "scan-results") {
          latestRawResults = pluginMessage;
          renderResults(latestRawResults);
          handleMigratorMessage({
            type: "SCAN_COMPLETE",
            result: pluginMessage.migratorResult,
            elapsed: pluginMessage.elapsed
          });
        }
      });
      window.focusNode = (nodeId) => {
        parent.postMessage({ pluginMessage: { type: "focus-node", nodeId } }, "*");
      };
    }
  });
  require_ui();
})();
