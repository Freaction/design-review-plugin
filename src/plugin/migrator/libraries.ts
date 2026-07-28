import { LibraryCollectionInfo } from './types';
import { ms, perf, send } from './utils';

export async function onGetLibraries(): Promise<void> {
  const t = perf.now();
  const cols = await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync();
  console.log(`Libraries: ${cols.length} collections, ${ms(t)}`);
  const collections: LibraryCollectionInfo[] = cols.map(c => ({
    key: c.key, name: c.name, libraryName: c.libraryName,
  }));
  send('LIBRARIES_LOADED', { collections });
}
