export function groupIssues(items, keyFn) {
  const grouped = new Map();
  for (const item of items || []) {
    const key = keyFn(item);
    if (grouped.has(key)) {
      const existing = grouped.get(key);
      existing.count += 1;
      if (item.nodeId && !existing.nodeIds.includes(item.nodeId)) {
        existing.nodeIds.push(item.nodeId);
      }
    } else {
      grouped.set(key, {
        ...item,
        count: 1,
        nodeIds: item.nodeId ? [item.nodeId] : [],
      });
    }
  }
  return Array.from(grouped.values());
}
