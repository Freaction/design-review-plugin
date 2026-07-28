import { Scope } from './types';

export function isAlias(v: unknown): v is VariableAlias {
  return !!v && typeof v === 'object' && (v as VariableAlias).type === 'VARIABLE_ALIAS';
}

export function isGradient(paint: Paint): paint is GradientPaint {
  return paint.type === 'GRADIENT_LINEAR'
    || paint.type === 'GRADIENT_RADIAL'
    || paint.type === 'GRADIENT_ANGULAR'
    || paint.type === 'GRADIENT_DIAMOND';
}

export function hasFills(node: SceneNode): node is SceneNode & { fills: ReadonlyArray<Paint> } {
  return 'fills' in node && node.fills !== figma.mixed;
}

export function getRootNodes(scope: Scope): SceneNode[] {
  if (scope === 'selection') return [...figma.currentPage.selection];
  if (scope === 'page')      return [...figma.currentPage.children];
  const all: SceneNode[] = [];
  for (const page of figma.root.children) {
    for (const child of page.children) all.push(child);
  }
  return all;
}
