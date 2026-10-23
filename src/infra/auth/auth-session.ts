import axios from 'axios';
import { API_CONFIG } from '@/main/config/api-config';
import { clearAuthStorage } from '@/infra/auth/jwt-token';

const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_ROLE_KEY = 'user_role';

interface RefreshResponse {
  accessToken: string;
  refreshToken?: string;
}

export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function saveSession(params: { accessToken: string; refreshToken?: string | null; role?: string }): void {
  localStorage.setItem(ACCESS_TOKEN_KEY, params.accessToken);
  if (params.refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, params.refreshToken);
  }
  if (params.role) {
    localStorage.setItem(USER_ROLE_KEY, params.role);
  }
}

let pendingRefresh: Promise<string | null> | null = null;

/**
 * Exchanges the stored refresh token for a new access token. The API rotates the
 * refresh token, so the new one is stored as well. Concurrent callers share one
 * request. Returns the new access token, or null when the session cannot be renewed.
 */
export function refreshAccessToken(): Promise<string | null> {
  if (pendingRefresh) {
    return pendingRefresh;
  }

  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    return Promise.resolve(null);
  }

  pendingRefresh = axios
    .post<RefreshResponse>(
      `${API_CONFIG.baseURL}/auth/refresh`,
      { refreshToken },
      { timeout: 15000 }
    )
    .then((response) => {
      const { accessToken, refreshToken: rotated } = response.data;
      if (!accessToken) return null;
      saveSession({ accessToken, refreshToken: rotated });
      return accessToken;
    })
    .catch(() => null)
    .finally(() => {
      pendingRefresh = null;
    });

  return pendingRefresh;
}

/**
 * Revokes the refresh session on the server (best effort) and clears local storage.
 */
export async function logoutSession(): Promise<void> {
  const refreshToken = getRefreshToken();

  if (refreshToken) {
    try {
      await axios.post(`${API_CONFIG.baseURL}/auth/logout`, { refreshToken }, { timeout: 10000 });
    } catch {
      // Local cleanup must happen even when the API is unreachable.
    }
  }

  clearAuthStorage();
  localStorage.removeItem('mock_user_role');
}
