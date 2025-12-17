import { useState, useEffect } from 'react';
import { makeLogin, makeRegister, makeGetCurrentUser } from '@/main/factories';
import type { LoginParams } from '@/domain/usecases/auth/login';
import type { RegisterParams } from '@/domain/usecases/auth/register';
import type { UserModel } from '@/domain/models/auth-model';

/**
 * Hook de autenticação integrado com a API
 * Este é um exemplo de como integrar a arquitetura com React
 */
export function useAuthIntegrated() {
  const [user, setUser] = useState<UserModel | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Verifica se o usuário está autenticado ao carregar
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('access_token');

    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const getCurrentUserUseCase = makeGetCurrentUser();
      const userData = await getCurrentUserUseCase.execute();

      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (params: LoginParams) => {
    setIsLoading(true);
    try {
      const loginUseCase = makeLogin();
      const authData = await loginUseCase.execute(params);

      // Salvar tokens
      localStorage.setItem('access_token', authData.accessToken);
      if (authData.refreshToken) {
        localStorage.setItem('refresh_token', authData.refreshToken);
      }

      const userWithDates: UserModel = {
        ...authData.user,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setUser(userWithDates);
      setIsAuthenticated(true);

      return authData;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (params: RegisterParams) => {
    setIsLoading(true);
    try {
      const registerUseCase = makeRegister();
      const authData = await registerUseCase.execute(params);

      // Salvar tokens
      localStorage.setItem('access_token', authData.accessToken);
      if (authData.refreshToken) {
        localStorage.setItem('refresh_token', authData.refreshToken);
      }

      const userWithDates: UserModel = {
        ...authData.user,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setUser(userWithDates);
      setIsAuthenticated(true);

      return authData;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
    setIsAuthenticated(false);
  };

  return {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
  };
}
