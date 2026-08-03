import { BindingLocation } from './types';
import { isGradient, hasFills } from './helpers';

export async function applyVariable(loc: BindingLocation, variable: Variable): Promise<void> {
  const node = (await figma.getNodeByIdAsync(loc.nodeId)) as SceneNode | null;
  if (!node) return;

  switch (loc.kind) {
    case 'field': {
      (node as SceneNode & { setBoundVariable(f: VariableBindableNodeField, v: Variable | null): void })
        .setBoundVariable(loc.field as VariableBindableNodeField, variable);
      break;
    }
    case 'fill': {
      if (!hasFills(node)) break;
      const fills = [...node.fills as Paint[]];
      const fill  = fills[loc.index];
      if (!fill || fill.type !== 'SOLID') break;
      fills[loc.index] = figma.variables.setBoundVariableForPaint(fill, 'color', variable);
      (node as GeometryMixin).fills = fills;
      break;
    }
    case 'gradientStop': {
      if (!hasFills(node)) break;
      const fills = [...node.fills as Paint[]];
      const fill  = fills[loc.fillIndex] as GradientPaint;
      if (!fill || !isGradient(fill)) break;
      const newStops = fill.gradientStops.map((stop, j) =>
        j !== loc.stopIndex
          ? stop
          : { ...stop, boundVariables: { color: figma.variables.createVariableAlias(variable) } }
      );
      fills[loc.fillIndex] = { ...fill, gradientStops: newStops as ColorStop[] };
      (node as GeometryMixin).fills = fills;
      break;
    }
    case 'stroke': {
      if (!('strokes' in node)) break;
      const strokes = [...node.strokes as Paint[]];
      const stroke  = strokes[loc.index];
      if (!stroke || stroke.type !== 'SOLID') break;
      strokes[loc.index] = figma.variables.setBoundVariableForPaint(stroke, 'color', variable);
      (node as GeometryMixin).strokes = strokes;
      break;
    }
    case 'effect': {
      if (!('effects' in node)) break;
      const effects = [...node.effects as Effect[]];
      const effect  = effects[loc.index];
      if (!effect) break;
      effects[loc.index] = figma.variables.setBoundVariableForEffect(
        effect,
        loc.field as VariableBindableEffectField,
        variable
      );
      (node as BlendMixin).effects = effects;
      break;
    }
  }
}
