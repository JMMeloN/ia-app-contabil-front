// Mock temporário para desenvolvimento (substituir pelo hook real quando o backend estiver pronto)
export function useAuth() {
  // Mock de usuário autenticado
  const mockUser = {
    id: '1',
    email: 'usuario@teste.com',
    name: 'Usuário Teste',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return {
    user: mockUser,
    isLoading: false,
    isAuthenticated: true,
  };
}
