export async function focusNodesByIds(nodeIds: string[]) {
  const unique = [...new Set((nodeIds || []).filter(Boolean))];
  if (!unique.length) return;

  const nodes: SceneNode[] = [];
  for (const id of unique) {
    const node = await figma.getNodeByIdAsync(id);
    if (node && 'x' in node) nodes.push(node as SceneNode);
  }

  if (!nodes.length) return;
  figma.currentPage.selection = nodes;
  figma.viewport.scrollAndZoomIntoView(nodes);
}
