export type Scope = 'selection' | 'page' | 'document';

export interface VariableUsageInfo {
  variableId: string;
  variableName: string;
  collectionName: string;
  locationCount: number;
}

export interface ScanResult {
  variables: VariableUsageInfo[];
  nodeCount: number;
}

export interface MigrateResult {
  replaced: number;
  notFound: string[];
  errors: string[];
}

export interface DetachResult {
  detached: number;
  errors: string[];
}

export interface LibraryCollectionInfo {
  key: string;
  name: string;
  libraryName: string;
}

export type BindingLocation =
  | { nodeId: string; nodeName: string; kind: 'field'; field: string }
  | { nodeId: string; nodeName: string; kind: 'fill';  index: number; field: 'color' }
  | { nodeId: string; nodeName: string; kind: 'stroke'; index: number; field: 'color' }
  | { nodeId: string; nodeName: string; kind: 'effect'; index: number; field: string }
  | { nodeId: string; nodeName: string; kind: 'gradientStop'; fillIndex: number; stopIndex: number };

export interface InternalUsage {
  variableId: string;
  variableName: string;
  collectionName: string;
  locations: BindingLocation[];
}
