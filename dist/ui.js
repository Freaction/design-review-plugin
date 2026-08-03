"use strict";
(() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
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
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
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
        currentNotFound: (
          /** @type {string[]} */
          []
        ),
        detachTarget: ""
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
    t.className = "toast toast-ok";
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
      $("libList").innerHTML = '<div class="lib-empty">\u041D\u0435\u0442 \u0431\u0438\u0431\u043B\u0438\u043E\u0442\u0435\u043A. \u0412\u043A\u043B\u044E\u0447\u0438\u0442\u0435 \u0438\u0445 \u0432 Assets \u2192 Libraries.</div>';
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
      const rotation = isExpanded ? "0deg" : "-90deg";
      const header = document.createElement("div");
      header.className = "lib-tree-header";
      header.innerHTML = `
      <div class="lib-chevron">
        <svg width="8" height="4" viewBox="0 0 8 4" fill="none" stroke="currentColor" stroke-width="1.2" style="transform: rotate(${rotation}); transition: transform 0.2s;"><path d="M1 1l3 2 3-2" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </div>
      <div class="lib-check ${allChecked ? "checked" : partial ? "partial" : ""}"></div>
      <div class="lib-tree-label">${x(libName)}</div>
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
          <div class="lib-tree-label">${x(col.colName)}</div>
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

  // src/ui/shared/focus-nodes.js
  function focusNodes(nodeIds) {
    const ids = [...new Set((nodeIds || []).filter(Boolean))];
    if (!ids.length) return;
    parent.postMessage({ pluginMessage: { type: "focus-nodes", nodeIds: ids } }, "*");
  }
  var init_focus_nodes = __esm({
    "src/ui/shared/focus-nodes.js"() {
      "use strict";
    }
  });

  // src/ui/migrator/var-rows.js
  function appendVarRow(list, { color, title, meta, nodeIds, detachName, detachCount }) {
    const d = document.createElement("div");
    d.className = "var-item-new";
    d.onclick = () => focusNodes(nodeIds);
    const detachHtml = detachName ? `<div class="var-item-actions">
        <span class="var-item-count">${detachCount || 0}</span>
        <button class="var-item-detach" type="button" title="\u041E\u0442\u0432\u044F\u0437\u0430\u0442\u044C \u043F\u0435\u0440\u0435\u043C\u0435\u043D\u043D\u0443\u044E">${DETACH_SVG}</button>
      </div>` : "";
    d.innerHTML = `
    <div class="var-item-row">
      <div class="var-item-dot">
        <div class="dot-icon" style="color:${color}">${DOT_SVG}</div>
      </div>
      <div class="var-item-title">
        ${title}${meta ? ` <span class="var-item-meta">${meta}</span>` : ""}
      </div>
      ${detachHtml}
    </div>
  `;
    if (detachName) {
      d.querySelector(".var-item-detach").addEventListener("click", (event) => {
        event.stopPropagation();
        state.detachTarget = detachName;
        post("DETACH_NOT_FOUND", { names: [detachName] });
      });
    }
    list.appendChild(d);
  }
  function renderGroupedOrExpanded(list, {
    color,
    collectionName,
    name,
    locations,
    locationCount,
    grouped,
    canDetach = false
  }) {
    const locs = locations || [];
    const nodeIds = locs.map((l) => l.nodeId);
    const fullPath = [collectionName, name].filter(Boolean).join(" / ");
    const detachName = canDetach ? name : "";
    const detachCount = locationCount != null ? locationCount : locs.length;
    if (grouped || !locs.length) {
      appendVarRow(list, {
        color,
        title: x(fullPath),
        meta: locationCount != null ? `${locationCount}\u0445` : locs.length ? `${locs.length}\u0445` : "",
        nodeIds,
        detachName,
        detachCount
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
        detachCount
      });
    }
  }
  var DOT_SVG, DETACH_SVG;
  var init_var_rows = __esm({
    "src/ui/migrator/var-rows.js"() {
      "use strict";
      init_helpers();
      init_focus_nodes();
      init_state();
      DOT_SVG = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 8.00004C10 8.92052 9.25383 9.66671 8.33335 9.66671C7.41288 9.66671 6.66669 8.92052 6.66669 8.00004C6.66669 7.07957 7.41288 6.33337 8.33335 6.33337C9.25383 6.33337 10 7.07957 10 8.00004Z" fill="currentColor" stroke="currentColor" stroke-width="2"/></svg>`;
      DETACH_SVG = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4.98075 6.85535L3.49178 8.34432C2.93569 8.90041 2.6159 9.65705 2.62175 10.4523C2.62759 11.2475 2.94038 12.0087 3.52286 12.5732C4.08731 13.1557 4.84873 13.4685 5.64381 13.4743C6.45703 13.4803 7.19576 13.1785 7.75188 12.6224L9.24085 11.1335M11.1427 9.26796L12.6317 7.77899C13.1878 7.2229 13.5076 6.46626 13.5017 5.67105C13.4959 4.87584 13.1831 4.11459 12.6006 3.5501C12.0363 2.98577 11.275 2.67297 10.4798 2.66712C9.68459 2.66128 8.92785 2.96291 8.37173 3.51902L6.88276 5.00799M5.80381 10.2798L10.2707 5.81286M3.55752 3.47798L2.81998 2.74045M6.11852 2.17882L6.23918 0.963135M1.1479 6.05419L2.40833 5.92909M12.6273 12.3371L13.3648 13.0746M10.0663 13.6362L9.94561 14.8519M15.0369 9.76085L13.7765 9.88595" stroke="currentColor" stroke-opacity="1" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
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
  function initGroupSwitch() {
    var _a;
    (_a = $("group-migrator-switch")) == null ? void 0 : _a.addEventListener("change", () => {
      renderVarList();
    });
  }
  function isGrouped() {
    var _a;
    return !!((_a = $("group-migrator-switch")) == null ? void 0 : _a.checked);
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
    $("migrator-results-divider").classList.remove("hidden");
    $("panelResult").classList.remove("hidden");
    $("tab-notfound-count").textContent = "0";
    $("tab-allvars-count").textContent = result.variables.length;
    currentTab = "allvars";
    state.currentNotFound = [];
    updateTabs();
    renderVarList();
  }
  function findVar(name) {
    var _a;
    return ((_a = lastScanResult == null ? void 0 : lastScanResult.variables) == null ? void 0 : _a.find((v) => v.variableName === name)) || null;
  }
  function updateTabCounts(grouped) {
    if (!lastScanResult) return;
    if (grouped) {
      $("tab-allvars-count").textContent = lastScanResult.variables.length;
      $("tab-notfound-count").textContent = state.currentNotFound.length;
      return;
    }
    $("tab-allvars-count").textContent = lastScanResult.variables.reduce(
      (n, v) => {
        var _a;
        return n + (((_a = v.locations) == null ? void 0 : _a.length) || 1);
      },
      0
    );
    $("tab-notfound-count").textContent = state.currentNotFound.reduce((n, name) => {
      var _a;
      const v = findVar(name);
      return n + (((_a = v == null ? void 0 : v.locations) == null ? void 0 : _a.length) || 1);
    }, 0);
  }
  function renderVarList() {
    const list = $("varList");
    list.innerHTML = "";
    const grouped = isGrouped();
    updateTabCounts(grouped);
    if (currentTab === "notfound") {
      if (!state.currentNotFound.length) {
        list.innerHTML = '<div class="var-list-empty">\u041D\u0435\u0442 \u043F\u0440\u043E\u0431\u043B\u0435\u043C\u043D\u044B\u0445 \u0442\u043E\u043A\u0435\u043D\u043E\u0432</div>';
        return;
      }
      for (const name of state.currentNotFound) {
        const v = findVar(name);
        renderGroupedOrExpanded(list, {
          color: "#F59E0B",
          collectionName: v == null ? void 0 : v.collectionName,
          name,
          locations: (v == null ? void 0 : v.locations) || [],
          grouped,
          canDetach: true
        });
      }
      return;
    }
    if (!lastScanResult || !lastScanResult.variables.length) {
      list.innerHTML = '<div class="var-list-empty">\u041F\u0435\u0440\u0435\u043C\u0435\u043D\u043D\u044B\u0435 \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u044B</div>';
      return;
    }
    for (const v of lastScanResult.variables) {
      const isNotFound = state.currentNotFound.includes(v.variableName);
      renderGroupedOrExpanded(list, {
        color: isNotFound ? "#F59E0B" : "#0ADB29",
        collectionName: v.collectionName,
        name: v.variableName,
        locations: v.locations || [],
        locationCount: v.locationCount,
        grouped,
        canDetach: isNotFound
      });
    }
  }
  function onMigrate(msg) {
    const result = msg.result;
    setBtn("btnMigrate", false);
    setBtn("btnCheckMigrate", false);
    $("migrator-results-divider").classList.remove("hidden");
    $("panelResult").classList.remove("hidden");
    state.currentNotFound = result.notFound || [];
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
  }
  function onDetach(result) {
    setBtn("btnDetach", false);
    if (result.errors.length) {
      $("errorMsgs").classList.remove("hidden");
      msgList("errorMsgs", result.errors, "msg-r", "\u2715 ");
    }
    if (!result.errors.length && state.detachTarget) {
      state.currentNotFound = state.currentNotFound.filter((name) => name !== state.detachTarget);
      state.detachTarget = "";
    } else if (!state.detachTarget) {
      state.currentNotFound = [];
    }
    $("tab-notfound-count").textContent = state.currentNotFound.length;
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
      init_var_rows();
      lastScanResult = null;
      currentTab = "allvars";
    }
  });

  // src/ui/migrator/handlers.js
  function initScanButton() {
    var _a, _b;
    (_a = $("btnScanSelection")) == null ? void 0 : _a.addEventListener("click", () => {
      setBtn("btnScanSelection", true, '<div class="cta-inner-border"></div><span>\u0421\u043A\u0430\u043D...</span>');
      $("migrator-results-divider").classList.add("hidden");
      $("panelResult").classList.add("hidden");
      post("SCAN", { scope: "selection" });
    });
    (_b = $("btnScanPage")) == null ? void 0 : _b.addEventListener("click", () => {
      setBtn("btnScanPage", true, '<div class="cta-inner-border"></div><span>\u0421\u043A\u0430\u043D...</span>');
      $("migrator-results-divider").classList.add("hidden");
      $("panelResult").classList.add("hidden");
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
        btn.style.color = "var(--color-primary)";
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
      state.detachTarget = "";
      setBtn("btnDetach", true, "\u041E\u0442\u0432\u044F\u0437\u043A\u0430\u2026");
      post("DETACH_NOT_FOUND", { names: state.currentNotFound });
    });
  }
  function handleMigratorMessage(msg) {
    if (!msg) return;
    switch (msg.type) {
      case "LIBRARIES_LOADED":
        onLibraries(msg.collections);
        break;
      case "SCAN_COMPLETE":
        onScan(msg.result);
        break;
      case "MIGRATE_START":
        toast(`\u041D\u0430\u0447\u0438\u043D\u0430\u0435\u043C \u0437\u0430\u043C\u0435\u043D\u0443 ${msg.total} \u043F\u0435\u0440\u0435\u043C\u0435\u043D\u043D\u044B\u0445...`);
        break;
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

  // src/ui/shared/group-issues.js
  function groupIssues(items, keyFn) {
    const grouped = /* @__PURE__ */ new Map();
    for (const item of items || []) {
      const key = keyFn(item);
      if (grouped.has(key)) {
        const existing = grouped.get(key);
        existing.count += 1;
        if (item.nodeId && !existing.nodeIds.includes(item.nodeId)) {
          existing.nodeIds.push(item.nodeId);
        }
      } else {
        grouped.set(key, __spreadProps(__spreadValues({}, item), {
          count: 1,
          nodeIds: item.nodeId ? [item.nodeId] : []
        }));
      }
    }
    return Array.from(grouped.values());
  }
  var init_group_issues = __esm({
    "src/ui/shared/group-issues.js"() {
      "use strict";
    }
  });

  // src/ui/shared/scan-stats.js
  function blocks() {
    return document.querySelectorAll(".scan-stats");
  }
  function setVisible(root, visible) {
    root.classList.toggle("hidden", !visible);
    if (visible) root.style.display = "flex";
    else root.style.display = "none";
  }
  function setTime(root, text) {
    const el = root.querySelector(".scan-stats-time");
    if (el) el.textContent = text;
  }
  function setIcon(root, show) {
    const icon = root.querySelector(".scan-stats-icon");
    if (!icon) return;
    if (show) {
      icon.innerHTML = CHECK_SVG;
      icon.style.display = "flex";
    } else {
      icon.style.display = "none";
    }
  }
  function formatElapsed(ms) {
    const seconds = Math.floor(ms / 1e3);
    const minutes = Math.floor(seconds / 60);
    return minutes > 0 ? `${minutes}\u043C ${seconds % 60}\u0441` : `${seconds}\u0441`;
  }
  function setScanStart() {
    scanStartTime = Date.now();
    for (const root of blocks()) {
      setVisible(root, true);
      setTime(root, "\u23F3 \u041F\u043E\u0434\u0433\u043E\u0442\u043E\u0432\u043A\u0430...");
      setIcon(root, false);
      const error = root.querySelector(".scan-stats-error");
      const warning = root.querySelector(".scan-stats-warning");
      const info = root.querySelector(".scan-stats-info");
      if (error) error.textContent = "0 \u0431\u043B\u043E\u043A\u0435\u0440";
      if (warning) warning.textContent = "0 \u043F\u0440\u0435\u0434\u0443\u043F\u0440.";
      if (info) info.textContent = "0 \u0438\u043D\u0444\u043E";
    }
  }
  function setScanLoadingPages() {
    for (const root of blocks()) {
      setVisible(root, true);
      setTime(root, "\u23F3 \u0417\u0430\u0433\u0440\u0443\u0437\u043A\u0430 \u0441\u0442\u0440\u0430\u043D\u0438\u0446...");
      setIcon(root, false);
    }
  }
  function setScanProgress(count, total, label) {
    const timeStr = formatElapsed(Date.now() - scanStartTime);
    let text;
    if (label) {
      text = `\u23F3 ${label}, \u043F\u0440\u043E\u0448\u043B\u043E ${timeStr}`;
    } else if (total) {
      text = `\u23F3 \u0421\u043A\u0430\u043D\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u0435... ${count} \u0438\u0437 ${total}, \u043F\u0440\u043E\u0448\u043B\u043E ${timeStr}`;
    } else {
      text = `\u23F3 \u0421\u043A\u0430\u043D\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u0435... ${count} \u0443\u0437\u043B\u043E\u0432, \u043F\u0440\u043E\u0448\u043B\u043E ${timeStr}`;
    }
    for (const root of blocks()) {
      setVisible(root, true);
      setTime(root, text);
      setIcon(root, false);
    }
  }
  function setScanStatsComplete(scannedCount, totals) {
    const seconds = Math.floor((Date.now() - scanStartTime) / 1e3);
    for (const root of blocks()) {
      setVisible(root, true);
      setTime(root, `\u041F\u0440\u043E\u0432\u0435\u0440\u0435\u043D\u043E ${scannedCount} \u0441\u043B\u043E\u0435\u0432 \u0437\u0430 ${seconds}\u0441`);
      const error = root.querySelector(".scan-stats-error");
      const warning = root.querySelector(".scan-stats-warning");
      const info = root.querySelector(".scan-stats-info");
      if (error) error.textContent = `${totals.error} \u0431\u043B\u043E\u043A\u0435\u0440`;
      if (warning) warning.textContent = `${totals.warning} \u043F\u0440\u0435\u0434\u0443\u043F\u0440.`;
      if (info) info.textContent = `${totals.info} \u0438\u043D\u0444\u043E`;
      setIcon(root, true);
    }
  }
  var CHECK_SVG, scanStartTime;
  var init_scan_stats = __esm({
    "src/ui/shared/scan-stats.js"() {
      "use strict";
      CHECK_SVG = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.2 5.59998L6.42698 10.4L4.79999 8.76379" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
      scanStartTime = 0;
    }
  });

  // src/ui/self-check/results.ts
  function initSelfCheckResults() {
    document.querySelectorAll("#page-main .sub-tab").forEach((tab) => {
      tab.addEventListener("click", () => {
        document.querySelectorAll("#page-main .sub-tab").forEach((t) => t.classList.remove("active"));
        document.querySelectorAll("#page-main .results-list").forEach((c) => c.style.display = "none");
        tab.classList.add("active");
        currentSubTab = tab.dataset.tab;
        updateEmptyState();
      });
    });
    document.getElementById("group-issues-switch").addEventListener("change", () => {
      if (latestRawResults) renderResults(latestRawResults);
    });
    window.focusIssueNodes = (idsCsv) => {
      focusNodes(String(idsCsv || "").split(",").filter(Boolean));
    };
  }
  function onScanResults(resultsData) {
    latestRawResults = resultsData;
    renderResults(latestRawResults);
  }
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
  function renderIssueItem(item) {
    var _a;
    let dotClass = "dot-info";
    if (item.severity === "error") dotClass = "dot-error";
    else if (item.severity === "warning") dotClass = "dot-warning";
    const ids = ((_a = item.nodeIds) == null ? void 0 : _a.length) ? item.nodeIds : item.nodeId ? [item.nodeId] : [];
    const badgeHtml = item.count > 1 ? ` <span style="color: var(--color-primary)">(${item.count})</span>` : "";
    const breadcrumbHtml = item.breadcrumb ? `<div class="issue-detail">\u0420\u043E\u0434\u0438\u0442\u0435\u043B\u044C: ${item.breadcrumb}</div>` : "";
    return `
    <div class="issue-card" onclick="focusIssueNodes('${ids.join(",")}')">
      <div class="issue-header">
        <div style="width: 16px; height: 16px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; padding-top: 2px;">
          <div class="dot-icon ${dotClass}">${DOT_SVG2}</div>
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
    var _a, _b, _c;
    const isGrouped2 = document.getElementById("group-issues-switch").checked;
    const keyFn = (item) => `${item.name}-${item.errorType}`;
    const processedResults = {
      components: isGrouped2 ? groupIssues(resultsData.results.components, keyFn) : resultsData.results.components,
      variables: isGrouped2 ? groupIssues(resultsData.results.variables, keyFn) : resultsData.results.variables,
      gradients: isGrouped2 ? groupIssues(resultsData.results.gradients, keyFn) : resultsData.results.gradients
    };
    const allIssues = [
      ...processedResults.components || [],
      ...processedResults.variables || [],
      ...processedResults.gradients || []
    ];
    setScanStatsComplete(resultsData.scannedCount, countBySeverity(allIssues));
    document.getElementById("count-components").textContent = String(((_a = processedResults.components) == null ? void 0 : _a.length) || 0);
    document.getElementById("count-variables").textContent = String(((_b = processedResults.variables) == null ? void 0 : _b.length) || 0);
    document.getElementById("count-gradients").textContent = String(((_c = processedResults.gradients) == null ? void 0 : _c.length) || 0);
    ["components", "variables", "gradients"].forEach((tabName) => {
      const container = document.getElementById(`results-${tabName}`);
      const data = (processedResults[tabName] || []).sort((a, b) => {
        var _a2, _b2;
        return ((_a2 = SEVERITY_ORDER[a.severity]) != null ? _a2 : 2) - ((_b2 = SEVERITY_ORDER[b.severity]) != null ? _b2 : 2);
      });
      container.innerHTML = data.length ? data.map(renderIssueItem).join("") : "";
    });
    updateEmptyState();
  }
  var SEVERITY_ORDER, latestRawResults, currentSubTab, DOT_SVG2;
  var init_results = __esm({
    "src/ui/self-check/results.ts"() {
      "use strict";
      init_group_issues();
      init_focus_nodes();
      init_scan_stats();
      init_scan_stats();
      SEVERITY_ORDER = { error: 0, warning: 1, info: 2 };
      latestRawResults = null;
      currentSubTab = "components";
      DOT_SVG2 = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 8.00004C10 8.92052 9.25383 9.66671 8.33335 9.66671C7.41288 9.66671 6.66669 8.92052 6.66669 8.00004C6.66669 7.07957 7.41288 6.33337 8.33335 6.33337C9.25383 6.33337 10 7.07957 10 8.00004Z" fill="currentColor" stroke="currentColor" stroke-width="2"/></svg>`;
    }
  });

  // src/ui/shared/snapshot-remote-config.js
  var SNAPSHOT_REMOTE;
  var init_snapshot_remote_config = __esm({
    "src/ui/shared/snapshot-remote-config.js"() {
      "use strict";
      SNAPSHOT_REMOTE = {
        metaUrl: "https://raw.githubusercontent.com/Freaction/design-review-plugin/main/ds-snapshot/meta.json",
        snapshotUrl: "https://raw.githubusercontent.com/Freaction/design-review-plugin/main/ds-snapshot/snapshot.json"
      };
    }
  });

  // src/ui/shared/snapshot-remote.js
  function fetchRemoteMeta() {
    return __async(this, null, function* () {
      const res = yield fetch(SNAPSHOT_REMOTE.metaUrl, { cache: "no-store" });
      if (!res.ok) throw new Error(`\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u043F\u0440\u043E\u0432\u0435\u0440\u0438\u0442\u044C \u044D\u0442\u0430\u043B\u043E\u043D (${res.status})`);
      return res.json();
    });
  }
  function fetchRemoteSnapshot() {
    return __async(this, null, function* () {
      const res = yield fetch(SNAPSHOT_REMOTE.snapshotUrl, { cache: "no-store" });
      if (!res.ok) throw new Error(`\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0441\u043A\u0430\u0447\u0430\u0442\u044C \u044D\u0442\u0430\u043B\u043E\u043D (${res.status})`);
      const data = yield res.json();
      if (!data || !Array.isArray(data.c)) throw new Error("\u041D\u0435\u043A\u043E\u0440\u0440\u0435\u043A\u0442\u043D\u044B\u0439 \u0444\u043E\u0440\u043C\u0430\u0442 snapshot.json");
      return data;
    });
  }
  function compareVersions(localVersion, remoteVersion) {
    if (!remoteVersion) return "unknown";
    if (!localVersion) return "outdated";
    if (localVersion === remoteVersion) return "current";
    return "outdated";
  }
  var init_snapshot_remote = __esm({
    "src/ui/shared/snapshot-remote.js"() {
      "use strict";
      init_snapshot_remote_config();
    }
  });

  // src/ui/self-check/snapshot-scan-stats.ts
  function formatElapsed2(ms) {
    const totalSec = Math.max(0, Math.floor((ms || 0) / 1e3));
    const minutes = Math.floor(totalSec / 60);
    const seconds = totalSec % 60;
    if (minutes > 0) return `${minutes}\u043C ${seconds}\u0441`;
    return `${seconds}\u0441`;
  }
  function formatMetaSummary(meta) {
    var _a;
    const comp = `${(meta == null ? void 0 : meta.count) || 0} \u043A\u043E\u043C\u043F.`;
    if ((meta == null ? void 0 : meta.pagesTotal) == null) return comp;
    const scanned = (_a = meta.pagesScanned) != null ? _a : meta.pagesTotal;
    return `${comp} \xB7 ${scanned}/${meta.pagesTotal} \u0441\u0442\u0440.`;
  }
  function showScanProgress(msg) {
    const stats = document.getElementById("snapshot-scan-stats");
    const statsText = document.getElementById("snapshot-scan-stats-text");
    const text1 = document.getElementById("scan-status-text1");
    const text2 = document.getElementById("scan-status-text2");
    const elapsed = formatElapsed2(msg.elapsedMs);
    const pagesPart = msg.pagesTotal ? `\u0441\u0442\u0440\u0430\u043D\u0438\u0446\u0430 ${msg.pageIndex || 0}/${msg.pagesTotal}` : `\u0441\u0442\u0440. \xAB${msg.page}\xBB`;
    if (text1) {
      text1.textContent = `\u23F3 \u0421\u043A\u0430\u043D UI-Kit... ${pagesPart}, \u043A\u043E\u043C\u043F\u043E\u043D\u0435\u043D\u0442\u043E\u0432: ${msg.processed || 0}, ${elapsed}`;
      text1.className = "status-text status-warn";
    }
    if (text2) text2.style.display = "none";
    if (stats) stats.classList.remove("hidden");
    if (statsText) {
      statsText.textContent = `\u0412 \u043F\u0440\u043E\u0446\u0435\u0441\u0441\u0435: ${pagesPart} \xB7 ${msg.processed || 0} \u043A\u043E\u043C\u043F. \xB7 ${elapsed}`;
    }
  }
  function showScanStats(meta) {
    const stats = document.getElementById("snapshot-scan-stats");
    const statsText = document.getElementById("snapshot-scan-stats-text");
    if (!stats || !statsText) return;
    stats.classList.remove("hidden");
    const pages = meta.pagesTotal != null ? `${meta.pagesScanned || 0}/${meta.pagesTotal} \u0441\u0442\u0440.` : "\u2014";
    statsText.textContent = `\u0413\u043E\u0442\u043E\u0432\u043E: ${meta.count || 0} \u043A\u043E\u043C\u043F. \xB7 ${pages} \xB7 ${formatElapsed2(meta.elapsedMs)}`;
  }
  var init_snapshot_scan_stats = __esm({
    "src/ui/self-check/snapshot-scan-stats.ts"() {
      "use strict";
    }
  });

  // src/ui/self-check/snapshot-status.ts
  function formatDate(iso) {
    if (!iso) return "\u2014";
    return new Date(iso).toLocaleString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    });
  }
  function setMainStatus(text, tone) {
    const el = document.getElementById("snapshot-status");
    if (!el) return;
    el.innerHTML = `<span class="status-text status-${tone}">${text}</span>`;
  }
  function setScanStatus(text1, text2, tone) {
    const t1 = document.getElementById("scan-status-text1");
    const t2 = document.getElementById("scan-status-text2");
    if (!t1) return;
    t1.textContent = text1;
    t1.className = `status-text status-${tone}`;
    if (t2) {
      if (text2) {
        t2.textContent = text2;
        t2.style.display = "";
        t2.className = "status-text status-link";
      } else {
        t2.style.display = "none";
      }
    }
  }
  function resetDownloadBtn() {
    const btn = document.getElementById("download-snapshot");
    const label = document.getElementById("download-snapshot-text");
    if (btn) btn.disabled = false;
    if (label) label.textContent = "\u041E\u0431\u043D\u043E\u0432\u0438\u0442\u044C \u044D\u0442\u0430\u043B\u043E\u043D \u0441 GitHub";
  }
  function renderStatus() {
    const badge = document.getElementById("snapshot-version-badge");
    const localVersion = (localMeta == null ? void 0 : localMeta.version) || "";
    const remoteVersion = (remoteMeta == null ? void 0 : remoteMeta.version) || "";
    if (status === "current") {
      const label = `\u2705 \u042D\u0442\u0430\u043B\u043E\u043D \u0430\u043A\u0442\u0443\u0430\u043B\u0435\u043D \xB7 v${localVersion || "\u2014"} \xB7 ${formatMetaSummary(localMeta)} \xB7 ${formatDate(localMeta == null ? void 0 : localMeta.updatedAt)}`;
      setMainStatus(label, "ok");
      setScanStatus(label, "", "ok");
      if (badge) {
        badge.textContent = "\u0410\u043A\u0442\u0443\u0430\u043B\u0435\u043D";
        badge.className = "snapshot-badge snapshot-badge-ok";
      }
      return;
    }
    if (status === "outdated") {
      const label = localMeta ? `\u26A0\uFE0F \u042D\u0442\u0430\u043B\u043E\u043D \u0443\u0441\u0442\u0430\u0440\u0435\u043B \xB7 \u043B\u043E\u043A\u0430\u043B\u044C\u043D\u043E v${localVersion || "\u2014"}, \u043D\u0430 \u0441\u0435\u0440\u0432\u0435\u0440\u0435 v${remoteVersion}` : `\u26A0\uFE0F \u042D\u0442\u0430\u043B\u043E\u043D \u043D\u0435 \u0437\u0430\u0433\u0440\u0443\u0436\u0435\u043D \xB7 \u043D\u0430 \u0441\u0435\u0440\u0432\u0435\u0440\u0435 v${remoteVersion}`;
      setMainStatus(label, "warn");
      setScanStatus(label, "\u041D\u0430\u0436\u043C\u0438\u0442\u0435 \xAB\u041E\u0431\u043D\u043E\u0432\u0438\u0442\u044C \u044D\u0442\u0430\u043B\u043E\u043D \u0441 GitHub\xBB", "warn");
      if (badge) {
        badge.textContent = localMeta ? "\u0423\u0441\u0442\u0430\u0440\u0435\u043B" : "\u041D\u0435 \u0437\u0430\u0433\u0440\u0443\u0436\u0435\u043D";
        badge.className = "snapshot-badge snapshot-badge-warn";
      }
      return;
    }
    if (localMeta) {
      const label = `\u2705 \u042D\u0442\u0430\u043B\u043E\u043D \u0437\u0430\u0433\u0440\u0443\u0436\u0435\u043D \xB7 v${localVersion || "\u2014"} \xB7 ${formatMetaSummary(localMeta)} \xB7 ${formatDate(localMeta.updatedAt)}`;
      const hint = remoteCheckError ? "\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u043F\u0440\u043E\u0432\u0435\u0440\u0438\u0442\u044C \u0441\u0435\u0440\u0432\u0435\u0440 \u2014 \u043E\u0431\u043D\u043E\u0432\u043B\u0435\u043D\u0438\u0435 \u0432\u0441\u0451 \u0440\u0430\u0432\u043D\u043E \u0434\u043E\u0441\u0442\u0443\u043F\u043D\u043E" : "";
      setMainStatus(label, "ok");
      setScanStatus(label, hint, "ok");
      if (badge) {
        badge.textContent = remoteMeta ? "\u041B\u043E\u043A\u0430\u043B\u044C\u043D\u044B\u0439" : "\u041D\u0435 \u043F\u0440\u043E\u0432\u0435\u0440\u0435\u043D";
        badge.className = "snapshot-badge";
      }
      return;
    }
    setMainStatus("\u042D\u0442\u0430\u043B\u043E\u043D \u043D\u0435 \u0437\u0430\u0433\u0440\u0443\u0436\u0435\u043D \u2014 \u043E\u0431\u043D\u043E\u0432\u0438\u0442\u0435 \u0441 GitHub", "error");
    setScanStatus("\u042D\u0442\u0430\u043B\u043E\u043D \u043D\u0435 \u0437\u0430\u0433\u0440\u0443\u0436\u0435\u043D \u2014 ", "\u043E\u0431\u043D\u043E\u0432\u0438\u0442\u0435 \u0441 GitHub", "error");
    if (badge) {
      badge.textContent = "\u041D\u0435\u0442 \u044D\u0442\u0430\u043B\u043E\u043D\u0430";
      badge.className = "snapshot-badge snapshot-badge-error";
    }
  }
  function applyLocalMeta(meta) {
    localMeta = meta ? {
      updatedAt: meta.updatedAt,
      fileKey: meta.fileKey,
      count: meta.count,
      version: meta.version,
      source: meta.source,
      pagesScanned: meta.pagesScanned,
      pagesTotal: meta.pagesTotal,
      elapsedMs: meta.elapsedMs
    } : null;
    status = compareVersions(localMeta == null ? void 0 : localMeta.version, remoteMeta == null ? void 0 : remoteMeta.version);
    renderStatus();
    if ((localMeta == null ? void 0 : localMeta.pagesTotal) != null) showScanStats(localMeta);
  }
  function checkRemoteVersion() {
    return __async(this, null, function* () {
      remoteCheckError = "";
      try {
        remoteMeta = yield fetchRemoteMeta();
        status = compareVersions(localMeta == null ? void 0 : localMeta.version, remoteMeta == null ? void 0 : remoteMeta.version);
      } catch (err) {
        remoteMeta = null;
        remoteCheckError = err instanceof Error ? err.message : String(err);
        status = localMeta ? "unknown" : "outdated";
      }
      renderStatus();
      return { remoteMeta, status };
    });
  }
  function downloadAndSaveRemote() {
    return __async(this, null, function* () {
      const btn = document.getElementById("download-snapshot");
      const label = document.getElementById("download-snapshot-text");
      if (btn) btn.disabled = true;
      if (label) label.textContent = "\u23F3 \u041F\u0440\u043E\u0432\u0435\u0440\u043A\u0430...";
      try {
        remoteCheckError = "";
        remoteMeta = yield fetchRemoteMeta();
        status = compareVersions(localMeta == null ? void 0 : localMeta.version, remoteMeta.version);
        if (status === "current") {
          const msg = `\u2705 \u042D\u0442\u0430\u043B\u043E\u043D \u0443\u0436\u0435 \u0430\u043A\u0442\u0443\u0430\u043B\u0435\u043D \xB7 v${remoteMeta.version} \xB7 ${formatMetaSummary(localMeta)}`;
          renderStatus();
          setScanStatus(msg, "", "ok");
          setMainStatus(msg, "ok");
          return;
        }
        if (label) label.textContent = "\u23F3 \u0421\u043A\u0430\u0447\u0438\u0432\u0430\u043D\u0438\u0435...";
        const storage = yield fetchRemoteSnapshot();
        parent.postMessage({
          pluginMessage: { type: "save-remote-snapshot", storage, remoteMeta }
        }, "*");
      } catch (err) {
        resetDownloadBtn();
        setScanStatus(err instanceof Error ? err.message : String(err), "", "error");
        setMainStatus(err instanceof Error ? err.message : String(err), "error");
      } finally {
        if (status === "current") resetDownloadBtn();
      }
    });
  }
  function onRemoteSaved(meta) {
    applyLocalMeta(meta);
    remoteCheckError = "";
    resetDownloadBtn();
  }
  function downloadJson(filename, data) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }
  function initSnapshotUi() {
    var _a, _b;
    (_a = document.getElementById("download-snapshot")) == null ? void 0 : _a.addEventListener("click", () => {
      downloadAndSaveRemote();
    });
    (_b = document.getElementById("export-snapshot")) == null ? void 0 : _b.addEventListener("click", () => {
      parent.postMessage({ pluginMessage: { type: "export-snapshot" } }, "*");
    });
  }
  var localMeta, remoteMeta, status, remoteCheckError;
  var init_snapshot_status = __esm({
    "src/ui/self-check/snapshot-status.ts"() {
      "use strict";
      init_snapshot_remote();
      init_snapshot_scan_stats();
      init_snapshot_scan_stats();
      localMeta = null;
      remoteMeta = null;
      status = "unknown";
      remoteCheckError = "";
    }
  });

  // src/ui/libraries/state.js
  var libState;
  var init_state2 = __esm({
    "src/ui/libraries/state.js"() {
      "use strict";
      libState = {
        result: null,
        checked: /* @__PURE__ */ new Set(),
        expanded: /* @__PURE__ */ new Set(["foreign", "broken"]),
        grouped: true
      };
    }
  });

  // src/ui/libraries/tree-ui.js
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
  function renderLibTree() {
    const list = $("libUsageList");
    if (!list || !libState.result) return;
    list.innerHTML = "";
    if (!libState.result.categories.length) {
      list.innerHTML = '<div class="lib-empty">Remote-\u0438\u043D\u0441\u0442\u0430\u043D\u0441\u044B \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u044B</div>';
      return;
    }
    for (const cat of libState.result.categories) {
      const catKeys = cat.components.map((c) => `${cat.id}:${c.key}`);
      const checkedCount = catKeys.filter((k) => libState.checked.has(k)).length;
      const allChecked = checkedCount === catKeys.length && catKeys.length > 0;
      const partial = checkedCount > 0 && !allChecked;
      const isExpanded = libState.expanded.has(cat.id);
      const rotation = isExpanded ? "0deg" : "-90deg";
      const catCount = cat.components.reduce((n, c) => n + c.count, 0);
      const header = document.createElement("div");
      header.className = "lib-tree-header";
      header.innerHTML = `
      <div class="lib-chevron">
        <svg width="8" height="4" viewBox="0 0 8 4" fill="none" stroke="currentColor" stroke-width="1.2" style="transform: rotate(${rotation}); transition: transform 0.2s;"><path d="M1 1l3 2 3-2" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </div>
      <div class="lib-check ${allChecked ? "checked" : partial ? "partial" : ""}"></div>
      <div class="lib-tree-label">${x(cat.title)} \xB7 ${catCount}</div>
    `;
      header.querySelector(".lib-chevron").addEventListener("click", (e) => {
        e.stopPropagation();
        if (isExpanded) libState.expanded.delete(cat.id);
        else libState.expanded.add(cat.id);
        renderLibTree();
      });
      header.addEventListener("click", () => {
        for (const k of catKeys) {
          if (allChecked) libState.checked.delete(k);
          else libState.checked.add(k);
        }
        renderLibTree();
        window.dispatchEvent(new CustomEvent("lib-selection-changed"));
      });
      list.appendChild(header);
      if (isExpanded) {
        for (const c of cat.components) {
          const id = `${cat.id}:${c.key}`;
          const row = document.createElement("div");
          row.className = "lib-tree-item";
          row.innerHTML = `
          <div class="lib-check ${libState.checked.has(id) ? "checked" : ""}"></div>
          <div class="lib-tree-label">${x(c.name)} \xB7 ${c.count}</div>
        `;
          row.addEventListener("click", () => {
            if (libState.checked.has(id)) libState.checked.delete(id);
            else libState.checked.add(id);
            renderLibTree();
            window.dispatchEvent(new CustomEvent("lib-selection-changed"));
          });
          list.appendChild(row);
        }
      }
    }
    const hint = $("libUsageHint");
    if (hint) {
      hint.textContent = `\u0412\u044B\u0431\u0440\u0430\u043D\u043E remote: ${totalSelected()} / ${libState.result.remoteCount}`;
    }
  }
  var init_tree_ui = __esm({
    "src/ui/libraries/tree-ui.js"() {
      "use strict";
      init_state2();
      init_helpers();
    }
  });

  // src/ui/libraries/results-ui.js
  function selectedItems() {
    if (!libState.result) return [];
    const items = [];
    for (const cat of libState.result.categories) {
      for (const c of cat.components) {
        if (!libState.checked.has(`${cat.id}:${c.key}`)) continue;
        for (const nodeId of c.nodeIds) {
          items.push({
            nodeId,
            name: c.name,
            category: cat.id,
            errorType: c.name
          });
        }
      }
    }
    return items;
  }
  function appendRow(list, { color, title, meta, nodeIds, count }) {
    const d = document.createElement("div");
    d.className = "var-item-new";
    d.onclick = () => focusNodes(nodeIds);
    const countHtml = count > 1 ? `<div class="var-item-actions"><span class="var-item-count">${count}</span></div>` : "";
    d.innerHTML = `
    <div class="var-item-row">
      <div class="var-item-dot"><div class="dot-icon" style="color:${color}">${DOT_SVG3}</div></div>
      <div class="var-item-title">
        ${title}${meta ? ` <span class="var-item-meta">${meta}</span>` : ""}
      </div>
      ${countHtml}
    </div>
  `;
    list.appendChild(d);
  }
  function renderLibResults() {
    var _a;
    const list = $("libUsageResults");
    const panel = $("libUsagePanel");
    if (!list || !panel) return;
    const items = selectedItems();
    if (!libState.result) {
      panel.classList.add("hidden");
      return;
    }
    panel.classList.remove("hidden");
    list.innerHTML = "";
    if (!items.length) {
      list.innerHTML = '<div class="var-list-empty">\u041E\u0442\u043C\u0435\u0442\u044C\u0442\u0435 \u043A\u043E\u043C\u043F\u043E\u043D\u0435\u043D\u0442\u044B \u0432 \u0441\u043F\u0438\u0441\u043A\u0435 \u0441\u043B\u0435\u0432\u0430</div>';
      return;
    }
    const grouped = libState.grouped ? groupIssues(items, (item) => `${item.category}:${item.name}`) : items;
    for (const item of grouped) {
      const nodeIds = ((_a = item.nodeIds) == null ? void 0 : _a.length) ? item.nodeIds : item.nodeId ? [item.nodeId] : [];
      appendRow(list, {
        color: COLORS[item.category] || COLORS.foreign,
        title: x(item.name),
        meta: item.count > 1 ? `${item.count}\u0445` : "",
        nodeIds,
        count: item.count || 1
      });
    }
  }
  function initLibResults() {
    var _a;
    (_a = $("group-lib-switch")) == null ? void 0 : _a.addEventListener("change", (e) => {
      libState.grouped = !!e.target.checked;
      renderLibResults();
    });
    window.addEventListener("lib-selection-changed", renderLibResults);
  }
  var DOT_SVG3, COLORS;
  var init_results_ui2 = __esm({
    "src/ui/libraries/results-ui.js"() {
      "use strict";
      init_state2();
      init_helpers();
      init_group_issues();
      init_focus_nodes();
      DOT_SVG3 = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 8.00004C10 8.92052 9.25383 9.66671 8.33335 9.66671C7.41288 9.66671 6.66669 8.92052 6.66669 8.00004C6.66669 7.07957 7.41288 6.33337 8.33335 6.33337C9.25383 6.33337 10 7.07957 10 8.00004Z" fill="currentColor" stroke="currentColor" stroke-width="2"/></svg>`;
      COLORS = {
        etalon: "#0ADB29",
        foreign: "#F59E0B",
        broken: "#FB3748"
      };
    }
  });

  // src/ui/libraries/handlers.js
  function initLibrariesTab() {
    var _a, _b;
    initLibResults();
    (_a = $("btnLibScanSelection")) == null ? void 0 : _a.addEventListener("click", () => {
      var _a2;
      setBtn("btnLibScanSelection", true, '<div class="cta-inner-border"></div><span>\u0421\u043A\u0430\u043D...</span>');
      (_a2 = $("libUsagePanel")) == null ? void 0 : _a2.classList.add("hidden");
      post("LIB_SCAN", { scope: "selection" });
    });
    (_b = $("btnLibScanPage")) == null ? void 0 : _b.addEventListener("click", () => {
      var _a2;
      setBtn("btnLibScanPage", true, '<div class="cta-inner-border"></div><span>\u0421\u043A\u0430\u043D...</span>');
      (_a2 = $("libUsagePanel")) == null ? void 0 : _a2.classList.add("hidden");
      post("LIB_SCAN", { scope: "page" });
    });
  }
  function handleLibrariesMessage(msg) {
    var _a;
    if (!msg || msg.type !== "lib-scan-results") return false;
    setBtn("btnLibScanSelection", false);
    setBtn("btnLibScanPage", false);
    libState.result = msg.result;
    libState.checked = /* @__PURE__ */ new Set();
    libState.expanded = /* @__PURE__ */ new Set();
    for (const cat of msg.result.categories) {
      if (cat.id === "etalon") continue;
      libState.expanded.add(cat.id);
      for (const c of cat.components) libState.checked.add(`${cat.id}:${c.key}`);
    }
    const r = msg.result;
    setScanStatsComplete(r.instanceTotal, { error: 0, warning: 0, info: 0 });
    const timeEls = document.querySelectorAll("#page-libraries .scan-stats-time");
    for (const el of timeEls) {
      const mode = r.usedRest ? "\u043F\u043E \u0431\u0438\u0431\u043B\u0438\u043E\u0442\u0435\u043A\u0430\u043C" : "\u044D\u0442\u0430\u043B\u043E\u043D / \u0432\u043D\u0435 \u044D\u0442\u0430\u043B\u043E\u043D\u0430";
      el.textContent = `\u0418\u043D\u0441\u0442\u0430\u043D\u0441\u043E\u0432: ${r.instanceTotal} \xB7 remote: ${r.remoteCount} \xB7 \u043B\u043E\u043A\u0430\u043B\u044C\u043D\u044B\u0445: ${r.localCount} \xB7 ${mode}`;
    }
    (_a = $("libUsageSection")) == null ? void 0 : _a.classList.remove("hidden");
    renderLibTree();
    renderLibResults();
    return true;
  }
  var init_handlers2 = __esm({
    "src/ui/libraries/handlers.js"() {
      "use strict";
      init_state2();
      init_helpers();
      init_tree_ui();
      init_results_ui2();
      init_scan_stats();
    }
  });

  // src/ui/self-check/figma-token-ui.ts
  function applyTokenStatus(msg) {
    const status2 = document.getElementById("figma-token-status");
    const input = document.getElementById("figma-token-input");
    if (!status2) return;
    if (msg == null ? void 0 : msg.hasToken) {
      status2.textContent = `\u0421\u043E\u0445\u0440\u0430\u043D\u0451\u043D ${msg.hint || ""}`.trim();
      status2.className = "status-text status-ok";
      if (input) input.placeholder = "\u0422\u043E\u043A\u0435\u043D \u0441\u043E\u0445\u0440\u0430\u043D\u0451\u043D \u2014 \u0432\u0441\u0442\u0430\u0432\u044C \u043D\u043E\u0432\u044B\u0439, \u0447\u0442\u043E\u0431\u044B \u0437\u0430\u043C\u0435\u043D\u0438\u0442\u044C";
    } else {
      status2.textContent = "\u041D\u0435 \u0441\u043E\u0445\u0440\u0430\u043D\u0451\u043D \u2014 \u0431\u0435\u0437 \u0442\u043E\u043A\u0435\u043D\u0430 \u0433\u0440\u0443\u043F\u043F\u044B: \u044D\u0442\u0430\u043B\u043E\u043D / \u043D\u0435 \u0432 \u044D\u0442\u0430\u043B\u043E\u043D\u0435";
      status2.className = "status-text status-warn";
      if (input) input.placeholder = "figd_\u2026";
    }
  }
  function initFigmaTokenUi() {
    var _a, _b;
    (_a = document.getElementById("save-figma-token")) == null ? void 0 : _a.addEventListener("click", () => {
      var _a2;
      const input = document.getElementById("figma-token-input");
      const token = ((_a2 = input == null ? void 0 : input.value) == null ? void 0 : _a2.trim()) || "";
      parent.postMessage({ pluginMessage: { type: "save-figma-token", token } }, "*");
      if (input) input.value = "";
    });
    (_b = document.getElementById("clear-figma-token")) == null ? void 0 : _b.addEventListener("click", () => {
      parent.postMessage({ pluginMessage: { type: "save-figma-token", token: "" } }, "*");
      const input = document.getElementById("figma-token-input");
      if (input) input.value = "";
    });
    parent.postMessage({ pluginMessage: { type: "get-figma-token" } }, "*");
  }
  var init_figma_token_ui = __esm({
    "src/ui/self-check/figma-token-ui.ts"() {
      "use strict";
    }
  });

  // src/ui/ui.ts
  var require_ui = __commonJS({
    "src/ui/ui.ts"(exports) {
      init_handlers();
      init_results_ui();
      init_results();
      init_snapshot_status();
      init_handlers2();
      init_figma_token_ui();
      initScanButton();
      initMigrateButton();
      initCopyButton();
      initDetachButton();
      initTabs();
      initGroupSwitch();
      initSelfCheckResults();
      initSnapshotUi();
      initLibrariesTab();
      initFigmaTokenUi();
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
      var isExpanded = false;
      var sizeBtn = document.getElementById("toggle-size");
      var expandSVG = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9.76502 1.60001H14.3995M14.3995 1.60001V6.23449M14.3995 1.60001L8.9926 7.00691M6.23483 14.4H1.60034M1.60034 14.4V9.76552M1.60034 14.4L7.00724 8.99311" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
      var collapseSVG = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.00724 13.6275L7.00724 8.99304L2.37276 8.99304M7.00724 8.99304L1.60034 14.3999M8.99253 2.37248V7.00697L13.627 7.00697M8.99253 7.00697L14.3994 1.60007" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
      sizeBtn.onclick = () => {
        var _a2, _b;
        isExpanded = !isExpanded;
        sizeBtn.innerHTML = isExpanded ? collapseSVG : expandSVG;
        (_a2 = document.getElementById("page-migrator")) == null ? void 0 : _a2.classList.toggle("expanded", isExpanded);
        (_b = document.getElementById("page-libraries")) == null ? void 0 : _b.classList.toggle("expanded", isExpanded);
        parent.postMessage({ pluginMessage: { type: "resize", expanded: isExpanded } }, "*");
      };
      document.getElementById("scan-selection").onclick = () => {
        parent.postMessage({ pluginMessage: { type: "scan-selection" } }, "*");
      };
      document.getElementById("scan-page").onclick = () => {
        parent.postMessage({ pluginMessage: { type: "scan-page" } }, "*");
      };
      document.getElementById("update-snapshot").onclick = () => {
        const btn = document.getElementById("update-snapshot");
        btn.disabled = true;
        document.getElementById("update-snapshot-text").textContent = "\u23F3 \u0421\u043A\u0430\u043D\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u0435...";
        const version = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10).replace(/-/g, ".");
        parent.postMessage({ pluginMessage: { type: "update-snapshot", version } }, "*");
      };
      window.onmessage = (event) => __async(null, null, function* () {
        const pluginMessage = event.data.pluginMessage;
        if (!pluginMessage) return;
        if (pluginMessage.type === "init-theme") {
          isDarkTheme = pluginMessage.theme === "dark";
          applyTheme();
        }
        if (pluginMessage.type === "figma-token-info") {
          applyTokenStatus(pluginMessage);
        }
        handleMigratorMessage(pluginMessage);
        handleLibrariesMessage(pluginMessage);
        if (pluginMessage.type === "snapshot-progress") {
          showScanProgress(pluginMessage);
        }
        if (pluginMessage.type === "snapshot-info") {
          if (pluginMessage.hasLocal) {
            applyLocalMeta(pluginMessage);
          } else {
            applyLocalMeta(null);
          }
          checkRemoteVersion();
        }
        if (pluginMessage.type === "snapshot-saved") {
          const btn = document.getElementById("update-snapshot");
          if (btn) {
            btn.disabled = false;
            document.getElementById("update-snapshot-text").textContent = "\u041E\u0442\u0441\u043A\u0430\u043D\u0438\u0440\u043E\u0432\u0430\u0442\u044C UI-Kit";
          }
          applyLocalMeta(pluginMessage);
          showScanStats(pluginMessage);
          checkRemoteVersion();
        }
        if (pluginMessage.type === "snapshot-scan-error") {
          const btn = document.getElementById("update-snapshot");
          if (btn) {
            btn.disabled = false;
            document.getElementById("update-snapshot-text").textContent = "\u041E\u0442\u0441\u043A\u0430\u043D\u0438\u0440\u043E\u0432\u0430\u0442\u044C UI-Kit";
          }
          const text1 = document.getElementById("scan-status-text1");
          const text2 = document.getElementById("scan-status-text2");
          if (text1) {
            text1.textContent = pluginMessage.message || "\u041E\u0448\u0438\u0431\u043A\u0430 \u0441\u043A\u0430\u043D\u0430 UI-Kit";
            text1.className = "status-text status-error";
          }
          if (text2) text2.style.display = "none";
        }
        if (pluginMessage.type === "snapshot-remote-saved") {
          onRemoteSaved(pluginMessage);
        }
        if (pluginMessage.type === "snapshot-remote-error") {
          const btn = document.getElementById("download-snapshot");
          const label = document.getElementById("download-snapshot-text");
          if (btn) btn.disabled = false;
          if (label) label.textContent = "\u041E\u0431\u043D\u043E\u0432\u0438\u0442\u044C \u044D\u0442\u0430\u043B\u043E\u043D \u0441 GitHub";
          const text1 = document.getElementById("scan-status-text1");
          if (text1) {
            text1.textContent = pluginMessage.message || "\u041E\u0448\u0438\u0431\u043A\u0430 \u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0438\u044F \u044D\u0442\u0430\u043B\u043E\u043D\u0430";
            text1.className = "status-text status-error";
          }
        }
        if (pluginMessage.type === "snapshot-export") {
          downloadJson("meta.json", pluginMessage.meta);
          downloadJson("snapshot.json", {
            version: pluginMessage.meta.version,
            u: pluginMessage.storage.u,
            f: pluginMessage.storage.f,
            pagesScanned: pluginMessage.meta.pagesScanned,
            pagesTotal: pluginMessage.meta.pagesTotal,
            c: pluginMessage.storage.c
          });
        }
        if (pluginMessage.type === "scan-start") {
          setScanStart();
        }
        if (pluginMessage.type === "scan-loading-pages") {
          setScanLoadingPages();
        }
        if (pluginMessage.type === "scan-progress") {
          setScanProgress(pluginMessage.count, pluginMessage.total, pluginMessage.label);
        }
        if (pluginMessage.type === "scan-results") {
          onScanResults(pluginMessage);
          handleMigratorMessage({
            type: "SCAN_COMPLETE",
            result: pluginMessage.migratorResult,
            elapsed: pluginMessage.elapsed
          });
        }
      });
    }
  });
  require_ui();
})();
