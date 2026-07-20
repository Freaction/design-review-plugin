import { VALID_TEXT_VARIABLES } from '../textVariablesWhitelist';
import { getCachedVariable, getCachedVariableSync, getCachedStyleName, getCachedStyleNameSync } from '../cache';
import { isIconNode } from '../scanner';

function rgbToHex(r: number, g: number, b: number) {
  const toHex = (c: number) => {
    const hex = Math.round(c * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return '#' + (toHex(r) + toHex(g) + toHex(b)).toUpperCase();
}

const IGNORED_HEXES = new Set(['#FF8282', '#FFE0E0', '#9747FF']);

const paintCache = new Map<string, { severity: string, errorType: string }[]>();

export function clearVariablesValidatorCache() {
  paintCache.clear();
}

async function checkPaints(
  node: SceneNode,
  results: any,
  paints: ReadonlyArray<Paint>,
  boundVars: Record<string, VariableAlias> | undefined,
  context: string,
  breadcrumb: string
) {
  const cacheKey = JSON.stringify(paints) + '|' + JSON.stringify(boundVars) + '|' + context;
  if (paintCache.has(cacheKey)) {
    const cachedErrors = paintCache.get(cacheKey)!;
    for (const err of cachedErrors) {
      results.variables.push({
        nodeId: node.id, name: node.name, breadcrumb,
        severity: err.severity,
        errorType: err.errorType,
        count: 1
      });
    }
    return;
  }

  const generatedErrors: { severity: string, errorType: string }[] = [];

  for (let i = 0; i < paints.length; i++) {
    if (paints[i].visible === false) {
      generatedErrors.push({
        severity: 'info',
        errorType: `Скрытая заливка/обводка (закрыт глазик) в ${context}`
      });
      continue;
    }

    if (paints[i].type !== 'SOLID') continue;
    const boundVar = boundVars?.[i];

    if (boundVar?.type === 'VARIABLE_ALIAS') {
      let cached = getCachedVariableSync(boundVar.id);
      if (cached === undefined) {
         cached = await getCachedVariable(boundVar.id);
      }
      if (cached?.isPrimitive) {
        generatedErrors.push({
          severity: 'warning',
          errorType: `Примитив вместо семантики (${context}): ${cached.name}`
        });
      }
    } else {
      const solid = paints[i] as SolidPaint;
      const hex = rgbToHex(solid.color.r, solid.color.g, solid.color.b);
      if (!IGNORED_HEXES.has(hex)) {
        generatedErrors.push({
          severity: 'error',
          errorType: `Используется Hex (${hex}) в ${context} вместо переменной`
        });
      }
    }
  }

  paintCache.set(cacheKey, generatedErrors);

  for (const err of generatedErrors) {
    results.variables.push({
      nodeId: node.id, name: node.name, breadcrumb,
      severity: err.severity,
      errorType: err.errorType,
      count: 1
    });
  }
}

export async function validateVariables(node: SceneNode, results: any, insideComponent: boolean, breadcrumb: string) {
  if (node.type === 'SECTION') return;
  
  const isDirectlyOnPageOrSection = node.parent?.type === 'PAGE' || node.parent?.type === 'SECTION';
  
  // Если узел лежит прямо на странице или в секции: пропускаем векторы, картинки и обычные шейпы,
  // НО не пропускаем иконки, если они явно являются иконками по названию.
  if (isDirectlyOnPageOrSection) {
    if (!isIconNode(node)) {
      return;
    }
  }

  if (node.type === 'TEXT') {
    if (!insideComponent) return;

    const fills = node.fills;
    let hasColorBinding = false;

    if (fills === figma.mixed) {
      results.variables.push({
        nodeId: node.id, name: node.name, breadcrumb,
        severity: 'error',
        errorType: 'Смешанный цвет у текста (mixed fills)',
        count: 1
      });
      hasColorBinding = true; // пропускаем проверку на Hex
    } else if (Array.isArray(fills) && fills.length > 0) {
      const boundVar = node.boundVariables?.fills?.[0];
      if (boundVar?.type === 'VARIABLE_ALIAS') {
        hasColorBinding = true;
        let cached = getCachedVariableSync(boundVar.id);
        if (cached === undefined) cached = await getCachedVariable(boundVar.id);
        
        if (cached) {
          if (cached.isPrimitive) {
            results.variables.push({
              nodeId: node.id, name: node.name, breadcrumb,
              severity: 'warning',
              errorType: `Примитив вместо семантики (текст): ${cached.name}`,
              count: 1
            });
          } else if (!VALID_TEXT_VARIABLES.has(cached.name)) {
            results.variables.push({
              nodeId: node.id, name: node.name, breadcrumb,
              severity: 'warning',
              errorType: `Некорректная переменная текста: ${cached.name}`,
              count: 1
            });
          }
        }
      }
    }

    if (!hasColorBinding && fills !== figma.mixed) {
      if (Array.isArray(fills) && fills.length === 0) {
        results.variables.push({
          nodeId: node.id, name: node.name, breadcrumb,
          severity: 'warning',
          errorType: 'У текста отсутствует заливка (цвет)',
          count: 1
        });
      } else {
        let isIgnored = false;
        if (Array.isArray(fills) && fills[0]?.type === 'SOLID') {
          const solid = fills[0] as SolidPaint;
          const hex = rgbToHex(solid.color.r, solid.color.g, solid.color.b);
          if (IGNORED_HEXES.has(hex)) isIgnored = true;
        }
        
        if (!isIgnored) {
          results.variables.push({
            nodeId: node.id, name: node.name, breadcrumb,
            severity: 'error',
            errorType: 'Отвязан цвет у текста (используется Hex вместо переменной)',
            count: 1
          });
        }
      }
    }

    if (node.textStyleId === figma.mixed) {
      results.variables.push({
        nodeId: node.id, name: node.name, breadcrumb,
        severity: 'error',
        errorType: 'Смешанный стиль текста (mixed)',
        count: 1
      });
    } else if (!node.textStyleId) {
      results.variables.push({
        nodeId: node.id, name: node.name, breadcrumb,
        severity: 'error',
        errorType: 'Отвязан стиль текста (typography)',
        count: 1
      });
    } else if (typeof node.textStyleId === 'string') {
      let style = getCachedStyleNameSync(node.textStyleId);
      if (style === undefined) style = await getCachedStyleName(node.textStyleId);
      
      if (style === null) {
        results.variables.push({
          nodeId: node.id, name: node.name, breadcrumb,
          severity: 'error',
          errorType: 'Текстовый стиль не найден в библиотеке (удалён?)',
          count: 1
        });
      }
    }
    return;
  }

  if (node.type === 'VECTOR' || node.type === 'BOOLEAN_OPERATION') {
    if (!isIconNode(node)) return;
  }

  if ('fills' in node) {
    const fills = node.fills as Paint[];
    if (fills?.length) {
      await checkPaints(node, results, fills, node.boundVariables?.fills as any, 'fills', breadcrumb);
    }
  }

  if ('strokes' in node && node.type !== 'COMPONENT_SET') {
    const strokes = node.strokes as Paint[];
    if (strokes?.length) {
      await checkPaints(node, results, strokes, node.boundVariables?.strokes as any, 'strokes', breadcrumb);
    }
  }
}
