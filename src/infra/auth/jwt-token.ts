interface JwtPayload {
  exp?: number;
}

function decodeBase64Url(value: string): string {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
  return window.atob(padded);
}

export function getJwtPayload(token: string): JwtPayload | null {
  try {
    const [, payload] = token.split('.');
    if (!payload) return null;

    return JSON.parse(decodeBase64Url(payload));
  } catch {
    return null;
  }
}

export function isJwtExpired(token: string, clockSkewSeconds = 30): boolean {
  const payload = getJwtPayload(token);
  if (!payload?.exp) return true;

  return Date.now() + clockSkewSeconds * 1000 >= payload.exp * 1000;
}

export function clearAuthStorage(): void {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user_role');
}
