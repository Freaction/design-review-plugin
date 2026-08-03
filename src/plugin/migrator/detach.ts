import { DetachResult, InternalUsage, BindingLocation } from './types';
import { send } from './utils';
import { hasFills, isGradient } from './helpers';

async function detachLocation(loc: BindingLocation): Promise<void> {
  const node = (await figma.getNodeByIdAsync(loc.nodeId)) as SceneNode | null;
  if (!node) return;

  switch (loc.kind) {
    case 'field': {
      (node as SceneNode & { setBoundVariable(f: VariableBindableNodeField, v: Variable | null): void })
        .setBoundVariable(loc.field as VariableBindableNodeField, null);
      break;
    }
    case 'fill': {
      if (!hasFills(node)) break;
      const fills = [...node.fills as Paint[]];
      const fill  = fills[loc.index];
      if (!fill || fill.type !== 'SOLID') break;
      const { boundVariables: _bv, ...rest } = fill as Paint & { boundVariables?: unknown };
      fills[loc.index] = { ...rest } as Paint;
      (node as GeometryMixin).fills = fills;
      break;
    }
    case 'gradientStop': {
      if (!hasFills(node)) break;
      const fills = [...node.fills as Paint[]];
      const fill  = fills[loc.fillIndex] as GradientPaint;
      if (!fill || !isGradient(fill)) break;
      const newStops = fill.gradientStops.map((stop, j) => {
        if (j !== loc.stopIndex) return stop;
        const { boundVariables: _bv, ...rest } = stop as ColorStop & { boundVariables?: unknown };
        return { ...rest } as ColorStop;
      });
      fills[loc.fillIndex] = { ...fill, gradientStops: newStops };
      (node as GeometryMixin).fills = fills;
      break;
    }
    case 'stroke': {
      if (!('strokes' in node)) break;
      const strokes = [...node.strokes as Paint[]];
      const stroke  = strokes[loc.index];
      if (!stroke || stroke.type !== 'SOLID') break;
      const { boundVariables: _bv, ...rest } = stroke as Paint & { boundVariables?: unknown };
      strokes[loc.index] = { ...rest } as Paint;
      (node as GeometryMixin).strokes = strokes;
      break;
    }
    case 'effect': {
      if (!('effects' in node)) break;
      const effects = [...node.effects as Effect[]];
      const effect  = effects[loc.index];
      if (!effect) break;
      const { boundVariables: _bv, ...rest } = effect as Effect & { boundVariables?: unknown };
      effects[loc.index] = { ...rest } as Effect;
      (node as BlendMixin).effects = effects;
      break;
    }
  }
}

export async function onDetachNotFound(
  scanData: Map<string, InternalUsage>,
  notFoundNames: string[]
): Promise<void> {
  if (!notFoundNames.length) {
    send('DETACH_COMPLETE', { result: { detached: 0, errors: [] } as DetachResult });
    return;
  }

  const nameSet = new Set(notFoundNames);
  let detached = 0;
  const errors: string[] = [];

  for (const [, usage] of scanData) {
    if (!nameSet.has(usage.variableName)) continue;
    for (const loc of usage.locations) {
      try {
        await detachLocation(loc);
        detached++;
      } catch {
        errors.push(`Detach failed: ${usage.variableName} → "${loc.nodeName}"`);
      }
    }
  }

  console.log(`Detach: ${detached} detached, ${errors.length} errors`);
  send('DETACH_COMPLETE', { result: { detached, errors } as DetachResult });
}
