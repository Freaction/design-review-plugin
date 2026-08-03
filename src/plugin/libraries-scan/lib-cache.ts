import { isFigmaFileKey } from '../figma-file-key';

type Resolved = { libraryName: string; fileKey: string };

const CACHE_KEY = 'lib_key_cache_v2';
const FAIL_KEY = 'lib_key_fail_v2';
const MAX_KEYS = 1200;
const MAX_FAILS = 2000;

type Compact = {
  libs: Record<string, string>;
  keys: Record<string, string>;
};

export async function loadResolvedCache(): Promise<Map<string, Resolved>> {
  const map = new Map<string, Resolved>();
  try {
    const raw = await figma.clientStorage.getAsync(CACHE_KEY);
    if (!raw || typeof raw !== 'object') return map;
    const { libs, keys } = raw as Compact;
    if (!libs || !keys) return map;
    for (const [k, fileKey] of Object.entries(keys)) {
      const libraryName = libs[fileKey];
      if (libraryName && isFigmaFileKey(fileKey)) {
        map.set(k, { fileKey, libraryName });
      }
    }
  } catch {
    return map;
  }
  return map;
}

export async function saveResolvedCache(
  map: Map<string, Resolved>,
  keepKeys: string[],
): Promise<void> {
  const libs: Record<string, string> = {};
  const keys: Record<string, string> = {};
  let n = 0;
  for (const key of keepKeys) {
    if (n >= MAX_KEYS) break;
    const v = map.get(key);
    if (!v || !isFigmaFileKey(v.fileKey)) continue;
    keys[key] = v.fileKey;
    libs[v.fileKey] = v.libraryName;
    n++;
  }
  try {
    await figma.clientStorage.setAsync(CACHE_KEY, { libs, keys } satisfies Compact);
  } catch {
    try {
      await figma.clientStorage.deleteAsync(CACHE_KEY);
      await figma.clientStorage.setAsync(CACHE_KEY, { libs, keys });
    } catch {}
  }
}

export async function loadFailCache(): Promise<Set<string>> {
  try {
    const raw = await figma.clientStorage.getAsync(FAIL_KEY);
    return new Set(Array.isArray(raw) ? raw.filter(x => typeof x === 'string') : []);
  } catch {
    return new Set();
  }
}

export async function saveFailCache(fails: Set<string>): Promise<void> {
  const list = [...fails].slice(-MAX_FAILS);
  try {
    await figma.clientStorage.setAsync(FAIL_KEY, list);
  } catch {
    try {
      await figma.clientStorage.deleteAsync(FAIL_KEY);
      await figma.clientStorage.setAsync(FAIL_KEY, list.slice(-500));
    } catch {}
  }
}

export type { Resolved };
