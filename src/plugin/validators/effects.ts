const EFFECT_TYPE_NAMES: Record<string, string> = {
  DROP_SHADOW: 'Тень (Drop Shadow)',
  INNER_SHADOW: 'Внутренняя тень (Inner Shadow)',
  LAYER_BLUR: 'Размытие слоя (Blur)',
  BACKGROUND_BLUR: 'Размытие фона (Backdrop Blur)'
};

export function validateEffects(node: SceneNode, results: any, insideComponent: boolean, breadcrumb: string) {
  if (node.type === 'VECTOR' || node.type === 'BOOLEAN_OPERATION') return;
  if (node.parent?.type === 'PAGE') return;
  if (!('effects' in node)) return;

  const effects = node.effects as Effect[];
  if (!effects || effects.length === 0) return;

  const hasStyleId = node.effectStyleId && typeof node.effectStyleId === 'string' && node.effectStyleId !== '';
  if (hasStyleId) return;

  const activeEffects = effects.filter(e => e.visible !== false);
  if (activeEffects.length === 0) return;

  const effectNames = activeEffects
    .map(e => EFFECT_TYPE_NAMES[e.type] || e.type)
    .join(', ');

  results.variables.push({
    nodeId: node.id, name: node.name, breadcrumb,
    severity: 'warning',
    errorType: `Хардкодный эффект без стиля: ${effectNames}`,
    count: 1
  });
}
