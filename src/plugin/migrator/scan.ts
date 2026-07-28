import { BindingLocation } from './types';
import { isAlias, isGradient } from './helpers';

const NODE_FIELDS: VariableBindableNodeField[] = [
  'width', 'height', 'opacity', 'cornerRadius',
  'topLeftRadius', 'topRightRadius', 'bottomLeftRadius', 'bottomRightRadius',
  'strokeWeight',
  'paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight',
  'itemSpacing', 'counterAxisSpacing',
  'minWidth', 'maxWidth', 'minHeight', 'maxHeight',
];

const TEXT_FIELDS: string[] = [
  'fontFamily', 'fontStyle', 'fontWeight', 'fontSize',
  'lineHeight', 'letterSpacing', 'paragraphSpacing', 'paragraphIndent',
];

const ALL_FIELDS: string[] = [...NODE_FIELDS, ...TEXT_FIELDS];

const EFFECT_FIELDS = ['color', 'offsetX', 'offsetY', 'blur', 'spread', 'radius'] as const;

function addLoc(map: Map<string, BindingLocation[]>, id: string, loc: BindingLocation): void {
  let arr = map.get(id);
  if (!arr) { arr = []; map.set(id, arr); }
  arr.push(loc);
}

export function scanNode(node: SceneNode, map: Map<string, BindingLocation[]>): void {
  const hasBV      = 'boundVariables' in node && node.boundVariables;
  const hasFillsBV = 'fills' in node && node.fills !== figma.mixed && Array.isArray(node.fills);
  const hasStrBV   = 'strokes' in node && Array.isArray(node.strokes);
  const hasEfxBV   = 'effects' in node && Array.isArray(node.effects);

  if (!hasBV && !hasFillsBV && !hasStrBV && !hasEfxBV) return;

  const nId   = node.id;
  const nName = node.name;

  if (hasBV) {
    const bv = node.boundVariables as Partial<Record<string, VariableAlias | VariableAlias[]>>;
    for (let i = 0; i < ALL_FIELDS.length; i++) {
      const field = ALL_FIELDS[i];
      const alias = bv[field];
      if (isAlias(alias)) addLoc(map, alias.id, { nodeId: nId, nodeName: nName, kind: 'field', field });
    }
  }

  if (hasFillsBV) {
    const fills = node.fills as Paint[];
    for (let i = 0; i < fills.length; i++) {
      const fill = fills[i];
      if (fill.type === 'SOLID') {
        const alias = (fill.boundVariables as { color?: VariableAlias } | undefined)?.color;
        if (alias) addLoc(map, alias.id, { nodeId: nId, nodeName: nName, kind: 'fill', index: i, field: 'color' });
      }
      if (isGradient(fill)) {
        const stops = (fill as GradientPaint).gradientStops;
        for (let j = 0; j < stops.length; j++) {
          const stopBv = (stops[j] as unknown as { boundVariables?: { color?: VariableAlias } }).boundVariables;
          if (stopBv?.color) addLoc(map, stopBv.color.id, { nodeId: nId, nodeName: nName, kind: 'gradientStop', fillIndex: i, stopIndex: j });
        }
      }
    }
  }

  if (hasStrBV) {
    const strokes = node.strokes as Paint[];
    for (let i = 0; i < strokes.length; i++) {
      const s = strokes[i];
      if (s.type === 'SOLID') {
        const alias = (s.boundVariables as { color?: VariableAlias } | undefined)?.color;
        if (alias) addLoc(map, alias.id, { nodeId: nId, nodeName: nName, kind: 'stroke', index: i, field: 'color' });
      }
    }
  }

  if (hasEfxBV) {
    const effects = node.effects as Effect[];
    for (let i = 0; i < effects.length; i++) {
      const bv = (effects[i] as unknown as { boundVariables?: Record<string, VariableAlias> }).boundVariables;
      if (!bv) continue;
      for (let fi = 0; fi < EFFECT_FIELDS.length; fi++) {
        const field = EFFECT_FIELDS[fi];
        const alias = bv[field];
        if (isAlias(alias)) addLoc(map, alias.id, { nodeId: nId, nodeName: nName, kind: 'effect', index: i, field });
      }
    }
  }
}
