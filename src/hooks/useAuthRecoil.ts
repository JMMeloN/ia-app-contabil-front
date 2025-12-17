// TODO: Implementar quando o backend estiver pronto
export const useAuthRecoil = () => {
  return {
    user: null,
    isLoading: false,
    isAuthenticated: false,
  };
};

export const useAuth = useAuthRecoil;
