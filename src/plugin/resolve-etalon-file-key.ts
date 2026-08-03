import { pickFileKey } from './figma-file-key';
import { loadFigmaToken } from './figma-token';
import { resolveSeedFileKey } from './libraries-scan/rest-fetch';

export async function resolveEtalonFileKey(
  stored: string | undefined,
  sampleKeys: string[],
  token?: string | null,
): Promise<string | undefined> {
  const direct = pickFileKey(stored, figma.fileKey);
  if (direct) return direct;

  const pat = token === undefined ? await loadFigmaToken() : token;
  if (!pat || !sampleKeys.length) return undefined;

  for (const key of sampleKeys) {
    if (!key || key.startsWith('broken:')) continue;
    const fileKey = pickFileKey(await resolveSeedFileKey(key, pat));
    if (fileKey) return fileKey;
  }
  return undefined;
}
