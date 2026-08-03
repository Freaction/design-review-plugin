export type LibComponentGroup = {
  key: string;
  name: string;
  count: number;
  nodeIds: string[];
};

export type LibCategory = {
  id: string;
  title: string;
  components: LibComponentGroup[];
};

export type LibAccGroup = {
  name: string;
  category: string;
  nodeIds: string[];
};

export type LibAcc = Map<string, LibAccGroup>;

export type LibScanResult = {
  categories: LibCategory[];
  instanceTotal: number;
  remoteCount: number;
  localCount: number;
  brokenCount: number;
  usedRest: boolean;
};
