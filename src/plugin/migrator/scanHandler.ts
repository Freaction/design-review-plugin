import { ScanResult, VariableUsageInfo, InternalUsage, BindingLocation } from './types';
import { getCachedVariable } from '../cache';

export let scanData: Map<string, InternalUsage> | null = null;

async function hydrate(rawMap: Map<string, BindingLocation[]>): Promise<Map<string, InternalUsage>> {
  const result = new Map<string, InternalUsage>();

  for (const [variableId, locations] of rawMap.entries()) {
    const variable = await getCachedVariable(variableId);
    if (!variable) continue;

    result.set(variableId, {
      variableId,
      variableName: variable.name,
      collectionName: variable.collectionName || '(unknown)',
      locations,
    });
  }
  return result;
}

export async function processMigratorResults(
  rawMap: Map<string, BindingLocation[]>,
  totalNodes: number,
): Promise<ScanResult> {
  scanData = await hydrate(rawMap);
  const variables: VariableUsageInfo[] = Array.from(scanData.values()).map(u => ({
    variableId: u.variableId,
    variableName: u.variableName,
    collectionName: u.collectionName,
    locationCount: u.locations.length,
    locations: u.locations.map(l => ({ nodeId: l.nodeId, nodeName: l.nodeName })),
  }));
  return { variables, nodeCount: totalNodes };
}
