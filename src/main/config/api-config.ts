export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3333',
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
