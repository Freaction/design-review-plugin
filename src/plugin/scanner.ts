import { validateComponent } from './validators/components';
import { validateVariables, clearVariablesValidatorCache } from './validators/variables';
import { validateGradients } from './validators/gradients';
import { validateEffects } from './validators/effects';
import type { ComponentSnapshot } from './snapshot';
import { clearCaches } from './cache';
import { scanNode as scanNodeForMigrator } from './migrator/scan';
import type { BindingLocation } from './migrator/types';
import { FIGJAM_SKIP_TYPES } from './scan-config';

export function isIconNode(node: BaseNode): boolean {
  const lowerName = node.name.toLowerCase();
  if (lowerName.includes('icon')) return true;
  const parent = node.parent;
  if (parent && parent.type !== 'PAGE' && parent.type !== 'DOCUMENT') {
    if (parent.name.toLowerCase().includes('icon')) return true;
  }
  return false;
}

export function resetNodesScannedCount() {
  clearCaches();
  clearVariablesValidatorCache();
}

export function getBreadcrumb(node: BaseNode): string {
  const parts: string[] = [];
  let current = node.parent;
  while (current && current.type !== 'PAGE' && current.type !== 'DOCUMENT') {
    if (current.type === 'SECTION' || current.parent?.type === 'PAGE') {
      parts.unshift(current.name);
    }
    current = current.parent;
  }
  return parts.slice(0, 2).join(' / ');
}

export async function scanNode(
  node: SceneNode,
  results: any,
  snapshot: Map<string, ComponentSnapshot> | null,
  insideComponent: boolean = false,
  breadcrumb: string = '',
  onProgress?: (count: number) => void,
  counter: { n: number } = { n: 0 },
  migratorMap: Map<string, BindingLocation[]>
): Promise<void> {
  if ('visible' in node && !node.visible) return;
  if (FIGJAM_SKIP_TYPES.has(node.type)) return;

  const lowerName = node.name.toLowerCase();
  if (lowerName === 'mask' || lowerName === 'union') return;

  counter.n++;

  if (onProgress && counter.n % 500 === 0) {
    onProgress(counter.n);
    await new Promise(resolve => setTimeout(resolve, 5));
  }

  const isComp =
    insideComponent ||
    node.type === 'INSTANCE' ||
    node.type === 'COMPONENT' ||
    node.type === 'COMPONENT_SET';

  const nodeBreadcrumb = breadcrumb || (node.parent?.type === 'PAGE' ? node.name : getBreadcrumb(node));

  scanNodeForMigrator(node, migratorMap);

  const needsComponentValidation = node.type === 'INSTANCE' || node.type === 'FRAME' || node.type === 'COMPONENT_SET' || node.type === 'COMPONENT';
  if (needsComponentValidation) {
    await validateComponent(node, results, snapshot, nodeBreadcrumb);
  }

  const needsVariablesValidation = ('fills' in node && Array.isArray(node.fills) && node.fills.length > 0) || ('strokes' in node && Array.isArray(node.strokes) && node.strokes.length > 0) || node.type === 'TEXT';
  if (needsVariablesValidation) {
    await validateVariables(node, results, isComp, nodeBreadcrumb);
  }

  const needsGradientValidation = ('fills' in node && Array.isArray(node.fills) && node.fills.length > 0);
  if (needsGradientValidation) {
    await validateGradients(node, results, nodeBreadcrumb);
  }

  validateEffects(node, results, isComp, nodeBreadcrumb);

  if (node.type === 'VECTOR' || node.type === 'BOOLEAN_OPERATION') return;

  if ('children' in node) {
    for (const child of node.children) {
      await scanNode(child, results, snapshot, isComp, nodeBreadcrumb, onProgress, counter, migratorMap);
    }
  }
}
