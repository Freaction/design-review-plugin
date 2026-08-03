import { SNAPSHOT_REMOTE } from './snapshot-remote-config.js';

export async function fetchRemoteMeta() {
  const res = await fetch(SNAPSHOT_REMOTE.metaUrl, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Не удалось проверить эталон (${res.status})`);
  return res.json();
}

function fmtBytes(n) {
  if (!n || n < 0) return '0 B';
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

export async function fetchRemoteSnapshot(onProgress) {
  const res = await fetch(SNAPSHOT_REMOTE.snapshotUrl, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Не удалось скачать эталон (${res.status})`);

  const total = Number(res.headers.get('content-length')) || 0;
  const reader = res.body?.getReader?.();
  if (!reader) {
    onProgress?.({ phase: 'download', received: 0, total, label: 'Скачивание...' });
    const data = await res.json();
    if (!data || !Array.isArray(data.c)) throw new Error('Некорректный формат snapshot.json');
    return data;
  }

  const chunks = [];
  let received = 0;
  let lastUi = 0;
  const t0 = Date.now();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    received += value.byteLength;
    const now = Date.now();
    if (now - lastUi < 120) continue;
    lastUi = now;
    const pct = total ? Math.min(99, Math.round((received / total) * 100)) : null;
    onProgress?.({
      phase: 'download',
      received,
      total,
      elapsedMs: now - t0,
      label: total
        ? `Скачивание ${pct}% · ${fmtBytes(received)} / ${fmtBytes(total)}`
        : `Скачивание · ${fmtBytes(received)}`,
    });
    await new Promise(r => setTimeout(r, 0));
  }

  onProgress?.({
    phase: 'parse',
    received,
    total: total || received,
    elapsedMs: Date.now() - t0,
    label: `Разбор JSON · ${fmtBytes(received)}`,
  });

  const bytes = new Uint8Array(received);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  const text = new TextDecoder('utf-8').decode(bytes);
  const data = JSON.parse(text);
  if (!data || !Array.isArray(data.c)) throw new Error('Некорректный формат snapshot.json');
  return data;
}

export function compareVersions(localVersion, remoteVersion) {
  if (!remoteVersion) return 'unknown';
  if (!localVersion) return 'outdated';
  if (localVersion === remoteVersion) return 'current';
  if (localVersion > remoteVersion) return 'ahead';
  return 'outdated';
}
