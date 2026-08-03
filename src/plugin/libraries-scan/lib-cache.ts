import { isFigmaFileKey } from '../figma-file-key';

type Resolved = { libraryName: string; fileKey: string };
type CacheStore = Record<string, Resolved>;

const CACHE_KEY = 'lib_key_cache_v1';
const FAIL_KEY = 'lib_key_fail_v1';

export async function loadResolvedCache(): Promise<Map<string, Resolved>> {
  const raw = await figma.clientStorage.getAsync(CACHE_KEY);
  const map = new Map<string, Resolved>();
  if (raw && typeof raw === 'object') {
    for (const [k, v] of Object.entries(raw as CacheStore)) {
      if (v?.fileKey && v?.libraryName && isFigmaFileKey(v.fileKey)) map.set(k, v);
    }
  }
  return map;
}

export async function saveResolvedCache(map: Map<string, Resolved>): Promise<void> {
  const obj: CacheStore = {};
  for (const [k, v] of map) obj[k] = v;
  await figma.clientStorage.setAsync(CACHE_KEY, obj);
}

export async function loadFailCache(): Promise<Set<string>> {
  const raw = await figma.clientStorage.getAsync(FAIL_KEY);
  return new Set(Array.isArray(raw) ? raw.filter(x => typeof x === 'string') : []);
}

export async function saveFailCache(fails: Set<string>): Promise<void> {
  await figma.clientStorage.setAsync(FAIL_KEY, [...fails]);
}

export type { Resolved };
