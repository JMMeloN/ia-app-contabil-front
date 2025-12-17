import type { UserRole } from '@/types/user';

// Hook para gerenciar perfil do usuário
export function useUserRole() {
  // Primeiro tenta pegar do login real
  const userRole = (typeof window !== 'undefined'
    ? localStorage.getItem('user_role')
    : null) as string | null;

  // Se não tiver role do login, usa o mock
  const savedMockRole = (typeof window !== 'undefined'
    ? localStorage.getItem('mock_user_role')
    : null) as UserRole | null;

  // Mapear roles do backend para o frontend
  let role: UserRole = 'cliente';
  if (userRole) {
    if (userRole === 'CLIENTE') role = 'cliente';
    else if (userRole === 'OPERACIONAL') role = 'operacional';
    else if (userRole === 'ADMIN') role = 'admin';
  } else if (savedMockRole && ['cliente', 'operacional', 'admin'].includes(savedMockRole)) {
    role = savedMockRole;
  }

  // Debug - mostrar qual role está sendo usado
  if (typeof window !== 'undefined') {
    console.log('🔑 Role atual:', role, userRole ? '(real)' : '(mock)');
  }

  return {
    role,
    userProfile: null,
    loading: false,
    error: null,
  };
}
