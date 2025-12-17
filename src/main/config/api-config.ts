const envBase = import.meta.env.VITE_API_URL;
const inferredBase = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3333';

if (!envBase && import.meta.env.MODE === 'production') {
  // In production we want the deploy to explicitly set `VITE_API_URL`.
  // This helps avoid the app pointing to localhost after deployment.
  // Keep a console warning so the issue is visible in browser console/logs.
  // eslint-disable-next-line no-console
  console.warn('[API_CONFIG] VITE_API_URL is not set. Falling back to window.location.origin. Set VITE_API_URL in your hosting env.');
}

export const API_CONFIG = {
  baseURL: envBase || inferredBase,
  timeout: 30000,
} as const;

export const API_ENDPOINTS = {
  // Auth
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    me: '/auth/me',
    googleLogin: '/auth/google',
  },

  // Users
  users: {
    base: '/users',
    byId: (id: string) => `/users/${id}`,
    updateRole: (id: string) => `/users/${id}/role`,
  },

  // Companies
  companies: {
    base: '/companies',
    byId: (id: string) => `/companies/${id}`,
  },

  // Notes / Requests
  notes: {
    base: '/notes',
    byId: (id: string) => `/notes/${id}`,
    stats: '/notes/stats',
  },

  // Requests (backend endpoint)
  requests: {
    base: '/requests',
    byId: (id: string) => `/requests/${id}`,
    cancel: (id: string) => `/requests/${id}/cancel`,
    updateStatus: (id: string) => `/requests/${id}/status`,
  },

  // Requested Notes
  requestedNotes: {
    base: '/requested-notes',
    byId: (id: string) => `/requested-notes/${id}`,
    attachments: (id: string) => `/requested-notes/${id}/attachments`,
    history: (id: string) => `/requested-notes/${id}/history`,
    comments: (id: string) => `/requested-notes/${id}/comments`,
  },
} as const;
