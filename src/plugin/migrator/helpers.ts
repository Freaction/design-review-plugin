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
