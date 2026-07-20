import { DS_COMPONENT_NAMES } from '../ds_names';
import type { ComponentSnapshot } from '../snapshot';
import { extractFills, extractStrokes, extractRadius, extractPadding, extractItemSpacing, extractFont, getNodePath } from '../extractors';

const OVERRIDE_NAMES: Record<string, string> = {
  fills: 'Заливка',
  strokes: 'Обводка',
  cornerRadius: 'Скругление',
  paddingLeft: 'Левый отступ',
  paddingRight: 'Правый отступ',
  paddingTop: 'Верхний отступ',
  paddingBottom: 'Нижний отступ',
  itemSpacing: 'Отступ между',
  fontName: 'Шрифт',
  fontSize: 'Размер шрифта'
};
const OVERRIDE_KEYS = new Set(Object.keys(OVERRIDE_NAMES));

export async function validateComponent(
  node: SceneNode,
  results: any,
  snapshot: Map<string, ComponentSnapshot> | null = null,
  breadcrumb: string = ''
) {
  if (node.type === 'INSTANCE') {
    const mc = node.mainComponent;

    if (snapshot && mc) {
      if (mc.remote) {
        const known = mc?.remote ? snapshot?.get(mc.key) : undefined;
        if (!known) {
          const parentName = mc.parent?.type === 'COMPONENT_SET' ? mc.parent.name : null;
          const isDS = DS_COMPONENT_NAMES.has(mc.name) || (parentName && DS_COMPONENT_NAMES.has(parentName));

          if (isDS) {
            const displayName = parentName ? `${parentName} / ${mc.name}` : mc.name;
            results.components.push({
              nodeId: node.id, name: node.name, breadcrumb,
              severity: 'error',
              errorType: `Устаревший компонент ДС: "${displayName}" не найден в эталоне`,
              count: 1
            });
          }
        } else if (known.n !== mc.name) {
          const displayName = known.p ? `${known.p} / ${known.n}` : known.n;
          results.components.push({
            nodeId: node.id, name: node.name, breadcrumb,
            severity: 'error',
            errorType: `Переименован в ките → теперь: "${displayName}"`,
            count: 1
          });
        }
      }
    }

    const overrides = node.overrides;
    if (overrides && overrides.length > 0) {
      const known = mc?.remote ? snapshot?.get(mc.key) : undefined;
      
      if (known) {
        for (const override of overrides) {
          const badFields = override.overriddenFields.filter((f: string) => OVERRIDE_KEYS.has(f));
          if (badFields.length > 0) {
            try {
              let innerNode = figma.getNodeById(override.id) as SceneNode;
              if (!innerNode) {
                innerNode = await figma.getNodeByIdAsync(override.id) as SceneNode;
              }
              if (!innerNode) continue;

              let path = innerNode.name;
              const originalLayerStr = known?.l?.[path];
              
              const originalLayer: Record<string, string> = {};
              if (originalLayerStr) {
                originalLayerStr.split('|').forEach(part => {
                  const sep = part.indexOf(':');
                  if (sep > 0) originalLayer[part.substring(0, sep)] = part.substring(sep + 1);
                });
              }

              let handledPadding = false;
              let handledFont = false;

              for (const field of badFields) {
                const translated = OVERRIDE_NAMES[field] || field;
                let originalValue = '?';
                let currentValue = '?';
                let fieldName = translated;

                if (field === 'fills') {
                  originalValue = originalLayer.f ?? 'none';
                  currentValue = await extractFills(innerNode) ?? 'none';
                } else if (field === 'strokes') {
                  originalValue = originalLayer.s ?? 'none';
                  currentValue = await extractStrokes(innerNode) ?? 'none';
                } else if (field === 'cornerRadius') {
                  originalValue = originalLayer.r ?? '0';
                  currentValue = extractRadius(innerNode) ?? '0';
                } else if (field.startsWith('padding')) {
                  if (handledPadding) continue;
                  handledPadding = true;
                  fieldName = 'Отступы';
                  originalValue = originalLayer.p ?? '0,0,0,0';
                  currentValue = extractPadding(innerNode) ?? '0,0,0,0';
                } else if (field === 'itemSpacing') {
                  originalValue = originalLayer.i ?? '0';
                  currentValue = extractItemSpacing(innerNode) ?? '0';
                } else if (field === 'fontName' || field === 'fontSize') {
                  if (handledFont) continue;
                  handledFont = true;
                  fieldName = 'Шрифт';
                  originalValue = originalLayer.t ?? 'mixed';
                  currentValue = extractFont(innerNode) ?? 'mixed';
                }

                if (originalValue !== currentValue) {
                  results.components.push({
                    nodeId: innerNode.id, name: node.name, breadcrumb,
                    severity: 'warning',
                    errorType: `Изменено "${fieldName}" у [${innerNode.name}]: ${originalValue} → ${currentValue}`,
                    count: 1
                  });
                }
              }
            } catch (e) {
              const translatedFields = badFields.map((f: string) => OVERRIDE_NAMES[f] || f);
              results.components.push({
                nodeId: node.id, name: node.name, breadcrumb,
                severity: 'warning',
                errorType: `Изменены: ${translatedFields.join(', ')}`,
                count: 1
              });
            }
          }
        }
      }
    }
  }

  if (node.type === 'FRAME' && DS_COMPONENT_NAMES.has(node.name)) {
    if (node.parent?.type !== 'COMPONENT' && node.parent?.type !== 'COMPONENT_SET') {
      results.components.push({
        nodeId: node.id, name: node.name, breadcrumb,
        severity: 'error',
        errorType: 'Раздетаченный компонент (Frame с именем мастера ДС)',
        count: 1
      });
    }
  }

  if (node.type === 'COMPONENT_SET' || (node.type === 'COMPONENT' && node.parent?.type !== 'COMPONENT_SET')) {
    if (DS_COMPONENT_NAMES.has(node.name)) {
      results.components.push({
        nodeId: node.id, name: node.name, breadcrumb,
        severity: 'error',
        errorType: 'Локальный мастер-компонент (дубликат ДС)',
        count: 1
      });
    } else {
      results.components.push({
        nodeId: node.id, name: node.name, breadcrumb,
        severity: 'info',
        errorType: 'Локальный кастомный компонент',
        count: 1
      });
    }
  }
}
