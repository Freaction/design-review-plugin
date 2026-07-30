import { SNAPSHOT_REMOTE } from './snapshot-remote-config.js';

export async function fetchRemoteMeta() {
  const res = await fetch(SNAPSHOT_REMOTE.metaUrl, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Не удалось проверить эталон (${res.status})`);
  return res.json();
}

export async function fetchRemoteSnapshot() {
  const res = await fetch(SNAPSHOT_REMOTE.snapshotUrl, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Не удалось скачать эталон (${res.status})`);
  const data = await res.json();
  if (!data || !Array.isArray(data.c)) throw new Error('Некорректный формат snapshot.json');
  return data;
}

export function compareVersions(localVersion, remoteVersion) {
  if (!remoteVersion) return 'unknown';
  if (!localVersion) return 'outdated';
  if (localVersion === remoteVersion) return 'current';
  return 'outdated';
}
