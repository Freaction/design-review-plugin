export function focusNodes(nodeIds) {
  const ids = [...new Set((nodeIds || []).filter(Boolean))];
  if (!ids.length) return;
  parent.postMessage({ pluginMessage: { type: 'focus-nodes', nodeIds: ids } }, '*');
}
