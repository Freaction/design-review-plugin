import { getCachedVariable, getCachedVariableSync, getCachedStyleName, getCachedStyleNameSync } from '../cache';

const isTarget = (name: string) =>
  name.includes('bonus') || name.includes('gamefication') || name.includes('gamification');

export async function validateGradients(node: SceneNode, results: any, breadcrumb: string) {
  if (node.type === 'VECTOR' || node.type === 'BOOLEAN_OPERATION') return;
  if (!('fills' in node) || !node.fills) return;

  if (node.fillStyleId && typeof node.fillStyleId === 'string') {
    let styleName = getCachedStyleNameSync(node.fillStyleId);
    if (styleName === undefined) {
      styleName = await getCachedStyleName(node.fillStyleId);
    }
    if (styleName && isTarget(styleName.toLowerCase())) {
      results.gradients.push({
        nodeId: node.id, name: node.name, breadcrumb,
        severity: 'info',
        errorType: `Целевой стиль: ${styleName}`,
        count: 1
      });
    }
  }

  const fills = node.fills as Paint[];
  const boundFills = node.boundVariables?.fills;
  const reportedTokens = new Set<string>();

  for (let i = 0; i < fills.length; i++) {
    const paint = fills[i];

    const boundVar = boundFills?.[i];
    if (boundVar?.type === 'VARIABLE_ALIAS') {
      let cached = getCachedVariableSync(boundVar.id);
      if (cached === undefined) {
        cached = await getCachedVariable(boundVar.id);
      }
      if (cached && isTarget(cached.name.toLowerCase())) {
        if (!reportedTokens.has(cached.name)) {
          reportedTokens.add(cached.name);
          results.gradients.push({
            nodeId: node.id, name: node.name, breadcrumb,
            severity: 'info',
            errorType: `Целевой токен: ${cached.name}`,
            count: 1
          });
        }
      }
    }

    if (paint.type.startsWith('GRADIENT_') && 'gradientStops' in paint) {
      let hasAnyToken = false;

      for (const stop of paint.gradientStops) {
        if (stop.boundVariables?.color) {
          hasAnyToken = true;
          let cached = getCachedVariableSync(stop.boundVariables.color.id);
          if (cached === undefined) {
            cached = await getCachedVariable(stop.boundVariables.color.id);
          }
          if (cached && isTarget(cached.name.toLowerCase())) {
            if (!reportedTokens.has(cached.name)) {
              reportedTokens.add(cached.name);
              results.gradients.push({
                nodeId: node.id, name: node.name, breadcrumb,
                severity: 'info',
                errorType: `Токен в градиенте: ${cached.name}`,
                count: 1
              });
            }
          }
        }
      }

      if (!hasAnyToken && !node.fillStyleId) {
        results.gradients.push({
          nodeId: node.id, name: node.name, breadcrumb,
          severity: 'error',
          errorType: 'Хардкодный градиент без токенов и стиля',
          count: 1
        });
      }
    }
  }
}
