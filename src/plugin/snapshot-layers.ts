import {
  extractFills,
  extractStrokes,
  extractRadius,
  extractPadding,
  extractItemSpacing,
  extractFont,
} from './extractors';

export async function buildLayerTree(node: SceneNode, layers: Record<string, string>) {
  const parts: string[] = [];

  const fills = await extractFills(node);
  if (fills) parts.push(`f:${fills}`);

  const strokes = await extractStrokes(node);
  if (strokes) parts.push(`s:${strokes}`);

  const radius = extractRadius(node);
  if (radius) parts.push(`r:${radius}`);

  const padding = extractPadding(node);
  if (padding) parts.push(`p:${padding}`);

  const itemSpacing = extractItemSpacing(node);
  if (itemSpacing) parts.push(`i:${itemSpacing}`);

  const font = extractFont(node);
  if (font) parts.push(`t:${font}`);

  if (parts.length > 0) layers[node.name] = parts.join('|');

  if ('children' in node) {
    for (const child of node.children) {
      await buildLayerTree(child, layers);
    }
  }
}
