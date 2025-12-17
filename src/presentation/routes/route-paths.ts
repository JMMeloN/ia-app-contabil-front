/**
 * Definição centralizada de rotas do sistema
 */

// Rotas Públicas
export const PUBLIC_ROUTES = {
  HOME: '/',
  SIGN_IN: '/sign-in',
  SIGN_UP: '/sign-up',
  RECOVER_PASSWORD: '/recover-password',
} as const;

// Rotas do Usuário Comum (Prestador de Serviço)
export const USER_ROUTES = {
  DASHBOARD: '/dashboard',
  MY_REQUESTS: '/minhas-solicitacoes',
  NEW_REQUEST: '/nova-solicitacao',
  MY_COMPANIES: '/minhas-empresas',
  NEW_COMPANY: '/cadastrar-empresa',
  PROFILE: '/perfil',
} as const;

// Rotas do Operacional
export const OPERATIONAL_ROUTES = {
  DASHBOARD: '/operacional/dashboard',
  ALL_REQUESTS: '/operacional/solicitacoes',
  PENDING_REQUESTS: '/operacional/pendentes',
  PROCESSED_REQUESTS: '/operacional/processadas',
} as const;

// Rotas do Admin
export const ADMIN_ROUTES = {
  DASHBOARD: '/admin/dashboard',
  USERS: '/admin/usuarios',
  SETTINGS: '/admin/configuracoes',
} as const;

// Helper para verificar tipo de rota
export const isPublicRoute = (path: string) => {
  return Object.values(PUBLIC_ROUTES).includes(path as any);
};

export const isUserRoute = (path: string) => {
  return Object.values(USER_ROUTES).includes(path as any);
};

export const isOperationalRoute = (path: string) => {
  return path.startsWith('/operacional');
};

export const isAdminRoute = (path: string) => {
  return path.startsWith('/admin');
};
