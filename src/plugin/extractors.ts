import { getCachedVariable } from './cache';

export function rgbToHex(r: number, g: number, b: number) {
  const toHex = (c: number) => {
    const hex = Math.round(c * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return '#' + (toHex(r) + toHex(g) + toHex(b)).toUpperCase();
}

export async function extractFills(node: SceneNode): Promise<string | undefined> {
  if (!('fills' in node)) return undefined;
  const fills = node.fills as Paint[] | typeof figma.mixed;
  if (fills === figma.mixed) return 'mixed';
  if (!fills || fills.length === 0) return undefined;

  const boundFills = node.boundVariables?.fills;
  const result: string[] = [];

  for (let i = 0; i < fills.length; i++) {
    const bound = boundFills?.[i];
    if (bound?.type === 'VARIABLE_ALIAS') {
      const cached = await getCachedVariable(bound.id);
      result.push(cached ? cached.name : 'variable');
    } else if (fills[i].type === 'SOLID') {
      const solid = fills[i] as SolidPaint;
      result.push(rgbToHex(solid.color.r, solid.color.g, solid.color.b));
    } else {
      result.push(fills[i].type.toLowerCase());
    }
  }
  return result.join(', ');
}

export async function extractStrokes(node: SceneNode): Promise<string | undefined> {
  if (!('strokes' in node)) return undefined;
  const strokes = node.strokes as Paint[];
  if (!strokes || strokes.length === 0) return undefined;

  const boundStrokes = node.boundVariables?.strokes;
  const result: string[] = [];

  for (let i = 0; i < strokes.length; i++) {
    const bound = boundStrokes?.[i];
    if (bound?.type === 'VARIABLE_ALIAS') {
      const cached = await getCachedVariable(bound.id);
      result.push(cached ? cached.name : 'variable');
    } else if (strokes[i].type === 'SOLID') {
      const solid = strokes[i] as SolidPaint;
      result.push(rgbToHex(solid.color.r, solid.color.g, solid.color.b));
    } else {
      result.push(strokes[i].type.toLowerCase());
    }
  }
  return result.join(', ');
}

export function extractRadius(node: SceneNode): string | undefined {
  if (!('cornerRadius' in node)) return undefined;
  if (node.cornerRadius === figma.mixed) {
    const r = `${node.topLeftRadius},${node.topRightRadius},${node.bottomRightRadius},${node.bottomLeftRadius}`;
    return r === '0,0,0,0' ? undefined : r;
  }
  return node.cornerRadius === 0 ? undefined : String(node.cornerRadius);
}

export function extractPadding(node: SceneNode): string | undefined {
  if (!('paddingLeft' in node)) return undefined;
  const p = `${node.paddingTop},${node.paddingRight},${node.paddingBottom},${node.paddingLeft}`;
  return p === '0,0,0,0' ? undefined : p;
}

export function extractItemSpacing(node: SceneNode): string | undefined {
  if (!('itemSpacing' in node)) return undefined;
  return node.itemSpacing === 0 ? undefined : String(node.itemSpacing);
}

export function extractFont(node: SceneNode): string | undefined {
  if (node.type !== 'TEXT') return undefined;
  const font = node.fontName;
  if (font === figma.mixed) return 'mixed';
  return `${(font as FontName).family} ${(font as FontName).style}, ${node.fontSize}px`;
}

export function getNodePath(node: SceneNode, rootId: string): string {
  let path = node.name;
  let current = node.parent;
  while (current && current.id !== rootId && current.type !== 'PAGE' && current.type !== 'DOCUMENT') {
    path = current.name + '/' + path;
    current = current.parent;
  }
  return path;
}
