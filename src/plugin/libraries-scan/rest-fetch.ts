import { elapsed, logPerf, now } from './perf';

export async function fetchJson(
  url: string,
  token: string,
): Promise<{ ok: boolean; status: number; data: any; ms: number }> {
  const t0 = now();
  const res = await fetch(url, { headers: { 'X-Figma-Token': token } });
  if (res.status === 429) {
    logPerf('429 retry', elapsed(t0), url.slice(0, 80));
    await new Promise(r => setTimeout(r, 2000));
    return fetchJson(url, token);
  }
  if (!res.ok) return { ok: false, status: res.status, data: null, ms: elapsed(t0) };
  return { ok: true, status: res.status, data: await res.json(), ms: elapsed(t0) };
}

export async function resolveSeedFileKey(key: string, token: string): Promise<string | null> {
  const comp = await fetchJson(
    `https://api.figma.com/v1/components/${encodeURIComponent(key)}`,
    token,
  );
  if (comp.ok && comp.data?.meta?.file_key) return comp.data.meta.file_key;
  return null;
}

export async function resolveFileName(fileKey: string, token: string): Promise<string> {
  const meta = await fetchJson(`https://api.figma.com/v1/files/${fileKey}/meta`, token);
  const name = meta.data?.file?.name || meta.data?.name;
  if (meta.ok && name) return name;
  const file = await fetchJson(`https://api.figma.com/v1/files/${fileKey}?depth=1`, token);
  return file.data?.name || fileKey;
}
