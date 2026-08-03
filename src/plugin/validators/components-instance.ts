import type { ComponentSnapshot } from '../snapshot';
import { extractFills, extractStrokes, extractRadius, extractPadding, extractItemSpacing, extractFont } from '../extractors';

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
  fontSize: 'Размер шрифта',
};
const OVERRIDE_KEYS = new Set(Object.keys(OVERRIDE_NAMES));

export async function validateInstanceOverrides(
  node: InstanceNode,
  mc: ComponentNode,
  snapshot: Map<string, ComponentSnapshot>,
  breadcrumb: string,
  results: any,
) {
  if (!mc.remote) return;

  const known = snapshot.get(mc.key);
  if (!known) return;
  if (!node.overrides?.length) return;

  for (const override of node.overrides) {
    const badFields = override.overriddenFields.filter((f: string) => OVERRIDE_KEYS.has(f));
    if (!badFields.length) continue;

    try {
      const innerNode = (await figma.getNodeByIdAsync(override.id)) as SceneNode | null;
      if (!innerNode) continue;

      const originalLayerStr = known.l?.[innerNode.name];
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
          currentValue = (await extractFills(innerNode)) ?? 'none';
        } else if (field === 'strokes') {
          originalValue = originalLayer.s ?? 'none';
          currentValue = (await extractStrokes(innerNode)) ?? 'none';
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
            nodeId: innerNode.id,
            name: node.name,
            breadcrumb,
            severity: 'warning',
            errorType: `Изменено "${fieldName}" у [${innerNode.name}]: ${originalValue} → ${currentValue}`,
            count: 1,
          });
        }
      }
    } catch {
      const translatedFields = badFields.map((f: string) => OVERRIDE_NAMES[f] || f);
      results.components.push({
        nodeId: node.id,
        name: node.name,
        breadcrumb,
        severity: 'warning',
        errorType: `Изменены: ${translatedFields.join(', ')}`,
        count: 1,
      });
    }
  }
}
