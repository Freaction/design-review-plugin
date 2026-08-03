const TOKEN_KEY = 'figma_pat';

export async function saveFigmaToken(token: string): Promise<void> {
  const value = String(token || '').trim();
  if (!value) {
    await figma.clientStorage.deleteAsync(TOKEN_KEY);
    return;
  }
  await figma.clientStorage.setAsync(TOKEN_KEY, value);
}

export async function loadFigmaToken(): Promise<string | null> {
  const value = await figma.clientStorage.getAsync(TOKEN_KEY);
  return typeof value === 'string' && value.trim() ? value.trim() : null;
}

export function tokenHint(token: string | null): string {
  if (!token) return '';
  return token.length <= 4 ? '••••' : `••••${token.slice(-4)}`;
}
