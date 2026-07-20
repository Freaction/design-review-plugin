interface CachedVariable {
  name: string;
  collectionName: string;
  isPrimitive: boolean;
}

const variableCache = new Map<string, CachedVariable | null>();
const styleCache = new Map<string, string | null>();

export function clearCaches() {
  variableCache.clear();
  styleCache.clear();
}

export function getCachedVariableSync(id: string): CachedVariable | null | undefined {
  if (variableCache.has(id)) return variableCache.get(id);
  return undefined;
}

export async function getCachedVariable(id: string): Promise<CachedVariable | null> {
  const syncRes = getCachedVariableSync(id);
  if (syncRes !== undefined) return syncRes;

  try {
    const variable = await figma.variables.getVariableByIdAsync(id);
    if (!variable) { variableCache.set(id, null); return null; }

    const collection = await figma.variables.getVariableCollectionByIdAsync(variable.variableCollectionId);
    const collectionName = collection?.name ?? '';

    const result: CachedVariable = {
      name: variable.name,
      collectionName,
      isPrimitive: collectionName.toLowerCase() === 'primitives'
    };
    variableCache.set(id, result);
    return result;
  } catch {
    variableCache.set(id, null);
    return null;
  }
}

export function getCachedStyleNameSync(id: string): string | null | undefined {
  if (styleCache.has(id)) return styleCache.get(id);
  return undefined;
}

export async function getCachedStyleName(id: string): Promise<string | null> {
  const syncRes = getCachedStyleNameSync(id);
  if (syncRes !== undefined) return syncRes;

  try {
    const style = await figma.getStyleByIdAsync(id);
    const name = style?.name ?? null;
    styleCache.set(id, name);
    return name;
  } catch {
    styleCache.set(id, null);
    return null;
  }
}
