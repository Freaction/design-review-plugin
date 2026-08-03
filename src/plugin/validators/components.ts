import { DS_COMPONENT_NAMES } from '../ds_names';
import type { ComponentSnapshot } from '../snapshot';
import { validateInstanceOverrides } from './components-instance';

async function resolveMainComponent(node: InstanceNode): Promise<ComponentNode | null> {
  try {
    return await node.getMainComponentAsync();
  } catch {
    return null;
  }
}

function getMasterParentName(mc: ComponentNode): string | null {
  return mc.parent?.type === 'COMPONENT_SET' ? mc.parent.name : null;
}

function validateInstanceSnapshot(
  node: InstanceNode,
  mc: ComponentNode,
  snapshot: Map<string, ComponentSnapshot>,
  breadcrumb: string,
  results: any,
) {
  if (!mc.remote) return;

  const known = snapshot.get(mc.key);
  const parentName = getMasterParentName(mc);

  if (!known) {
    const isDS = DS_COMPONENT_NAMES.has(mc.name) || (parentName && DS_COMPONENT_NAMES.has(parentName));
    if (!isDS) return;
    const displayName = parentName ? `${parentName} / ${mc.name}` : mc.name;
    results.components.push({
      nodeId: node.id,
      name: node.name,
      breadcrumb,
      severity: 'error',
      errorType: `Устаревший компонент ДС: "${displayName}" не найден в эталоне`,
      count: 1,
    });
    return;
  }

  if (known.n !== mc.name) {
    const displayName = known.p ? `${known.p} / ${known.n}` : known.n;
    results.components.push({
      nodeId: node.id,
      name: node.name,
      breadcrumb,
      severity: 'error',
      errorType: `Переименован в ките → теперь: "${displayName}"`,
      count: 1,
    });
  }
}

export async function validateComponent(
  node: SceneNode,
  results: any,
  snapshot: Map<string, ComponentSnapshot> | null = null,
  breadcrumb: string = '',
) {
  if (node.type === 'INSTANCE') {
    const mc = await resolveMainComponent(node);
    if (snapshot && mc) {
      validateInstanceSnapshot(node, mc, snapshot, breadcrumb, results);
      await validateInstanceOverrides(node, mc, snapshot, breadcrumb, results);
    }
  }

  if (node.type === 'FRAME' && DS_COMPONENT_NAMES.has(node.name)) {
    if (node.parent?.type !== 'COMPONENT' && node.parent?.type !== 'COMPONENT_SET') {
      results.components.push({
        nodeId: node.id,
        name: node.name,
        breadcrumb,
        severity: 'error',
        errorType: 'Раздетаченный компонент (Frame с именем мастера ДС)',
        count: 1,
      });
    }
  }

  if (node.type === 'COMPONENT_SET' || (node.type === 'COMPONENT' && node.parent?.type !== 'COMPONENT_SET')) {
    if (DS_COMPONENT_NAMES.has(node.name)) {
      results.components.push({
        nodeId: node.id,
        name: node.name,
        breadcrumb,
        severity: 'error',
        errorType: 'Локальный мастер-компонент (дубликат ДС)',
        count: 1,
      });
    } else {
      results.components.push({
        nodeId: node.id,
        name: node.name,
        breadcrumb,
        severity: 'info',
        errorType: 'Локальный кастомный компонент',
        count: 1,
      });
    }
  }
}
