import { Scope, ScanResult, VariableUsageInfo, InternalUsage, BindingLocation } from './types';
import { perf, ms, send } from './utils';

export let scanData: Map<string, InternalUsage> | null = null;

export function setScanData(data: Map<string, InternalUsage>) {
  scanData = data;
}

export function hydrateSync(rawMap: Map<string, BindingLocation[]>): Map<string, InternalUsage> {
  const result = new Map<string, InternalUsage>();
  const collectionCache = new Map<string, string>();

  for (const [variableId, locations] of rawMap.entries()) {
    const variable = figma.variables.getVariableById(variableId);
    if (!variable) continue;

    const colId = variable.variableCollectionId;
    let colName = collectionCache.get(colId);
    if (colName === undefined) {
      const col = figma.variables.getVariableCollectionById(colId);
      colName = col?.name ?? '(unknown)';
      collectionCache.set(colId, colName);
    }

    result.set(variableId, {
      variableId,
      variableName: variable.name,
      collectionName: colName,
      locations,
    });
  }
  return result;
}

export function processMigratorResults(rawMap: Map<string, BindingLocation[]>, totalNodes: number, tTotal: number): ScanResult {
  scanData = hydrateSync(rawMap);
  const variables: VariableUsageInfo[] = Array.from(scanData.values()).map(u => ({
    variableId: u.variableId,
    variableName: u.variableName,
    collectionName: u.collectionName,
    locationCount: u.locations.length,
    locations: u.locations.map(l => ({ nodeId: l.nodeId, nodeName: l.nodeName })),
  }));
  return { variables, nodeCount: totalNodes };
}
