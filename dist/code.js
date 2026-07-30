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
  var __objRest = (source, exclude) => {
    var target = {};
    for (var prop in source)
      if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
        target[prop] = source[prop];
    if (source != null && __getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(source)) {
        if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
          target[prop] = source[prop];
      }
    return target;
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
      var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
      step((generator = generator.apply(__this, __arguments)).next());
    });
  };

  // src/plugin/ds_names.ts
  var DS_COMPONENT_NAMES;
  var init_ds_names = __esm({
    "src/plugin/ds_names.ts"() {
      "use strict";
      DS_COMPONENT_NAMES = /* @__PURE__ */ new Set([
        "front/theme/wow-button-accent-border-image",
        "front/theme/wow-button-accent-sprite",
        "front/theme/wow-button-accent-border-image-mask",
        "front/theme/wow-button-base-primary-s-border-image",
        "front/theme/wow-button-base-primary-m-border-image",
        "front/theme/wow-button-base-primary-s-sprite",
        "front/theme/wow-button-base-primary-l-border-image",
        "front/theme/wow-button-base-primary-m-sprite",
        "front/theme/wow-button-base-primary-l-sprite",
        "front/theme/wow-button-base-secondary-s-sprite",
        "front/theme/wow-button-base-secondary-l-border-image",
        "front/theme/wow-button-base-secondary-m-border-image",
        "front/theme/wow-button-base-secondary-s-border-image",
        "front/theme/wow-button-base-secondary-m-sprite",
        "front/theme/wow-button-base-secondary-l-sprite",
        "front/theme/wow-button-base-vip-s-sprite",
        "front/theme/wow-button-base-vip-l-border-image",
        "front/theme/wow-button-base-vip-m-border-image",
        "front/theme/wow-button-base-vip-s-border-image",
        "front/theme/wow-button-base-vip-m-sprite",
        "front/theme/wow-button-base-vip-l-sprite",
        "front/theme/wow-button-base-danger-s-sprite",
        "front/theme/wow-button-base-danger-l-border-image",
        "front/theme/wow-button-base-danger-m-border-image",
        "front/theme/wow-button-base-danger-s-border-image",
        "front/theme/wow-button-base-danger-m-sprite",
        "front/theme/wow-button-base-danger-l-sprite",
        "front/theme/wow-button-navigation-primary-l-background-image",
        "front/theme/wow-button-navigation-primary-m-background-image",
        "front/theme/wow-button-navigation-primary-s-background-image",
        "front/theme/wow-button-navigation-secondary-l-background-image",
        "front/theme/wow-button-navigation-secondary-m-background-image",
        "front/theme/wow-button-navigation-secondary-s-background-image",
        "front/theme/wow-button-navigation-vip-l-background-image",
        "front/theme/wow-button-navigation-vip-m-background-image",
        "front/theme/wow-button-navigation-vip-s-background-image",
        "front/theme/wow-segment-control-secondary-s-sprite",
        "front/theme/wow-segment-control-secondary-l-border-image",
        "front/theme/wow-segment-control-secondary-m-border-image",
        "front/theme/wow-segment-control-secondary-s-border-image",
        "front/theme/wow-segment-control-secondary-m-sprite",
        "front/theme/wow-segment-control-secondary-l-sprite",
        "front/theme/wow-input-basic-sprite",
        "front/theme/wow-input-basic-border-image",
        "front/theme/wow-notification-border-image",
        "front/theme/wow-notification-sprite",
        "front/theme/wow-modal-default-border-image",
        "front/theme/wow-modal-default-border-sprite",
        "front/theme/wow-modal-default-overlay-image",
        "front/theme/wow-modal-halloween-border-image",
        "front/theme/wow-modal-halloween-border-sprite",
        "front/theme/wow-modal-halloween-overlay-image",
        "front/theme/wow-modal-newyear-border-image",
        "front/theme/wow-modal-newyear-border-sprite",
        "front/theme/wow-modal-newyear-overlay-image",
        ".item/wow-button-base-primary-s-border-image",
        ".item/wow-button-base-primary-m-border-image",
        ".item/wow-button-base-primary-l-border-image",
        ".item/wow-button-base-secondary-s-border-image",
        ".item/wow-button-base-secondary-m-border-image",
        ".item/wow-button-base-secondary-l-border-image",
        ".item/wow-button-base-vip-s-border-image",
        ".item/wow-button-base-vip-m-border-image",
        ".item/wow-button-base-vip-l-border-image",
        ".item/wow-button-base-danger-s-border-image",
        ".item/wow-button-base-danger-m-border-image",
        ".item/wow-button-base-danger-l-border-image",
        ".item/wow-button-accent-border-image",
        ".item/wow-button-accent-border-image-mask",
        ".item//wow-segment-control-secondary-s-border-image",
        ".item//wow-segment-control-secondary-m-border-image",
        ".item//wow-segment-control-secondary-l-border-image",
        ".item/wow-input-basic-border-image",
        ".item/wow-notification-border-image",
        ".item/wow-modal-default-border-image",
        ".item/wow-modal-newyear-border-image",
        ".item/wow-modal-halloween-border-image",
        ".item/game-card-border-image",
        ".item/sidebar-border-image",
        ".item/banner-border-image",
        ".item/banner-secondary-border-image",
        ".item/activity-card-border-image",
        ".item/base-card-border-image",
        ".item/small-card-border-image",
        "front/components/wow/game-card-sprite",
        "front/components/wow/game-card-border-image",
        "front/components/wow/sidebar-border-image",
        "front/components/wow/sidebar-sprite",
        "front/components/wow/sidebar-overlay-image",
        "front/components/wow/banner-overlay-image",
        "front/components/wow/banner-sprite",
        "front/components/wow/banner-secondary-sprite",
        "front/components/wow/banner-secondary-border-image",
        "front/components/wow/banner-border-image",
        "front/components/wow/bigwin-background",
        "front/components/wow/bigwin-background-mobile",
        "front/components/wow/provider-background-image",
        "front/components/wow/card-event-overlay-image",
        "front/components/wow/card-loyalty-overlay-image",
        "front/components/wow/menu-overlay-image",
        "front/components/wow/header-mobile-overlay-image",
        "front/components/wow/header-desktop-overlay-image",
        "front/components/wow/header-mobile-newyear-overlay-image",
        "front/components/wow/header-mobile-halloween-overlay-image",
        "front/components/wow/header-desktop-newyear-overlay-image",
        "front/components/wow/header-desktop-halloween-overlay-image",
        "front/components/wow/footer-bg",
        "front/components/wow/footer-bg-mobile",
        "front/components/wow/activity-card-sprite",
        "front/components/wow/activity-card-border-image",
        "front/components/wow/base-card-sprite",
        "front/components/wow/base-card-border-image",
        "front/components/wow/small-card-border-image",
        "front/components/wow/small-card-sprite",
        "front/components/wow/tournament-card-overlay-image",
        "front/components/wow/wheel-card-overlay-image",
        "front/components/wow/mission-card-overlay-image",
        "front/components/wow/lotteries-card-overlay-image",
        "front/components/wow/promo-card-overlay-image",
        "front/components/wow/calendar-card-overlay-image",
        "front/components/wow/store-card-overlay-image",
        "front/components/wow/activity-card-overlay-image",
        "front/components/wow/cashback-card-overlay-image",
        "front/components/wow/bonus-card-overlay-image",
        "front/components/wow/body-mobile",
        "front/components/wow/body-desktop",
        "front/components/wow/halloween-body-desktop",
        "front/components/wow/halloween-body-mobile",
        "front/components/wow/newyear-body-desktop",
        "front/components/wow/newyear-body-mobile",
        "_docCardHeader",
        "_swapContent",
        "WowAccentButton",
        "WowProgress",
        "Accordion",
        "Avatar",
        "Rakeback",
        "Badge \u2014 Primary",
        "Badge \u2014 Secondary",
        "Badge \u2014 Info",
        "Badge \u2014 Minor",
        "Badge \u2014 Success",
        "Badge \u2014 Attention",
        "Badge \u2014 Warning",
        "Badge \u2014 Danger",
        "Badge \u2014 Light",
        "Badge \u2014 Dark",
        "Badge \u2014 Transparent",
        "Badge \u2014 Jackpot",
        "Badge \u2014 VIP",
        "Button Fill \u2014 Primary",
        "Button Fill \u2014 Secondary",
        "Button Fill \u2014 VIP",
        "Button Fill \u2014 Danger",
        "Button Store \u2014 Basic",
        "Button Link \u2014 Primary",
        "Button Link \u2014 Secondary",
        "Button Navigation \u2014 Primary",
        "Button Navigation \u2014 Secondary",
        "Button Navigation \u2014 VIP",
        "Button Social",
        "Horizontal Buttons",
        "Vertical Buttons",
        "Game Image",
        "Countdown",
        "Counter \u2014 Primary",
        "Counter \u2014 Secondary",
        "Counter \u2014 Info",
        "Counter \u2014 Minor",
        "Counter \u2014 Success",
        "Counter \u2014 Attention",
        "Counter \u2014 Warning",
        "Counter \u2014 Danger",
        "Counter \u2014 Light",
        "Counter \u2014 Dark",
        "Counter \u2014 Transparent",
        "Counter \u2014 VIP",
        "Dots Bar",
        "Message \u2014 Basic",
        "Message \u2014 Primary",
        "Message \u2014 Info",
        "Message \u2014 Success",
        "Message \u2014 Attention",
        "Message \u2014 Warning",
        "Message \u2014 Danger",
        "Message \u2014 Minor",
        "Message Line",
        "Notification",
        "Icon Desktop",
        "Icon Mobile",
        "Preloader \u2014 Secondary",
        "Progress Bar \u2014 Primary",
        "Progress Bar \u2014 Secondary",
        "Progress Bar \u2014 Info",
        "Progress Bar \u2014 Minor",
        "Progress Bar \u2014 Success",
        "Progress Bar \u2014 Attention",
        "Progress Bar \u2014 VIP",
        "Progress Bar \u2014 Accent",
        "Progress Bar \u2014 Danger",
        "Progress Bar \u2014 Light",
        "Progress Round \u2014 Primary",
        "Progress Round \u2014 Secondary",
        "Progress Round \u2014 Info",
        "Progress Round \u2014 Minor",
        "Progress Round \u2014 Success",
        "Progress Round \u2014 Attention",
        "Progress Round \u2014 Danger",
        "Progress Round \u2014 Light",
        "Scrollbar",
        "Vertical Steps",
        "Horizonal Steps",
        "Header Table \u2014 Fill",
        "Header Table \u2014 Lineal",
        "Row Table \u2014 Fill",
        "Row Table \u2014 Lineal",
        "Table Modal",
        "Tabs Fill \u2014 Secondary",
        "Tabs Underline \u2014 Primary",
        "Tab Underline S \u2014 Primary",
        "Tab Underline M \u2014 Primary",
        "Tab Underline L \u2014 Primary",
        "Tab S \u2014 Secondary",
        "Tab M \u2014 Secondary",
        "Tab L \u2014 Secondary",
        "Tag \u2014 Fill",
        "Tag \u2014 Outline",
        "Tag \u2014 Ghost",
        "Tag \u2014 Ghost Secondary",
        "Title \u2014 Basic",
        "Title \u2014 VIP",
        "Row Dropdown S \u2014 Basic",
        "Row Dropdown M \u2014 Basic",
        "List S \u2014 Basic",
        "List M \u2014 Basic",
        "Icon Color Desktop \u2014 Modal",
        "Icon Color Mobile \u2014 Modal",
        "Status Desktop \u2014 Modal",
        "Status Mobile \u2014 Modal",
        "Modal",
        "Modal Fullscreen",
        "Header Desktop \u2014 Modal",
        "Header Mobile \u2014 Modal",
        "Body Desktop \u2014 Modal",
        "Body Mobile \u2014 Modal",
        "Tooltip",
        "Checkbox \u2014 Basic",
        "Checkbox \u2014 Primary",
        "Radiobutton \u2014 Basic",
        "Radiobutton \u2014 Primary",
        "Switcher \u2014 Basic",
        "Switcher \u2014 Primary",
        "Horizontal Field \u2014 Basic",
        "Input \u2014 Basic",
        "Input Multy \u2014 Basic",
        "Combobox \u2014 Basic",
        "Textaria  \u2014 Basic",
        "Vertical Field \u2014 Basic",
        "Dropdown"
      ]);
    }
  });

  // src/plugin/cache.ts
  function clearCaches() {
    variableCache.clear();
    styleCache.clear();
  }
  function getCachedVariableSync(id) {
    if (variableCache.has(id)) return variableCache.get(id);
    return void 0;
  }
  function getCachedVariable(id) {
    return __async(this, null, function* () {
      var _a;
      const syncRes = getCachedVariableSync(id);
      if (syncRes !== void 0) return syncRes;
      try {
        const variable = yield figma.variables.getVariableByIdAsync(id);
        if (!variable) {
          variableCache.set(id, null);
          return null;
        }
        const collection = yield figma.variables.getVariableCollectionByIdAsync(variable.variableCollectionId);
        const collectionName = (_a = collection == null ? void 0 : collection.name) != null ? _a : "";
        const result = {
          name: variable.name,
          collectionName,
          isPrimitive: collectionName.toLowerCase() === "primitives"
        };
        variableCache.set(id, result);
        return result;
      } catch (e) {
        variableCache.set(id, null);
        return null;
      }
    });
  }
  function getCachedStyleNameSync(id) {
    if (styleCache.has(id)) return styleCache.get(id);
    return void 0;
  }
  function getCachedStyleName(id) {
    return __async(this, null, function* () {
      var _a;
      const syncRes = getCachedStyleNameSync(id);
      if (syncRes !== void 0) return syncRes;
      try {
        const style = yield figma.getStyleByIdAsync(id);
        const name = (_a = style == null ? void 0 : style.name) != null ? _a : null;
        styleCache.set(id, name);
        return name;
      } catch (e) {
        styleCache.set(id, null);
        return null;
      }
    });
  }
  var variableCache, styleCache;
  var init_cache = __esm({
    "src/plugin/cache.ts"() {
      "use strict";
      variableCache = /* @__PURE__ */ new Map();
      styleCache = /* @__PURE__ */ new Map();
    }
  });

  // src/plugin/extractors.ts
  function rgbToHex(r, g, b) {
    const toHex = (c) => {
      const hex = Math.round(c * 255).toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    };
    return "#" + (toHex(r) + toHex(g) + toHex(b)).toUpperCase();
  }
  function extractFills(node) {
    return __async(this, null, function* () {
      var _a;
      if (!("fills" in node)) return void 0;
      const fills = node.fills;
      if (fills === figma.mixed) return "mixed";
      if (!fills || fills.length === 0) return void 0;
      const boundFills = (_a = node.boundVariables) == null ? void 0 : _a.fills;
      const result = [];
      for (let i = 0; i < fills.length; i++) {
        const bound = boundFills == null ? void 0 : boundFills[i];
        if ((bound == null ? void 0 : bound.type) === "VARIABLE_ALIAS") {
          const cached = yield getCachedVariable(bound.id);
          result.push(cached ? cached.name : "variable");
        } else if (fills[i].type === "SOLID") {
          const solid = fills[i];
          result.push(rgbToHex(solid.color.r, solid.color.g, solid.color.b));
        } else {
          result.push(fills[i].type.toLowerCase());
        }
      }
      return result.join(", ");
    });
  }
  function extractStrokes(node) {
    return __async(this, null, function* () {
      var _a;
      if (!("strokes" in node)) return void 0;
      const strokes = node.strokes;
      if (!strokes || strokes.length === 0) return void 0;
      const boundStrokes = (_a = node.boundVariables) == null ? void 0 : _a.strokes;
      const result = [];
      for (let i = 0; i < strokes.length; i++) {
        const bound = boundStrokes == null ? void 0 : boundStrokes[i];
        if ((bound == null ? void 0 : bound.type) === "VARIABLE_ALIAS") {
          const cached = yield getCachedVariable(bound.id);
          result.push(cached ? cached.name : "variable");
        } else if (strokes[i].type === "SOLID") {
          const solid = strokes[i];
          result.push(rgbToHex(solid.color.r, solid.color.g, solid.color.b));
        } else {
          result.push(strokes[i].type.toLowerCase());
        }
      }
      return result.join(", ");
    });
  }
  function extractRadius(node) {
    if (!("cornerRadius" in node)) return void 0;
    if (node.cornerRadius === figma.mixed) {
      const r = `${node.topLeftRadius},${node.topRightRadius},${node.bottomRightRadius},${node.bottomLeftRadius}`;
      return r === "0,0,0,0" ? void 0 : r;
    }
    return node.cornerRadius === 0 ? void 0 : String(node.cornerRadius);
  }
  function extractPadding(node) {
    if (!("paddingLeft" in node)) return void 0;
    const p = `${node.paddingTop},${node.paddingRight},${node.paddingBottom},${node.paddingLeft}`;
    return p === "0,0,0,0" ? void 0 : p;
  }
  function extractItemSpacing(node) {
    if (!("itemSpacing" in node)) return void 0;
    return node.itemSpacing === 0 ? void 0 : String(node.itemSpacing);
  }
  function extractFont(node) {
    if (node.type !== "TEXT") return void 0;
    const font = node.fontName;
    if (font === figma.mixed) return "mixed";
    return `${font.family} ${font.style}, ${node.fontSize}px`;
  }
  var init_extractors = __esm({
    "src/plugin/extractors.ts"() {
      "use strict";
      init_cache();
    }
  });

  // src/plugin/validators/components.ts
  function validateComponent(node, results, snapshot = null, breadcrumb = "") {
    return __async(this, null, function* () {
      var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q;
      if (node.type === "INSTANCE") {
        const mc = node.mainComponent;
        if (snapshot && mc) {
          if (mc.remote) {
            const known = (mc == null ? void 0 : mc.remote) ? snapshot == null ? void 0 : snapshot.get(mc.key) : void 0;
            if (!known) {
              const parentName = ((_a = mc.parent) == null ? void 0 : _a.type) === "COMPONENT_SET" ? mc.parent.name : null;
              const isDS = DS_COMPONENT_NAMES.has(mc.name) || parentName && DS_COMPONENT_NAMES.has(parentName);
              if (isDS) {
                const displayName = parentName ? `${parentName} / ${mc.name}` : mc.name;
                results.components.push({
                  nodeId: node.id,
                  name: node.name,
                  breadcrumb,
                  severity: "error",
                  errorType: `\u0423\u0441\u0442\u0430\u0440\u0435\u0432\u0448\u0438\u0439 \u043A\u043E\u043C\u043F\u043E\u043D\u0435\u043D\u0442 \u0414\u0421: "${displayName}" \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D \u0432 \u044D\u0442\u0430\u043B\u043E\u043D\u0435`,
                  count: 1
                });
              }
            } else if (known.n !== mc.name) {
              const displayName = known.p ? `${known.p} / ${known.n}` : known.n;
              results.components.push({
                nodeId: node.id,
                name: node.name,
                breadcrumb,
                severity: "error",
                errorType: `\u041F\u0435\u0440\u0435\u0438\u043C\u0435\u043D\u043E\u0432\u0430\u043D \u0432 \u043A\u0438\u0442\u0435 \u2192 \u0442\u0435\u043F\u0435\u0440\u044C: "${displayName}"`,
                count: 1
              });
            }
          }
        }
        const overrides = node.overrides;
        if (overrides && overrides.length > 0) {
          const known = (mc == null ? void 0 : mc.remote) ? snapshot == null ? void 0 : snapshot.get(mc.key) : void 0;
          if (known) {
            for (const override of overrides) {
              const badFields = override.overriddenFields.filter((f) => OVERRIDE_KEYS.has(f));
              if (badFields.length > 0) {
                try {
                  let innerNode = figma.getNodeById(override.id);
                  if (!innerNode) {
                    innerNode = yield figma.getNodeByIdAsync(override.id);
                  }
                  if (!innerNode) continue;
                  let path = innerNode.name;
                  const originalLayerStr = (_b = known == null ? void 0 : known.l) == null ? void 0 : _b[path];
                  const originalLayer = {};
                  if (originalLayerStr) {
                    originalLayerStr.split("|").forEach((part) => {
                      const sep = part.indexOf(":");
                      if (sep > 0) originalLayer[part.substring(0, sep)] = part.substring(sep + 1);
                    });
                  }
                  let handledPadding = false;
                  let handledFont = false;
                  for (const field of badFields) {
                    const translated = OVERRIDE_NAMES[field] || field;
                    let originalValue = "?";
                    let currentValue = "?";
                    let fieldName = translated;
                    if (field === "fills") {
                      originalValue = (_c = originalLayer.f) != null ? _c : "none";
                      currentValue = (_d = yield extractFills(innerNode)) != null ? _d : "none";
                    } else if (field === "strokes") {
                      originalValue = (_e = originalLayer.s) != null ? _e : "none";
                      currentValue = (_f = yield extractStrokes(innerNode)) != null ? _f : "none";
                    } else if (field === "cornerRadius") {
                      originalValue = (_g = originalLayer.r) != null ? _g : "0";
                      currentValue = (_h = extractRadius(innerNode)) != null ? _h : "0";
                    } else if (field.startsWith("padding")) {
                      if (handledPadding) continue;
                      handledPadding = true;
                      fieldName = "\u041E\u0442\u0441\u0442\u0443\u043F\u044B";
                      originalValue = (_i = originalLayer.p) != null ? _i : "0,0,0,0";
                      currentValue = (_j = extractPadding(innerNode)) != null ? _j : "0,0,0,0";
                    } else if (field === "itemSpacing") {
                      originalValue = (_k = originalLayer.i) != null ? _k : "0";
                      currentValue = (_l = extractItemSpacing(innerNode)) != null ? _l : "0";
                    } else if (field === "fontName" || field === "fontSize") {
                      if (handledFont) continue;
                      handledFont = true;
                      fieldName = "\u0428\u0440\u0438\u0444\u0442";
                      originalValue = (_m = originalLayer.t) != null ? _m : "mixed";
                      currentValue = (_n = extractFont(innerNode)) != null ? _n : "mixed";
                    }
                    if (originalValue !== currentValue) {
                      results.components.push({
                        nodeId: innerNode.id,
                        name: node.name,
                        breadcrumb,
                        severity: "warning",
                        errorType: `\u0418\u0437\u043C\u0435\u043D\u0435\u043D\u043E "${fieldName}" \u0443 [${innerNode.name}]: ${originalValue} \u2192 ${currentValue}`,
                        count: 1
                      });
                    }
                  }
                } catch (e) {
                  const translatedFields = badFields.map((f) => OVERRIDE_NAMES[f] || f);
                  results.components.push({
                    nodeId: node.id,
                    name: node.name,
                    breadcrumb,
                    severity: "warning",
                    errorType: `\u0418\u0437\u043C\u0435\u043D\u0435\u043D\u044B: ${translatedFields.join(", ")}`,
                    count: 1
                  });
                }
              }
            }
          }
        }
      }
      if (node.type === "FRAME" && DS_COMPONENT_NAMES.has(node.name)) {
        if (((_o = node.parent) == null ? void 0 : _o.type) !== "COMPONENT" && ((_p = node.parent) == null ? void 0 : _p.type) !== "COMPONENT_SET") {
          results.components.push({
            nodeId: node.id,
            name: node.name,
            breadcrumb,
            severity: "error",
            errorType: "\u0420\u0430\u0437\u0434\u0435\u0442\u0430\u0447\u0435\u043D\u043D\u044B\u0439 \u043A\u043E\u043C\u043F\u043E\u043D\u0435\u043D\u0442 (Frame \u0441 \u0438\u043C\u0435\u043D\u0435\u043C \u043C\u0430\u0441\u0442\u0435\u0440\u0430 \u0414\u0421)",
            count: 1
          });
        }
      }
      if (node.type === "COMPONENT_SET" || node.type === "COMPONENT" && ((_q = node.parent) == null ? void 0 : _q.type) !== "COMPONENT_SET") {
        if (DS_COMPONENT_NAMES.has(node.name)) {
          results.components.push({
            nodeId: node.id,
            name: node.name,
            breadcrumb,
            severity: "error",
            errorType: "\u041B\u043E\u043A\u0430\u043B\u044C\u043D\u044B\u0439 \u043C\u0430\u0441\u0442\u0435\u0440-\u043A\u043E\u043C\u043F\u043E\u043D\u0435\u043D\u0442 (\u0434\u0443\u0431\u043B\u0438\u043A\u0430\u0442 \u0414\u0421)",
            count: 1
          });
        } else {
          results.components.push({
            nodeId: node.id,
            name: node.name,
            breadcrumb,
            severity: "info",
            errorType: "\u041B\u043E\u043A\u0430\u043B\u044C\u043D\u044B\u0439 \u043A\u0430\u0441\u0442\u043E\u043C\u043D\u044B\u0439 \u043A\u043E\u043C\u043F\u043E\u043D\u0435\u043D\u0442",
            count: 1
          });
        }
      }
    });
  }
  var OVERRIDE_NAMES, OVERRIDE_KEYS;
  var init_components = __esm({
    "src/plugin/validators/components.ts"() {
      "use strict";
      init_ds_names();
      init_extractors();
      OVERRIDE_NAMES = {
        fills: "\u0417\u0430\u043B\u0438\u0432\u043A\u0430",
        strokes: "\u041E\u0431\u0432\u043E\u0434\u043A\u0430",
        cornerRadius: "\u0421\u043A\u0440\u0443\u0433\u043B\u0435\u043D\u0438\u0435",
        paddingLeft: "\u041B\u0435\u0432\u044B\u0439 \u043E\u0442\u0441\u0442\u0443\u043F",
        paddingRight: "\u041F\u0440\u0430\u0432\u044B\u0439 \u043E\u0442\u0441\u0442\u0443\u043F",
        paddingTop: "\u0412\u0435\u0440\u0445\u043D\u0438\u0439 \u043E\u0442\u0441\u0442\u0443\u043F",
        paddingBottom: "\u041D\u0438\u0436\u043D\u0438\u0439 \u043E\u0442\u0441\u0442\u0443\u043F",
        itemSpacing: "\u041E\u0442\u0441\u0442\u0443\u043F \u043C\u0435\u0436\u0434\u0443",
        fontName: "\u0428\u0440\u0438\u0444\u0442",
        fontSize: "\u0420\u0430\u0437\u043C\u0435\u0440 \u0448\u0440\u0438\u0444\u0442\u0430"
      };
      OVERRIDE_KEYS = new Set(Object.keys(OVERRIDE_NAMES));
    }
  });

  // src/plugin/textVariablesWhitelist.ts
  var VALID_TEXT_VARIABLES;
  var init_textVariablesWhitelist = __esm({
    "src/plugin/textVariablesWhitelist.ts"() {
      "use strict";
      VALID_TEXT_VARIABLES = /* @__PURE__ */ new Set([
        "text/title",
        "text/base",
        "text/secondary",
        "text/muted",
        "text/transparent",
        "text/primary",
        "text/minor",
        "text/info",
        "text/success",
        "text/attention",
        "text/warning",
        "text/danger",
        "text/vip",
        "text-inverse/title",
        "text-inverse/base",
        "text-inverse/secondary",
        "text-inverse/muted",
        "text-inverse/transparent",
        "text/on/primary",
        "text/on/secondary",
        "text/on/danger",
        "text/on/success",
        "text/on/vip",
        "title/basic/text-color",
        "title/basic/description-color",
        "modal-description-color-accent",
        "utilities/game-card/like/text-color",
        "utilities/game-card/like/text-color-active",
        "utilities/game-card/like/text-color-checked",
        "utilities/game-card/like/text-color-hover",
        "utilities/game-card/live/bet/text-color",
        "utilities/game-card/live/seat/text-color",
        "utilities/game-card/title/game-text-color-finish",
        "utilities/game-card/title/game-text-color-start",
        "utilities/game-card/title/provider-text-color",
        "utilities/navbar/text-color",
        "utilities/navbar/text-color-active",
        "utilities/navbar/text-color-hover",
        "utilities/footer/menu/text-color",
        "utilities/footer/menu/text-color-hover",
        "utilities/menu/top/amount/text-color",
        "utilities/menu/top/amount/text-color-focus",
        "utilities/menu/top/amount/text-color-hover",
        "utilities/user-menu/description-color",
        "utilities/user-menu/email-text-color",
        "utilities/user-menu/header-text-color",
        "utilities/user-menu/text-color",
        "utilities/user-menu/title-color",
        "utilities/user-menu/value-color",
        "utilities/footer/description-color",
        "utilities/footer/link-text-color",
        "utilities/footer/text-color",
        "utilities/footer/title-color",
        "utilities/sidebar-card/referal/description-color",
        "utilities/sidebar-card/referal/description-color-hover",
        "utilities/sidebar-card/referal/text-color",
        "utilities/sidebar-card/referal/text-color-hover",
        "utilities/sidebar-card/widget/description-color",
        "utilities/sidebar-card/widget/description-color-hover",
        "utilities/sidebar-card/widget/text-color",
        "utilities/sidebar-card/widget/text-color-hover",
        "utilities/sidebar-list/header/text-color",
        "utilities/sidebar-list/header/text-color-hover",
        "utilities/sidebar-list/row/text-color",
        "utilities/sidebar-list/row/text-color-hover"
      ]);
    }
  });

  // src/plugin/validators/variables.ts
  function rgbToHex2(r, g, b) {
    const toHex = (c) => {
      const hex = Math.round(c * 255).toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    };
    return "#" + (toHex(r) + toHex(g) + toHex(b)).toUpperCase();
  }
  function clearVariablesValidatorCache() {
    paintCache.clear();
  }
  function checkPaints(node, results, paints, boundVars, context, breadcrumb) {
    return __async(this, null, function* () {
      const cacheKey = JSON.stringify(paints) + "|" + JSON.stringify(boundVars) + "|" + context;
      if (paintCache.has(cacheKey)) {
        const cachedErrors = paintCache.get(cacheKey);
        for (const err of cachedErrors) {
          results.variables.push({
            nodeId: node.id,
            name: node.name,
            breadcrumb,
            severity: err.severity,
            errorType: err.errorType,
            count: 1
          });
        }
        return;
      }
      const generatedErrors = [];
      for (let i = 0; i < paints.length; i++) {
        if (paints[i].visible === false) {
          generatedErrors.push({
            severity: "info",
            errorType: `\u0421\u043A\u0440\u044B\u0442\u0430\u044F \u0437\u0430\u043B\u0438\u0432\u043A\u0430/\u043E\u0431\u0432\u043E\u0434\u043A\u0430 (\u0437\u0430\u043A\u0440\u044B\u0442 \u0433\u043B\u0430\u0437\u0438\u043A) \u0432 ${context}`
          });
          continue;
        }
        if (paints[i].type !== "SOLID") continue;
        const boundVar = boundVars == null ? void 0 : boundVars[i];
        if ((boundVar == null ? void 0 : boundVar.type) === "VARIABLE_ALIAS") {
          let cached = getCachedVariableSync(boundVar.id);
          if (cached === void 0) {
            cached = yield getCachedVariable(boundVar.id);
          }
          if (cached == null ? void 0 : cached.isPrimitive) {
            generatedErrors.push({
              severity: "warning",
              errorType: `\u041F\u0440\u0438\u043C\u0438\u0442\u0438\u0432 \u0432\u043C\u0435\u0441\u0442\u043E \u0441\u0435\u043C\u0430\u043D\u0442\u0438\u043A\u0438 (${context}): ${cached.name}`
            });
          }
        } else {
          const solid = paints[i];
          const hex = rgbToHex2(solid.color.r, solid.color.g, solid.color.b);
          if (!IGNORED_HEXES.has(hex)) {
            generatedErrors.push({
              severity: "error",
              errorType: `\u0418\u0441\u043F\u043E\u043B\u044C\u0437\u0443\u0435\u0442\u0441\u044F Hex (${hex}) \u0432 ${context} \u0432\u043C\u0435\u0441\u0442\u043E \u043F\u0435\u0440\u0435\u043C\u0435\u043D\u043D\u043E\u0439`
            });
          }
        }
      }
      paintCache.set(cacheKey, generatedErrors);
      for (const err of generatedErrors) {
        results.variables.push({
          nodeId: node.id,
          name: node.name,
          breadcrumb,
          severity: err.severity,
          errorType: err.errorType,
          count: 1
        });
      }
    });
  }
  function validateVariables(node, results, insideComponent, breadcrumb) {
    return __async(this, null, function* () {
      var _a, _b, _c, _d, _e, _f, _g;
      if (node.type === "SECTION") return;
      const isDirectlyOnPageOrSection = ((_a = node.parent) == null ? void 0 : _a.type) === "PAGE" || ((_b = node.parent) == null ? void 0 : _b.type) === "SECTION";
      if (isDirectlyOnPageOrSection) {
        if (!isIconNode(node)) {
          return;
        }
      }
      if (node.type === "TEXT") {
        if (!insideComponent) return;
        const fills = node.fills;
        let hasColorBinding = false;
        if (fills === figma.mixed) {
          results.variables.push({
            nodeId: node.id,
            name: node.name,
            breadcrumb,
            severity: "error",
            errorType: "\u0421\u043C\u0435\u0448\u0430\u043D\u043D\u044B\u0439 \u0446\u0432\u0435\u0442 \u0443 \u0442\u0435\u043A\u0441\u0442\u0430 (mixed fills)",
            count: 1
          });
          hasColorBinding = true;
        } else if (Array.isArray(fills) && fills.length > 0) {
          const boundVar = (_d = (_c = node.boundVariables) == null ? void 0 : _c.fills) == null ? void 0 : _d[0];
          if ((boundVar == null ? void 0 : boundVar.type) === "VARIABLE_ALIAS") {
            hasColorBinding = true;
            let cached = getCachedVariableSync(boundVar.id);
            if (cached === void 0) cached = yield getCachedVariable(boundVar.id);
            if (cached) {
              if (cached.isPrimitive) {
                results.variables.push({
                  nodeId: node.id,
                  name: node.name,
                  breadcrumb,
                  severity: "warning",
                  errorType: `\u041F\u0440\u0438\u043C\u0438\u0442\u0438\u0432 \u0432\u043C\u0435\u0441\u0442\u043E \u0441\u0435\u043C\u0430\u043D\u0442\u0438\u043A\u0438 (\u0442\u0435\u043A\u0441\u0442): ${cached.name}`,
                  count: 1
                });
              } else if (!VALID_TEXT_VARIABLES.has(cached.name)) {
                results.variables.push({
                  nodeId: node.id,
                  name: node.name,
                  breadcrumb,
                  severity: "warning",
                  errorType: `\u041D\u0435\u043A\u043E\u0440\u0440\u0435\u043A\u0442\u043D\u0430\u044F \u043F\u0435\u0440\u0435\u043C\u0435\u043D\u043D\u0430\u044F \u0442\u0435\u043A\u0441\u0442\u0430: ${cached.name}`,
                  count: 1
                });
              }
            }
          }
        }
        if (!hasColorBinding && fills !== figma.mixed) {
          if (Array.isArray(fills) && fills.length === 0) {
            results.variables.push({
              nodeId: node.id,
              name: node.name,
              breadcrumb,
              severity: "warning",
              errorType: "\u0423 \u0442\u0435\u043A\u0441\u0442\u0430 \u043E\u0442\u0441\u0443\u0442\u0441\u0442\u0432\u0443\u0435\u0442 \u0437\u0430\u043B\u0438\u0432\u043A\u0430 (\u0446\u0432\u0435\u0442)",
              count: 1
            });
          } else {
            let isIgnored = false;
            if (Array.isArray(fills) && ((_e = fills[0]) == null ? void 0 : _e.type) === "SOLID") {
              const solid = fills[0];
              const hex = rgbToHex2(solid.color.r, solid.color.g, solid.color.b);
              if (IGNORED_HEXES.has(hex)) isIgnored = true;
            }
            if (!isIgnored) {
              results.variables.push({
                nodeId: node.id,
                name: node.name,
                breadcrumb,
                severity: "error",
                errorType: "\u041E\u0442\u0432\u044F\u0437\u0430\u043D \u0446\u0432\u0435\u0442 \u0443 \u0442\u0435\u043A\u0441\u0442\u0430 (\u0438\u0441\u043F\u043E\u043B\u044C\u0437\u0443\u0435\u0442\u0441\u044F Hex \u0432\u043C\u0435\u0441\u0442\u043E \u043F\u0435\u0440\u0435\u043C\u0435\u043D\u043D\u043E\u0439)",
                count: 1
              });
            }
          }
        }
        if (node.textStyleId === figma.mixed) {
          results.variables.push({
            nodeId: node.id,
            name: node.name,
            breadcrumb,
            severity: "error",
            errorType: "\u0421\u043C\u0435\u0448\u0430\u043D\u043D\u044B\u0439 \u0441\u0442\u0438\u043B\u044C \u0442\u0435\u043A\u0441\u0442\u0430 (mixed)",
            count: 1
          });
        } else if (!node.textStyleId) {
          results.variables.push({
            nodeId: node.id,
            name: node.name,
            breadcrumb,
            severity: "error",
            errorType: "\u041E\u0442\u0432\u044F\u0437\u0430\u043D \u0441\u0442\u0438\u043B\u044C \u0442\u0435\u043A\u0441\u0442\u0430 (typography)",
            count: 1
          });
        } else if (typeof node.textStyleId === "string") {
          let style = getCachedStyleNameSync(node.textStyleId);
          if (style === void 0) style = yield getCachedStyleName(node.textStyleId);
          if (style === null) {
            results.variables.push({
              nodeId: node.id,
              name: node.name,
              breadcrumb,
              severity: "error",
              errorType: "\u0422\u0435\u043A\u0441\u0442\u043E\u0432\u044B\u0439 \u0441\u0442\u0438\u043B\u044C \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D \u0432 \u0431\u0438\u0431\u043B\u0438\u043E\u0442\u0435\u043A\u0435 (\u0443\u0434\u0430\u043B\u0451\u043D?)",
              count: 1
            });
          }
        }
        return;
      }
      if (node.type === "VECTOR" || node.type === "BOOLEAN_OPERATION") {
        if (!isIconNode(node)) return;
      }
      if ("fills" in node) {
        const fills = node.fills;
        if (fills == null ? void 0 : fills.length) {
          yield checkPaints(node, results, fills, (_f = node.boundVariables) == null ? void 0 : _f.fills, "fills", breadcrumb);
        }
      }
      if ("strokes" in node && node.type !== "COMPONENT_SET") {
        const strokes = node.strokes;
        if (strokes == null ? void 0 : strokes.length) {
          yield checkPaints(node, results, strokes, (_g = node.boundVariables) == null ? void 0 : _g.strokes, "strokes", breadcrumb);
        }
      }
    });
  }
  var IGNORED_HEXES, paintCache;
  var init_variables = __esm({
    "src/plugin/validators/variables.ts"() {
      "use strict";
      init_textVariablesWhitelist();
      init_cache();
      init_scanner();
      IGNORED_HEXES = /* @__PURE__ */ new Set(["#FF8282", "#FFE0E0", "#9747FF"]);
      paintCache = /* @__PURE__ */ new Map();
    }
  });

  // src/plugin/validators/gradients.ts
  function validateGradients(node, results, breadcrumb) {
    return __async(this, null, function* () {
      var _a, _b;
      if (node.type === "VECTOR" || node.type === "BOOLEAN_OPERATION") return;
      if (!("fills" in node) || !node.fills) return;
      if (node.fillStyleId && typeof node.fillStyleId === "string") {
        let styleName = getCachedStyleNameSync(node.fillStyleId);
        if (styleName === void 0) {
          styleName = yield getCachedStyleName(node.fillStyleId);
        }
        if (styleName && isTarget(styleName.toLowerCase())) {
          results.gradients.push({
            nodeId: node.id,
            name: node.name,
            breadcrumb,
            severity: "info",
            errorType: `\u0426\u0435\u043B\u0435\u0432\u043E\u0439 \u0441\u0442\u0438\u043B\u044C: ${styleName}`,
            count: 1
          });
        }
      }
      const fills = node.fills;
      const boundFills = (_a = node.boundVariables) == null ? void 0 : _a.fills;
      const reportedTokens = /* @__PURE__ */ new Set();
      for (let i = 0; i < fills.length; i++) {
        const paint = fills[i];
        const boundVar = boundFills == null ? void 0 : boundFills[i];
        if ((boundVar == null ? void 0 : boundVar.type) === "VARIABLE_ALIAS") {
          let cached = getCachedVariableSync(boundVar.id);
          if (cached === void 0) {
            cached = yield getCachedVariable(boundVar.id);
          }
          if (cached && isTarget(cached.name.toLowerCase())) {
            if (!reportedTokens.has(cached.name)) {
              reportedTokens.add(cached.name);
              results.gradients.push({
                nodeId: node.id,
                name: node.name,
                breadcrumb,
                severity: "info",
                errorType: `\u0426\u0435\u043B\u0435\u0432\u043E\u0439 \u0442\u043E\u043A\u0435\u043D: ${cached.name}`,
                count: 1
              });
            }
          }
        }
        if (paint.type.startsWith("GRADIENT_") && "gradientStops" in paint) {
          let hasAnyToken = false;
          for (const stop of paint.gradientStops) {
            if ((_b = stop.boundVariables) == null ? void 0 : _b.color) {
              hasAnyToken = true;
              let cached = getCachedVariableSync(stop.boundVariables.color.id);
              if (cached === void 0) {
                cached = yield getCachedVariable(stop.boundVariables.color.id);
              }
              if (cached && isTarget(cached.name.toLowerCase())) {
                if (!reportedTokens.has(cached.name)) {
                  reportedTokens.add(cached.name);
                  results.gradients.push({
                    nodeId: node.id,
                    name: node.name,
                    breadcrumb,
                    severity: "info",
                    errorType: `\u0422\u043E\u043A\u0435\u043D \u0432 \u0433\u0440\u0430\u0434\u0438\u0435\u043D\u0442\u0435: ${cached.name}`,
                    count: 1
                  });
                }
              }
            }
          }
          if (!hasAnyToken && !node.fillStyleId) {
            results.gradients.push({
              nodeId: node.id,
              name: node.name,
              breadcrumb,
              severity: "error",
              errorType: "\u0425\u0430\u0440\u0434\u043A\u043E\u0434\u043D\u044B\u0439 \u0433\u0440\u0430\u0434\u0438\u0435\u043D\u0442 \u0431\u0435\u0437 \u0442\u043E\u043A\u0435\u043D\u043E\u0432 \u0438 \u0441\u0442\u0438\u043B\u044F",
              count: 1
            });
          }
        }
      }
    });
  }
  var isTarget;
  var init_gradients = __esm({
    "src/plugin/validators/gradients.ts"() {
      "use strict";
      init_cache();
      isTarget = (name) => name.includes("bonus") || name.includes("gamefication") || name.includes("gamification");
    }
  });

  // src/plugin/validators/effects.ts
  function validateEffects(node, results, insideComponent, breadcrumb) {
    var _a;
    if (node.type === "VECTOR" || node.type === "BOOLEAN_OPERATION") return;
    if (((_a = node.parent) == null ? void 0 : _a.type) === "PAGE") return;
    if (!("effects" in node)) return;
    const effects = node.effects;
    if (!effects || effects.length === 0) return;
    const hasStyleId = node.effectStyleId && typeof node.effectStyleId === "string" && node.effectStyleId !== "";
    if (hasStyleId) return;
    const activeEffects = effects.filter((e) => e.visible !== false);
    if (activeEffects.length === 0) return;
    const effectNames = activeEffects.map((e) => EFFECT_TYPE_NAMES[e.type] || e.type).join(", ");
    results.variables.push({
      nodeId: node.id,
      name: node.name,
      breadcrumb,
      severity: "warning",
      errorType: `\u0425\u0430\u0440\u0434\u043A\u043E\u0434\u043D\u044B\u0439 \u044D\u0444\u0444\u0435\u043A\u0442 \u0431\u0435\u0437 \u0441\u0442\u0438\u043B\u044F: ${effectNames}`,
      count: 1
    });
  }
  var EFFECT_TYPE_NAMES;
  var init_effects = __esm({
    "src/plugin/validators/effects.ts"() {
      "use strict";
      EFFECT_TYPE_NAMES = {
        DROP_SHADOW: "\u0422\u0435\u043D\u044C (Drop Shadow)",
        INNER_SHADOW: "\u0412\u043D\u0443\u0442\u0440\u0435\u043D\u043D\u044F\u044F \u0442\u0435\u043D\u044C (Inner Shadow)",
        LAYER_BLUR: "\u0420\u0430\u0437\u043C\u044B\u0442\u0438\u0435 \u0441\u043B\u043E\u044F (Blur)",
        BACKGROUND_BLUR: "\u0420\u0430\u0437\u043C\u044B\u0442\u0438\u0435 \u0444\u043E\u043D\u0430 (Backdrop Blur)"
      };
    }
  });

  // src/plugin/migrator/helpers.ts
  function isAlias(v) {
    return !!v && typeof v === "object" && v.type === "VARIABLE_ALIAS";
  }
  function isGradient(paint) {
    return paint.type === "GRADIENT_LINEAR" || paint.type === "GRADIENT_RADIAL" || paint.type === "GRADIENT_ANGULAR" || paint.type === "GRADIENT_DIAMOND";
  }
  function hasFills(node) {
    return "fills" in node && node.fills !== figma.mixed;
  }
  var init_helpers = __esm({
    "src/plugin/migrator/helpers.ts"() {
      "use strict";
    }
  });

  // src/plugin/migrator/scan.ts
  function addLoc(map, id, loc) {
    let arr = map.get(id);
    if (!arr) {
      arr = [];
      map.set(id, arr);
    }
    arr.push(loc);
  }
  function scanNode(node, map) {
    var _a, _b;
    const hasBV = "boundVariables" in node && node.boundVariables;
    const hasFillsBV = "fills" in node && node.fills !== figma.mixed && Array.isArray(node.fills);
    const hasStrBV = "strokes" in node && Array.isArray(node.strokes);
    const hasEfxBV = "effects" in node && Array.isArray(node.effects);
    if (!hasBV && !hasFillsBV && !hasStrBV && !hasEfxBV) return;
    const nId = node.id;
    const nName = node.name;
    if (hasBV) {
      const bv = node.boundVariables;
      for (let i = 0; i < ALL_FIELDS.length; i++) {
        const field = ALL_FIELDS[i];
        const alias = bv[field];
        if (isAlias(alias)) addLoc(map, alias.id, { nodeId: nId, nodeName: nName, kind: "field", field });
      }
    }
    if (hasFillsBV) {
      const fills = node.fills;
      for (let i = 0; i < fills.length; i++) {
        const fill = fills[i];
        if (fill.type === "SOLID") {
          const alias = (_a = fill.boundVariables) == null ? void 0 : _a.color;
          if (alias) addLoc(map, alias.id, { nodeId: nId, nodeName: nName, kind: "fill", index: i, field: "color" });
        }
        if (isGradient(fill)) {
          const stops = fill.gradientStops;
          for (let j = 0; j < stops.length; j++) {
            const stopBv = stops[j].boundVariables;
            if (stopBv == null ? void 0 : stopBv.color) addLoc(map, stopBv.color.id, { nodeId: nId, nodeName: nName, kind: "gradientStop", fillIndex: i, stopIndex: j });
          }
        }
      }
    }
    if (hasStrBV) {
      const strokes = node.strokes;
      for (let i = 0; i < strokes.length; i++) {
        const s = strokes[i];
        if (s.type === "SOLID") {
          const alias = (_b = s.boundVariables) == null ? void 0 : _b.color;
          if (alias) addLoc(map, alias.id, { nodeId: nId, nodeName: nName, kind: "stroke", index: i, field: "color" });
        }
      }
    }
    if (hasEfxBV) {
      const effects = node.effects;
      for (let i = 0; i < effects.length; i++) {
        const bv = effects[i].boundVariables;
        if (!bv) continue;
        for (let fi = 0; fi < EFFECT_FIELDS.length; fi++) {
          const field = EFFECT_FIELDS[fi];
          const alias = bv[field];
          if (isAlias(alias)) addLoc(map, alias.id, { nodeId: nId, nodeName: nName, kind: "effect", index: i, field });
        }
      }
    }
  }
  var NODE_FIELDS, TEXT_FIELDS, ALL_FIELDS, EFFECT_FIELDS;
  var init_scan = __esm({
    "src/plugin/migrator/scan.ts"() {
      "use strict";
      init_helpers();
      NODE_FIELDS = [
        "width",
        "height",
        "opacity",
        "cornerRadius",
        "topLeftRadius",
        "topRightRadius",
        "bottomLeftRadius",
        "bottomRightRadius",
        "strokeWeight",
        "paddingTop",
        "paddingBottom",
        "paddingLeft",
        "paddingRight",
        "itemSpacing",
        "counterAxisSpacing",
        "minWidth",
        "maxWidth",
        "minHeight",
        "maxHeight"
      ];
      TEXT_FIELDS = [
        "fontFamily",
        "fontStyle",
        "fontWeight",
        "fontSize",
        "lineHeight",
        "letterSpacing",
        "paragraphSpacing",
        "paragraphIndent"
      ];
      ALL_FIELDS = [...NODE_FIELDS, ...TEXT_FIELDS];
      EFFECT_FIELDS = ["color", "offsetX", "offsetY", "blur", "spread", "radius"];
    }
  });

  // src/plugin/scan-config.ts
  var SCAN_NODE_TYPES, FIGJAM_SKIP_TYPES;
  var init_scan_config = __esm({
    "src/plugin/scan-config.ts"() {
      "use strict";
      SCAN_NODE_TYPES = [
        "FRAME",
        "GROUP",
        "COMPONENT",
        "COMPONENT_SET",
        "INSTANCE",
        "RECTANGLE",
        "ELLIPSE",
        "POLYGON",
        "STAR",
        "VECTOR",
        "LINE",
        "BOOLEAN_OPERATION",
        "TEXT",
        "SECTION"
      ];
      FIGJAM_SKIP_TYPES = /* @__PURE__ */ new Set([
        "STICKY",
        "SHAPE_WITH_TEXT",
        "CONNECTOR",
        "STAMP",
        "WIDGET",
        "HIGHLIGHT"
      ]);
    }
  });

  // src/plugin/scanner.ts
  function isIconNode(node) {
    const lowerName = node.name.toLowerCase();
    if (lowerName.includes("icon")) return true;
    const parent = node.parent;
    if (parent && parent.type !== "PAGE" && parent.type !== "DOCUMENT") {
      if (parent.name.toLowerCase().includes("icon")) return true;
    }
    return false;
  }
  function resetNodesScannedCount() {
    clearCaches();
    clearVariablesValidatorCache();
  }
  function getBreadcrumb(node) {
    var _a;
    const parts = [];
    let current = node.parent;
    while (current && current.type !== "PAGE" && current.type !== "DOCUMENT") {
      if (current.type === "SECTION" || ((_a = current.parent) == null ? void 0 : _a.type) === "PAGE") {
        parts.unshift(current.name);
      }
      current = current.parent;
    }
    return parts.slice(0, 2).join(" / ");
  }
  function scanNode2(_0, _1, _2) {
    return __async(this, arguments, function* (node, results, snapshot, insideComponent = false, breadcrumb = "", onProgress, counter = { n: 0 }, migratorMap) {
      var _a;
      if ("visible" in node && !node.visible) return;
      if (FIGJAM_SKIP_TYPES.has(node.type)) return;
      const lowerName = node.name.toLowerCase();
      if (lowerName === "mask" || lowerName === "union") return;
      counter.n++;
      if (onProgress && counter.n % 500 === 0) {
        onProgress(counter.n);
        yield new Promise((resolve) => setTimeout(resolve, 5));
      }
      const isComp = insideComponent || node.type === "INSTANCE" || node.type === "COMPONENT" || node.type === "COMPONENT_SET";
      const nodeBreadcrumb = breadcrumb || (((_a = node.parent) == null ? void 0 : _a.type) === "PAGE" ? node.name : getBreadcrumb(node));
      scanNode(node, migratorMap);
      const needsComponentValidation = node.type === "INSTANCE" || node.type === "FRAME" || node.type === "COMPONENT_SET" || node.type === "COMPONENT";
      if (needsComponentValidation) {
        yield validateComponent(node, results, snapshot, nodeBreadcrumb);
      }
      const needsVariablesValidation = "fills" in node && Array.isArray(node.fills) && node.fills.length > 0 || "strokes" in node && Array.isArray(node.strokes) && node.strokes.length > 0 || node.type === "TEXT";
      if (needsVariablesValidation) {
        yield validateVariables(node, results, isComp, nodeBreadcrumb);
      }
      const needsGradientValidation = "fills" in node && Array.isArray(node.fills) && node.fills.length > 0;
      if (needsGradientValidation) {
        yield validateGradients(node, results, nodeBreadcrumb);
      }
      validateEffects(node, results, isComp, nodeBreadcrumb);
      if (node.type === "VECTOR" || node.type === "BOOLEAN_OPERATION") return;
      if ("children" in node) {
        for (const child of node.children) {
          yield scanNode2(child, results, snapshot, isComp, nodeBreadcrumb, onProgress, counter, migratorMap);
        }
      }
    });
  }
  var init_scanner = __esm({
    "src/plugin/scanner.ts"() {
      "use strict";
      init_components();
      init_variables();
      init_gradients();
      init_effects();
      init_cache();
      init_scan();
      init_scan_config();
    }
  });

  // src/plugin/snapshot.ts
  function buildLayerTree(node, layers) {
    return __async(this, null, function* () {
      const parts = [];
      const fills = yield extractFills(node);
      if (fills) parts.push(`f:${fills}`);
      const strokes = yield extractStrokes(node);
      if (strokes) parts.push(`s:${strokes}`);
      const radius = extractRadius(node);
      if (radius) parts.push(`r:${radius}`);
      const padding = extractPadding(node);
      if (padding) parts.push(`p:${padding}`);
      const itemSpacing = extractItemSpacing(node);
      if (itemSpacing) parts.push(`i:${itemSpacing}`);
      const font = extractFont(node);
      if (font) parts.push(`t:${font}`);
      if (parts.length > 0) {
        layers[node.name] = parts.join("|");
      }
      if ("children" in node) {
        for (const child of node.children) {
          yield buildLayerTree(child, layers);
        }
      }
    });
  }
  function buildMeta(storage, source) {
    return {
      updatedAt: storage.u,
      fileKey: storage.f,
      count: storage.c.length,
      version: storage.version,
      source
    };
  }
  function persist(storage, source) {
    return __async(this, null, function* () {
      const meta = buildMeta(storage, source);
      yield figma.clientStorage.setAsync(STORAGE_KEY, storage);
      yield figma.clientStorage.setAsync(STORAGE_KEY_META, meta);
      return meta;
    });
  }
  function collectPageComponents(page) {
    return __async(this, null, function* () {
      yield page.loadAsync();
      return page.findAllWithCriteria({ types: ["COMPONENT"] });
    });
  }
  function saveSnapshot(version) {
    return __async(this, null, function* () {
      var _a;
      const t0 = Date.now();
      figma.ui.postMessage({
        type: "snapshot-progress",
        page: "\u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0430 \u0441\u0442\u0440\u0430\u043D\u0438\u0446",
        pageIndex: 0,
        pagesTotal: 0,
        pagesScanned: 0,
        processed: 0,
        elapsedMs: 0
      });
      yield figma.loadAllPagesAsync();
      const components = [];
      const BATCH_SIZE = 50;
      const pages = figma.root.children;
      const pagesTotal = pages.length;
      let pagesScanned = 0;
      for (let p = 0; p < pages.length; p++) {
        const page = pages[p];
        figma.ui.postMessage({
          type: "snapshot-progress",
          page: page.name,
          pageIndex: p + 1,
          pagesTotal,
          pagesScanned,
          processed: components.length,
          elapsedMs: Date.now() - t0
        });
        let nodes;
        try {
          nodes = yield collectPageComponents(page);
        } catch (err) {
          console.warn(`[DS Snapshot] \u0421\u0442\u0440\u0430\u043D\u0438\u0446\u0430 \xAB${page.name}\xBB \u043F\u0440\u043E\u043F\u0443\u0449\u0435\u043D\u0430:`, err);
          continue;
        }
        pagesScanned++;
        for (let i = 0; i < nodes.length; i++) {
          const node = nodes[i];
          if (!node.key) continue;
          const parentName = ((_a = node.parent) == null ? void 0 : _a.type) === "COMPONENT_SET" ? node.parent.name : void 0;
          const layers = {};
          yield buildLayerTree(node, layers);
          components.push({ k: node.key, n: node.name, p: parentName, l: layers });
          if ((i + 1) % BATCH_SIZE === 0) {
            figma.ui.postMessage({
              type: "snapshot-progress",
              page: page.name,
              pageIndex: p + 1,
              pagesTotal,
              pagesScanned,
              processed: components.length,
              elapsedMs: Date.now() - t0
            });
            yield new Promise((resolve) => setTimeout(resolve, 0));
          }
        }
      }
      if (components.length === 0) {
        throw new Error("\u041A\u043E\u043C\u043F\u043E\u043D\u0435\u043D\u0442\u044B \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u044B. \u041E\u0442\u043A\u0440\u043E\u0439 \u0444\u0430\u0439\u043B UI-Kit \u0438 \u043F\u043E\u0432\u0442\u043E\u0440\u0438 \u0441\u043A\u0430\u043D.");
      }
      const elapsedMs = Date.now() - t0;
      const storage = {
        c: components,
        u: (/* @__PURE__ */ new Date()).toISOString(),
        f: figma.root.name,
        version: version || (/* @__PURE__ */ new Date()).toISOString().slice(0, 10).replace(/-/g, ".")
      };
      console.log(`[DS Snapshot] \u041F\u043E\u043B\u043D\u0430\u044F \u0437\u0430\u043C\u0435\u043D\u0430 \u044D\u0442\u0430\u043B\u043E\u043D\u0430: ${components.length} \u043A\u043E\u043C\u043F\u043E\u043D\u0435\u043D\u0442\u043E\u0432 \u0438\u0437 "${storage.f}"`);
      const meta = yield persist(storage, "local");
      return __spreadProps(__spreadValues({}, meta), { pagesScanned, pagesTotal, elapsedMs });
    });
  }
  function saveRemoteSnapshot(storage) {
    return __async(this, null, function* () {
      if (!(storage == null ? void 0 : storage.c) || !Array.isArray(storage.c) || storage.c.length === 0) {
        throw new Error("\u041D\u0435\u043A\u043E\u0440\u0440\u0435\u043A\u0442\u043D\u044B\u0439 \u0438\u043B\u0438 \u043F\u0443\u0441\u0442\u043E\u0439 snapshot");
      }
      const normalized = {
        c: storage.c,
        u: storage.u || (/* @__PURE__ */ new Date()).toISOString(),
        f: storage.f || "UI-Kit",
        version: storage.version
      };
      console.log(`[DS Snapshot] \u041F\u043E\u043B\u043D\u0430\u044F \u0437\u0430\u043C\u0435\u043D\u0430 \u044D\u0442\u0430\u043B\u043E\u043D\u0430 \u0441 GitHub: ${normalized.c.length} \u043A\u043E\u043C\u043F\u043E\u043D\u0435\u043D\u0442\u043E\u0432`);
      return persist(normalized, "remote");
    });
  }
  function loadSnapshot() {
    return __async(this, null, function* () {
      try {
        return yield figma.clientStorage.getAsync(STORAGE_KEY);
      } catch (e) {
        return null;
      }
    });
  }
  function loadSnapshotMeta() {
    return __async(this, null, function* () {
      try {
        return yield figma.clientStorage.getAsync(STORAGE_KEY_META);
      } catch (e) {
        return null;
      }
    });
  }
  var STORAGE_KEY, STORAGE_KEY_META;
  var init_snapshot = __esm({
    "src/plugin/snapshot.ts"() {
      "use strict";
      init_extractors();
      STORAGE_KEY = "ds_component_snapshot";
      STORAGE_KEY_META = "ds_component_snapshot_meta";
    }
  });

  // src/plugin/snapshot-messages.ts
  function handleSnapshotMessage(msg) {
    return __async(this, null, function* () {
      if (msg.type === "update-snapshot") {
        try {
          const meta = yield saveSnapshot(msg.version);
          figma.notify(`\u2705 \u042D\u0442\u0430\u043B\u043E\u043D \u043E\u0431\u043D\u043E\u0432\u043B\u0451\u043D: ${meta.count} \u043A\u043E\u043C\u043F\u043E\u043D\u0435\u043D\u0442\u043E\u0432 \u0438\u0437 "${meta.fileKey}"`);
          figma.ui.postMessage(__spreadValues({ type: "snapshot-saved" }, meta));
        } catch (err) {
          const message = err instanceof Error ? err.message : String(err);
          figma.notify(`\u2715 ${message}`);
          figma.ui.postMessage({ type: "snapshot-scan-error", message });
        }
        return true;
      }
      if (msg.type === "save-remote-snapshot") {
        try {
          const meta = yield saveRemoteSnapshot(msg.storage);
          figma.notify(`\u2705 \u042D\u0442\u0430\u043B\u043E\u043D \u0441 GitHub: v${meta.version || "\u2014"} \xB7 ${meta.count} \u043A\u043E\u043C\u043F\u043E\u043D\u0435\u043D\u0442\u043E\u0432`);
          figma.ui.postMessage(__spreadValues({ type: "snapshot-remote-saved" }, meta));
        } catch (err) {
          figma.ui.postMessage({
            type: "snapshot-remote-error",
            message: err instanceof Error ? err.message : String(err)
          });
        }
        return true;
      }
      if (msg.type === "export-snapshot") {
        const storage = yield loadSnapshot();
        const meta = yield loadSnapshotMeta();
        if (!storage || !meta || !storage.c.length) {
          figma.notify("\u0421\u043D\u0430\u0447\u0430\u043B\u0430 \u043E\u0442\u0441\u043A\u0430\u043D\u0438\u0440\u0443\u0439\u0442\u0435 UI-Kit");
          return true;
        }
        figma.ui.postMessage({
          type: "snapshot-export",
          storage,
          meta: {
            version: meta.version || storage.version || storage.u.slice(0, 10).replace(/-/g, "."),
            updatedAt: meta.updatedAt,
            count: meta.count,
            fileKey: meta.fileKey
          }
        });
        return true;
      }
      return false;
    });
  }
  var init_snapshot_messages = __esm({
    "src/plugin/snapshot-messages.ts"() {
      "use strict";
      init_snapshot();
    }
  });

  // src/plugin/migrator/scanHandler.ts
  function hydrateSync(rawMap) {
    var _a;
    const result = /* @__PURE__ */ new Map();
    const collectionCache = /* @__PURE__ */ new Map();
    for (const [variableId, locations] of rawMap.entries()) {
      const variable = figma.variables.getVariableById(variableId);
      if (!variable) continue;
      const colId = variable.variableCollectionId;
      let colName = collectionCache.get(colId);
      if (colName === void 0) {
        const col = figma.variables.getVariableCollectionById(colId);
        colName = (_a = col == null ? void 0 : col.name) != null ? _a : "(unknown)";
        collectionCache.set(colId, colName);
      }
      result.set(variableId, {
        variableId,
        variableName: variable.name,
        collectionName: colName,
        locations
      });
    }
    return result;
  }
  function processMigratorResults(rawMap, totalNodes, tTotal) {
    scanData = hydrateSync(rawMap);
    const variables = Array.from(scanData.values()).map((u) => ({
      variableId: u.variableId,
      variableName: u.variableName,
      collectionName: u.collectionName,
      locationCount: u.locations.length,
      locations: u.locations.map((l) => ({ nodeId: l.nodeId, nodeName: l.nodeName }))
    }));
    return { variables, nodeCount: totalNodes };
  }
  var scanData;
  var init_scanHandler = __esm({
    "src/plugin/migrator/scanHandler.ts"() {
      "use strict";
      scanData = null;
    }
  });

  // src/plugin/migrator/utils.ts
  function ms(start) {
    const diff = perf.now() - start;
    if (diff < 1e3) return `${diff}ms`;
    const sec = diff / 1e3;
    if (sec < 60) return `${sec.toFixed(1)}s`;
    const min = Math.floor(sec / 60);
    const rSec = Math.floor(sec % 60);
    return `${min}m ${rSec}s`;
  }
  function send(type, payload = {}) {
    figma.ui.postMessage(__spreadValues({ type }, payload));
  }
  function withRetry(fn, label = "", maxAttempts = 6) {
    return __async(this, null, function* () {
      const DELAYS = [1e3, 2e3, 4e3, 8e3, 16e3];
      for (let i = 0; i < maxAttempts; i++) {
        try {
          return yield fn();
        } catch (err) {
          const isRate = (err instanceof Error ? err.message : String(err)).toLowerCase().includes("429");
          if (!isRate || i === maxAttempts - 1) throw err;
          const delay = DELAYS[Math.min(i, DELAYS.length - 1)];
          console.warn(`429 rate-limit [${label}] \u2014 retry in ${delay / 1e3}s`);
          yield new Promise((r) => setTimeout(r, delay));
        }
      }
      throw new Error("withRetry: unreachable");
    });
  }
  var perf;
  var init_utils = __esm({
    "src/plugin/migrator/utils.ts"() {
      "use strict";
      perf = { now: () => Date.now() };
    }
  });

  // src/plugin/migrator/libraries.ts
  function onGetLibraries() {
    return __async(this, null, function* () {
      const t = perf.now();
      const cols = yield figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync();
      console.log(`Libraries: ${cols.length} collections, ${ms(t)}`);
      const collections = cols.map((c) => ({
        key: c.key,
        name: c.name,
        libraryName: c.libraryName
      }));
      send("LIBRARIES_LOADED", { collections });
    });
  }
  var init_libraries = __esm({
    "src/plugin/migrator/libraries.ts"() {
      "use strict";
      init_utils();
    }
  });

  // src/plugin/migrator/apply.ts
  function applyVariable(loc, variable) {
    const node = figma.getNodeById(loc.nodeId);
    if (!node) return;
    switch (loc.kind) {
      case "field": {
        node.setBoundVariable(loc.field, variable);
        break;
      }
      case "fill": {
        if (!hasFills(node)) break;
        const fills = [...node.fills];
        const fill = fills[loc.index];
        if (!fill || fill.type !== "SOLID") break;
        fills[loc.index] = figma.variables.setBoundVariableForPaint(fill, "color", variable);
        node.fills = fills;
        break;
      }
      case "gradientStop": {
        if (!hasFills(node)) break;
        const fills = [...node.fills];
        const fill = fills[loc.fillIndex];
        if (!fill || !isGradient(fill)) break;
        const newStops = fill.gradientStops.map(
          (stop, j) => j !== loc.stopIndex ? stop : __spreadProps(__spreadValues({}, stop), { boundVariables: { color: figma.variables.createVariableAlias(variable) } })
        );
        fills[loc.fillIndex] = __spreadProps(__spreadValues({}, fill), { gradientStops: newStops });
        node.fills = fills;
        break;
      }
      case "stroke": {
        if (!("strokes" in node)) break;
        const strokes = [...node.strokes];
        const stroke = strokes[loc.index];
        if (!stroke || stroke.type !== "SOLID") break;
        strokes[loc.index] = figma.variables.setBoundVariableForPaint(stroke, "color", variable);
        node.strokes = strokes;
        break;
      }
      case "effect": {
        if (!("effects" in node)) break;
        const effects = [...node.effects];
        const effect = effects[loc.index];
        if (!effect) break;
        effects[loc.index] = figma.variables.setBoundVariableForEffect(
          effect,
          loc.field,
          variable
        );
        node.effects = effects;
        break;
      }
    }
  }
  var init_apply = __esm({
    "src/plugin/migrator/apply.ts"() {
      "use strict";
      init_helpers();
    }
  });

  // src/plugin/migrator/migrate.ts
  function onMigrate(scanData2, collectionKeys, dryRun = false) {
    return __async(this, null, function* () {
      const tTotal = perf.now();
      const nameToKey = /* @__PURE__ */ new Map();
      for (const key of collectionKeys) {
        try {
          const vars = yield withRetry(
            () => figma.teamLibrary.getVariablesInLibraryCollectionAsync(key),
            key.slice(0, 8)
          );
          for (const v of vars) {
            if (!nameToKey.has(v.name)) nameToKey.set(v.name, v.key);
          }
        } catch (e) {
          console.warn(`Collection [${key.slice(0, 8)}] unavailable: ${e}`);
        }
      }
      const toImport = [];
      const notFound = [];
      const errors = [];
      let replaced = 0;
      for (const [, usage] of scanData2) {
        const targetKey = nameToKey.get(usage.variableName);
        if (!targetKey) {
          notFound.push(usage.variableName);
          continue;
        }
        toImport.push({ usage, targetKey });
        if (dryRun) replaced += usage.locations.length;
      }
      if (dryRun) {
        const elapsed2 = ms(tTotal);
        console.log(`Migrate (dryRun): ${replaced} replaced, ${notFound.length} not found, ${errors.length} errors, ${elapsed2}`);
        send("MIGRATE_COMPLETE", { result: { replaced, notFound, errors }, elapsed: elapsed2, dryRun });
        return;
      }
      const BATCH = 5;
      const totalToMigrate = toImport.length;
      send("MIGRATE_START", { total: totalToMigrate });
      for (let i = 0; i < totalToMigrate; i += BATCH) {
        const batch = toImport.slice(i, i + BATCH);
        const results = yield Promise.all(
          batch.map(
            (item) => withRetry(() => figma.variables.importVariableByKeyAsync(item.targetKey), item.usage.variableName).then((newVar) => ({ ok: true, newVar, usage: item.usage })).catch((e) => ({ ok: false, error: String(e), usage: item.usage }))
          )
        );
        for (const result of results) {
          if (!result.ok) {
            errors.push(`Import failed: ${result.usage.variableName}`);
            continue;
          }
          for (const loc of result.usage.locations) {
            try {
              applyVariable(loc, result.newVar);
              replaced++;
            } catch (e) {
              errors.push(`Apply failed: ${result.usage.variableName} \u2192 "${loc.nodeName}"`);
            }
          }
        }
        const current = Math.min(i + BATCH, totalToMigrate);
        send("MIGRATE_PROGRESS", { current, total: totalToMigrate, replaced, elapsed: ms(tTotal) });
        if (current < totalToMigrate) {
          yield new Promise((r) => setTimeout(r, 1));
        }
      }
      const elapsed = ms(tTotal);
      console.log(`Migrate: ${replaced} replaced, ${notFound.length} not found, ${errors.length} errors, ${elapsed}`);
      send("MIGRATE_COMPLETE", { result: { replaced, notFound, errors }, elapsed });
    });
  }
  var init_migrate = __esm({
    "src/plugin/migrator/migrate.ts"() {
      "use strict";
      init_utils();
      init_apply();
    }
  });

  // src/plugin/migrator/detach.ts
  function detachLocation(loc) {
    const node = figma.getNodeById(loc.nodeId);
    if (!node) return;
    switch (loc.kind) {
      case "field": {
        node.setBoundVariable(loc.field, null);
        break;
      }
      case "fill": {
        if (!hasFills(node)) break;
        const fills = [...node.fills];
        const fill = fills[loc.index];
        if (!fill || fill.type !== "SOLID") break;
        const _a = fill, { boundVariables: _bv } = _a, rest = __objRest(_a, ["boundVariables"]);
        fills[loc.index] = __spreadValues({}, rest);
        node.fills = fills;
        break;
      }
      case "gradientStop": {
        if (!hasFills(node)) break;
        const fills = [...node.fills];
        const fill = fills[loc.fillIndex];
        if (!fill || !isGradient(fill)) break;
        const newStops = fill.gradientStops.map((stop, j) => {
          if (j !== loc.stopIndex) return stop;
          const _a2 = stop, { boundVariables: _bv } = _a2, rest = __objRest(_a2, ["boundVariables"]);
          return __spreadValues({}, rest);
        });
        fills[loc.fillIndex] = __spreadProps(__spreadValues({}, fill), { gradientStops: newStops });
        node.fills = fills;
        break;
      }
      case "stroke": {
        if (!("strokes" in node)) break;
        const strokes = [...node.strokes];
        const stroke = strokes[loc.index];
        if (!stroke || stroke.type !== "SOLID") break;
        const _b = stroke, { boundVariables: _bv } = _b, rest = __objRest(_b, ["boundVariables"]);
        strokes[loc.index] = __spreadValues({}, rest);
        node.strokes = strokes;
        break;
      }
      case "effect": {
        if (!("effects" in node)) break;
        const effects = [...node.effects];
        const effect = effects[loc.index];
        if (!effect) break;
        const _c = effect, { boundVariables: _bv } = _c, rest = __objRest(_c, ["boundVariables"]);
        effects[loc.index] = __spreadValues({}, rest);
        node.effects = effects;
        break;
      }
    }
  }
  function onDetachNotFound(scanData2, notFoundNames) {
    if (!notFoundNames.length) {
      send("DETACH_COMPLETE", { result: { detached: 0, errors: [] } });
      return;
    }
    const nameSet = new Set(notFoundNames);
    let detached = 0;
    const errors = [];
    for (const [, usage] of scanData2) {
      if (!nameSet.has(usage.variableName)) continue;
      for (const loc of usage.locations) {
        try {
          detachLocation(loc);
          detached++;
        } catch (e) {
          errors.push(`Detach failed: ${usage.variableName} \u2192 "${loc.nodeName}"`);
        }
      }
    }
    console.log(`Detach: ${detached} detached, ${errors.length} errors`);
    send("DETACH_COMPLETE", { result: { detached, errors } });
  }
  var init_detach = __esm({
    "src/plugin/migrator/detach.ts"() {
      "use strict";
      init_utils();
      init_helpers();
    }
  });

  // src/plugin/focus-nodes.ts
  function focusNodesByIds(nodeIds) {
    return __async(this, null, function* () {
      const unique = [...new Set((nodeIds || []).filter(Boolean))];
      if (!unique.length) return;
      const nodes = [];
      for (const id of unique) {
        const node = yield figma.getNodeByIdAsync(id);
        if (node && "x" in node) nodes.push(node);
      }
      if (!nodes.length) return;
      figma.currentPage.selection = nodes;
      figma.viewport.scrollAndZoomIntoView(nodes);
    });
  }
  var init_focus_nodes = __esm({
    "src/plugin/focus-nodes.ts"() {
      "use strict";
    }
  });

  // src/plugin/code.ts
  var require_code = __commonJS({
    "src/plugin/code.ts"(exports) {
      init_scanner();
      init_snapshot();
      init_snapshot_messages();
      init_scan_config();
      init_scanHandler();
      init_libraries();
      init_migrate();
      init_detach();
      init_utils();
      init_focus_nodes();
      figma.showUI(__html__, { width: 450, height: 600, themeColors: true });
      (() => __async(null, null, function* () {
        const meta = yield loadSnapshotMeta();
        figma.ui.postMessage({
          type: "snapshot-info",
          updatedAt: meta == null ? void 0 : meta.updatedAt,
          fileKey: meta == null ? void 0 : meta.fileKey,
          count: (meta == null ? void 0 : meta.count) || 0,
          version: meta == null ? void 0 : meta.version,
          source: meta == null ? void 0 : meta.source,
          hasLocal: !!meta
        });
        const theme = yield figma.clientStorage.getAsync("theme");
        if (theme) {
          figma.ui.postMessage({ type: "init-theme", theme });
        }
      }))();
      function runGlobalScan(type, roots) {
        return __async(this, null, function* () {
          var _a;
          if (roots.length === 0) {
            figma.notify("\u041D\u0438\u0447\u0435\u0433\u043E \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u043E \u0434\u043B\u044F \u0441\u043A\u0430\u043D\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u044F");
            return;
          }
          const t0 = Date.now();
          console.log(`[Design Review] \u0417\u0430\u043F\u0443\u0441\u043A \u0441\u043A\u0430\u043D\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u044F (${type})... \u0421\u043E\u0431\u0438\u0440\u0430\u0435\u043C \u0443\u0437\u043B\u044B...`);
          figma.skipInvisibleInstanceChildren = true;
          let totalNodesToScan = 0;
          for (const root of roots) {
            totalNodesToScan++;
            if ("findAllWithCriteria" in root) {
              totalNodesToScan += root.findAllWithCriteria({ types: SCAN_NODE_TYPES }).length;
            }
          }
          console.log(`[Design Review] \u0423\u0437\u043B\u044B \u0441\u043E\u0431\u0440\u0430\u043D\u044B \u0437\u0430 ${Date.now() - t0}\u043C\u0441. \u0412\u0441\u0435\u0433\u043E \u0443\u0437\u043B\u043E\u0432: ${totalNodesToScan}`);
          figma.ui.postMessage({ type: "scan-start", total: totalNodesToScan });
          const results = {
            components: [],
            variables: [],
            gradients: []
          };
          resetNodesScannedCount();
          const snapshotData = yield loadSnapshot();
          const snapshotArr = (_a = snapshotData == null ? void 0 : snapshotData.c) != null ? _a : null;
          const snapshot = snapshotArr ? new Map(snapshotArr.map((s) => [s.k, s])) : null;
          if (snapshot) {
            figma.ui.postMessage({
              type: "snapshot-info",
              updatedAt: snapshotData.u,
              fileKey: snapshotData.f,
              count: snapshot.size,
              version: snapshotData.version,
              hasLocal: true
            });
          }
          console.log(`[Design Review] \u041D\u0430\u0447\u0438\u043D\u0430\u044E \u043F\u0440\u043E\u0432\u0435\u0440\u043A\u0443 \u0443\u0437\u043B\u043E\u0432...`);
          const t1 = Date.now();
          const counter = { n: 0 };
          const onProgress = (count) => {
            figma.ui.postMessage({ type: "scan-progress", count });
            send("SCAN_PROGRESS", { nodeCount: count, total: totalNodesToScan, elapsed: `${Date.now() - t1}ms` });
          };
          const migratorMap = /* @__PURE__ */ new Map();
          for (const node of roots) {
            yield scanNode2(node, results, snapshot, false, "", onProgress, counter, migratorMap);
          }
          const totalIssues = results.components.length + results.variables.length + results.gradients.length;
          const elapsed = Date.now() - t1;
          console.log(`[Design Review] \u0421\u043A\u0430\u043D\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u0435 \u0437\u0430\u0432\u0435\u0440\u0448\u0435\u043D\u043E \u0437\u0430 ${elapsed}\u043C\u0441. \u041F\u0440\u043E\u0432\u0435\u0440\u0435\u043D\u043E: ${counter.n}. \u041D\u0430\u0439\u0434\u0435\u043D\u043E \u043E\u0448\u0438\u0431\u043E\u043A: ${totalIssues}`);
          const migratorResult = processMigratorResults(migratorMap, counter.n, t1);
          figma.ui.postMessage({ type: "scan-results", results, scannedCount: counter.n, totalIssues, migratorResult, elapsed: `${elapsed}ms` });
        });
      }
      figma.ui.onmessage = (msg) => __async(null, null, function* () {
        var _a;
        if (msg.type === "scan-selection" || msg.type === "scan-page") {
          const roots = msg.type === "scan-selection" ? figma.currentPage.selection : figma.currentPage.children;
          yield runGlobalScan(msg.type, roots);
        }
        if (msg.type === "focus-node") {
          yield focusNodesByIds([msg.nodeId]);
        }
        if (msg.type === "focus-nodes") {
          yield focusNodesByIds(msg.nodeIds || []);
        }
        if (msg.type === "FOCUS_VARIABLE") {
          if (scanData) {
            const usage = Array.from(scanData.values()).find((u) => u.variableName === msg.name);
            if (usage == null ? void 0 : usage.locations.length) {
              yield focusNodesByIds(usage.locations.map((loc) => loc.nodeId));
            }
          }
        }
        if (msg.type === "resize") {
          figma.ui.resize(450, msg.expanded ? 2e3 : 600);
        }
        if (yield handleSnapshotMessage(msg)) return;
        if (msg.type === "save-theme") {
          yield figma.clientStorage.setAsync("theme", msg.theme);
        }
        try {
          if (msg.type === "GET_LIBRARIES") {
            yield onGetLibraries();
          } else if (msg.type === "MIGRATE") {
            if (!scanData || scanData.size === 0) throw new Error("\u0421\u043D\u0430\u0447\u0430\u043B\u0430 \u0432\u044B\u043F\u043E\u043B\u043D\u0438 \u0441\u043A\u0430\u043D\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u0435.");
            if (!((_a = msg.collectionKeys) == null ? void 0 : _a.length)) throw new Error("\u0412\u044B\u0431\u0435\u0440\u0438 \u0445\u043E\u0442\u044F \u0431\u044B \u043E\u0434\u043D\u0443 \u043A\u043E\u043B\u043B\u0435\u043A\u0446\u0438\u044E.");
            yield onMigrate(scanData, msg.collectionKeys, msg.dryRun);
          } else if (msg.type === "DETACH_NOT_FOUND") {
            if (!scanData || scanData.size === 0) throw new Error("\u0421\u043D\u0430\u0447\u0430\u043B\u0430 \u0432\u044B\u043F\u043E\u043B\u043D\u0438 \u0441\u043A\u0430\u043D\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u0435.");
            onDetachNotFound(scanData, msg.names);
          } else if (msg.type === "SCAN") {
            const scope = msg.scope;
            const scanType = scope === "selection" ? "scan-selection" : "scan-page";
            let roots = [];
            if (scope === "selection") {
              roots = figma.currentPage.selection;
            } else if (scope === "document") {
              roots = [];
              for (const page of figma.root.children) {
                roots.push(...page.children);
              }
            } else {
              roots = figma.currentPage.children;
            }
            yield runGlobalScan(scanType, roots);
          }
        } catch (err) {
          send("ERROR", { message: err instanceof Error ? err.message : String(err) });
        }
      });
    }
  });
  require_code();
})();
