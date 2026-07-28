import { MigrateResult, InternalUsage } from './types';
import { perf, ms, send, withRetry } from './utils';
import { applyVariable } from './apply';

export async function onMigrate(
  scanData: Map<string, InternalUsage>,
  collectionKeys: string[],
  dryRun: boolean = false
): Promise<void> {
  const tTotal = perf.now();

  const nameToKey = new Map<string, string>();
  for (const key of collectionKeys) {
    try {
      const vars = await withRetry(
        () => figma.teamLibrary.getVariablesInLibraryCollectionAsync(key),
        key.slice(0, 8)
      );
      for (const v of vars) {
        if (!nameToKey.has(v.name)) nameToKey.set(v.name, v.key);
      }
    } catch (e) {
      console.warn(`Collection [${key.slice(0, 8)}] unavailable: ${e}`);
    }
  }

  const toImport: { usage: InternalUsage; targetKey: string }[] = [];
  const notFound: string[] = [];
  const errors: string[] = [];

  let replaced = 0;
  for (const [, usage] of scanData) {
    const targetKey = nameToKey.get(usage.variableName);
    if (!targetKey) { notFound.push(usage.variableName); continue; }
    toImport.push({ usage, targetKey });
    if (dryRun) replaced += usage.locations.length;
  }

  if (dryRun) {
    const elapsed = ms(tTotal);
    console.log(`Migrate (dryRun): ${replaced} replaced, ${notFound.length} not found, ${errors.length} errors, ${elapsed}`);
    send('MIGRATE_COMPLETE', { result: { replaced, notFound, errors } as MigrateResult, elapsed, dryRun });
    return;
  }


  const BATCH = 5;
  const totalToMigrate = toImport.length;

  send('MIGRATE_START', { total: totalToMigrate });

  for (let i = 0; i < totalToMigrate; i += BATCH) {
    const batch = toImport.slice(i, i + BATCH);

    const results = await Promise.all(
      batch.map(item =>
        withRetry(() => figma.variables.importVariableByKeyAsync(item.targetKey), item.usage.variableName)
          .then(newVar => ({ ok: true as const, newVar, usage: item.usage }))
          .catch(e => ({ ok: false as const, error: String(e), usage: item.usage }))
      )
    );

    for (const result of results) {
      if (!result.ok) {
        errors.push(`Import failed: ${result.usage.variableName}`);
        continue;
      }
      for (const loc of result.usage.locations) {
        try {
          applyVariable(loc, result.newVar);
          replaced++;
        } catch (e) {
          errors.push(`Apply failed: ${result.usage.variableName} → "${loc.nodeName}"`);
        }
      }
    }

    const current = Math.min(i + BATCH, totalToMigrate);
    send('MIGRATE_PROGRESS', { current, total: totalToMigrate, replaced, elapsed: ms(tTotal) });

    if (current < totalToMigrate) {
      await new Promise(r => setTimeout(r, 1));
    }
  }

  const elapsed = ms(tTotal);
  console.log(`Migrate: ${replaced} replaced, ${notFound.length} not found, ${errors.length} errors, ${elapsed}`);
  send('MIGRATE_COMPLETE', { result: { replaced, notFound, errors } as MigrateResult, elapsed });
}
